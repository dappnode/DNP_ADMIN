import React from "react";
import RenderMarkdown from "components/RenderMarkdown";
import ReadMore from "components/ReadMore";

export default function ReadMoreMarkdown({ source }) {
  return (
    <ReadMore>
      <RenderMarkdown source={source} />
    </ReadMore>
  );
}
