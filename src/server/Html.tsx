import React, {
  FC,
  HTMLProps,
  HtmlHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

interface HtmlProps extends HTMLProps<HTMLHtmlElement> {
  htmlAttributes: HtmlHTMLAttributes<HTMLHtmlElement>;
  bodyAttributes: HTMLAttributes<HTMLBodyElement>;
  titleNode: ReactNode;
  metaNode: ReactNode;
  linkNodes: ReactNode[];
  styleNodes: ReactNode[];
  scriptNodes: ReactNode[];
  content: string;
  preloadedState: any;
}

const Html: FC<HtmlProps> = function ({
  htmlAttributes,
  bodyAttributes,
  titleNode,
  metaNode,
  linkNodes,
  styleNodes,
  scriptNodes,
  content,
  preloadedState,
  ...restProps
}: HtmlProps) {
  return (
    <html {...htmlAttributes} {...restProps}>
      <head>
        <meta charSet="utf-8" />
        <link
          rel="shortcut icon"
          href={`${process.env.PUBLIC_URL}/favicon.ico`}
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href={`${process.env.PUBLIC_URL}/manifest.json`} />
        {titleNode}
        {metaNode}
        {linkNodes}
        {styleNodes}
      </head>
      <body {...bodyAttributes}>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }}></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__ = ${JSON.stringify(
              preloadedState
            ).replace(/</g, "\\u003c")}`,
          }}
        ></script>
        {scriptNodes}
      </body>
    </html>
  );
};

export default Html;
