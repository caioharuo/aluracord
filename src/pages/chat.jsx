import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, TextField } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js';

import appConfig from '../../config.json';

import { Header } from '../components/Header';
import { MessageList } from '../components/MessageList';
import { ButtonSendSticker } from '../components/ButtonSendSticker';

import ReactLoading from 'react-loading';
import toast, { Toaster } from 'react-hot-toast';
import Head from 'next/head';

const SUPABASE_URL = 'https://hxzmylwvbetvjqdyhane.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNzY1MiwiZXhwIjoxOTU4ODkzNjUyfQ.FdGc8bBDVFxwdsItRNRl8rTnTpdGQExVcFQ_C-VNY2s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenMessagesInRealTime(addMessage) {
  return supabase
    .from('messages')
    .on('INSERT', (response) => {
      addMessage(response.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const loggedUser = router.query.username;

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessageList(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });

    listenMessagesInRealTime((newMessage) => {
      setMessageList((currentListValue) => {
        return [newMessage, ...currentListValue];
      });
    });
  }, []);

  function handleNewMessage(newMessage) {
    const message = {
      from: loggedUser,
      text: newMessage,
    };

    if (message.text.trim().length === 0) {
      toast('A mensagem deve possuir pelo menos 1 carácter!', {
        icon: '😅',
      });
      return;
    }

    supabase.from('messages').insert([message]).then();

    setMessage('');
  }

  async function handleDeleteMessage(messageId) {
    await supabase.from('messages').delete().match({ id: messageId });
    setMessageList(messageList.filter((message) => message.id != messageId));
    toast('Mensagem apagada!', {
      icon: '🗑️',
    });
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.neutrals[200],
        backgroundImage:
          'url(https://wallpaperforu.com/wp-content/uploads/2020/06/jocker-wallpaper-200611170910101280x960.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000'],
      }}
    >
      <Head>
        <title>Aluracord | Chat</title>
      </Head>

      <Toaster position="top-left" reverseOrder={false} />

      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          {isLoading ? (
            <Box
              styleSheet={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                color: appConfig.theme.colors.neutrals['000'],
                marginBottom: '16px',
              }}
            >
              <ReactLoading
                type="spin"
                color={appConfig.theme.colors.primary[500]}
              />
            </Box>
          ) : (
            <MessageList
              loggedUser={loggedUser}
              messages={messageList}
              onClickDeleteButton={(messageId) => {
                handleDeleteMessage(messageId);
              }}
            />
          )}

          <Box
            onSubmit={(event) => {
              event.preventDefault();
              handleNewMessage(message);
            }}
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              borderRadius: '0 5px 5px 0',
            }}
          >
            <TextField
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px 0 0 5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) =>
                handleNewMessage(`:sticker: ${sticker}`)
              }
            />
            <Button
              type="submit"
              label="Ok!"
              styleSheet={{
                marginRight: '12px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
