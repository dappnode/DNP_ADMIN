import React from "react";
import ReactMarkdown from "react-markdown";
import "./renderMarkdown.scss";

function renderParagraph(props: any) {
  const { children } = props;

  if (
    children &&
    children[0] &&
    children.length === 1 &&
    children[0].props &&
    children[0].props.src
  ) {
    // rendering media without p wrapper

    return children;
  }

  return <p>{children}</p>;
}

export default function RenderMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      className="markdown-render"
      source={source}
      renderers={{
        paragraph: renderParagraph
      }}
    />
  );
}
