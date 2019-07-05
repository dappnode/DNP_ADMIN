import React from "react";
import ReactMarkdown from "react-markdown";
import ReadMore from "components/ReadMore";

export default function ReadMoreMarkdown({ source }) {
  return (
    <ReadMore>
      <ReactMarkdown className="no-p-style" source={source} />
    </ReadMore>
  );
}
