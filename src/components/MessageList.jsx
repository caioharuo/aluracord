import { Box, Button, Image, Text } from '@skynexui/components';

import appConfig from '../../config.json';

export function MessageList({ messages, onClickDeleteButton, loggedUser }) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
      }}
    >
      {messages.map((message) => (
        <Text
          display="inline-block"
          key={message.id}
          tag="li"
          styleSheet={{
            position: 'relative',

            borderRadius: '5px',
            padding: '6px',
            marginBottom: '12px',
            hover: {
              backgroundColor: appConfig.theme.colors.neutrals[700],
            },
          }}
        >
          <Box
            styleSheet={{
              marginBottom: '8px',
            }}
          >
            <Image
              styleSheet={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
              }}
              src={`https://github.com/${message.from}.png`}
            />
            <Text tag="strong">{message.from}</Text>
            <Text
              styleSheet={{
                fontSize: '10px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[300],
              }}
              tag="span"
            >
              {new Date().toLocaleDateString()}
            </Text>
          </Box>
          {message.text.startsWith(':sticker:') ? (
            <Image
              src={message.text.replace(':sticker:', '')}
              styleSheet={{
                maxWidth: '350px',
              }}
            />
          ) : (
            message.text
          )}

          {loggedUser === message.from && (
            <Button
              onClick={() => onClickDeleteButton(message.id)}
              size="sm"
              iconName="FaRegTrashAlt"
              styleSheet={{
                maxWidth: '24px',
                maxHeight: '24px',
                borderRadius: '4px ',
                position: 'absolute',
                top: '0',
                right: '0',
                margin: '8px',
                backgroundColor: 'transparent',
                color: appConfig.theme.colors.neutrals[300],
                hover: {
                  borderRadius: '4px',
                  backgroundColor: appConfig.theme.colors.neutrals[500],
                },
                focus: {
                  borderRadius: '4px',
                  backgroundColor: appConfig.theme.colors.neutrals[500],
                },
              }}
            />
          )}
        </Text>
      ))}
    </Box>
  );
}
