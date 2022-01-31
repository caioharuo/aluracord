import appConfig from '../../config.json';

export function Title({ children, tag }) {
  const Tag = tag || 'h1';

  return (
    <>
      <Tag>{children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.primary[500]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
