import React, { FC, HTMLProps, HTMLAttributes, ReactNode } from "react";

interface HtmlProps extends HTMLProps<HTMLHtmlElement> {
  htmlAttributes: HTMLAttributes<HTMLHtmlElement>;
  bodyAttributes: HTMLAttributes<HTMLBodyElement>;
  titleNode: ReactNode;
  metaNode: ReactNode;
  linkNodes: ReactNode[];
  styleNodes: ReactNode[];
  scriptNodes: ReactNode[];
  content: string;
}

const Html: FC<HtmlProps> = function ({
  htmlAttributes,
  bodyAttributes,
  titleNode,
  metaNode,
  linkNodes,
  styleNodes,
  scriptNodes,
  children,
  content,
  ...restProps
}: HtmlProps) {
  return (
    <html {...htmlAttributes} {...restProps}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {titleNode}
        {metaNode}
        {linkNodes}
        {styleNodes}
      </head>
      <body {...bodyAttributes}>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }}></div>
        {scriptNodes}
      </body>
    </html>
  );
};

export default Html;
