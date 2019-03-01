import React from "react";
import newTabProps from "utils/newTabProps";

// _
/* eslint-disable no-useless-escape */
// _

const TextWithUrls = ({ text }) => {
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  // s = 'oh my http://google.com ddddd http://dappnode.io'
  // ["http://google.com", "http://dappnode.io"]
  const urls = text.match(regex);
  // If there are no urls, return the original string
  if (!urls) return <span>{text}</span>;
  // ["oh my ", " ddddd ", ""]
  const texts = text.split(regex).filter(x => typeof x !== "undefined");
  const elements = [];
  urls.forEach((url, i) => {
    elements.push(<span key={`t${i}`}>{texts[i]} </span>);
    elements.push(
      <a key={`u${i}`} href={url} {...newTabProps}>
        {url}{" "}
      </a>
    );
  });
  return elements;
};

export default TextWithUrls;
