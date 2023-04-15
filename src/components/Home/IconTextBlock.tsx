import { FC, ReactNode } from 'react';

interface IconTextBlockProps {
  iconPath: string;
  title: string;
  children: ReactNode;
}

const IconTextBlock: FC<IconTextBlockProps> = ({ iconPath, title, children }) => {
  const localStyle = {
    backgroundImage: `url(${iconPath})`,
  };
  return (
    <article className="icon-text-block">
      <i className="icon-text-block__icon" style={localStyle}></i>
      <h6>{title}</h6>
      <p>{children}</p>
    </article>
  );
};

export default IconTextBlock;
