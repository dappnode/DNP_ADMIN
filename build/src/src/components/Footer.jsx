import React from "react";

let brandLink = "https://github.com/dappnode/Dappnode";
let brandName = "DappNode @2018";

export default class Header extends React.Component {
  render() {
    return (
      <footer>
        <a className="footerLink" href={brandLink}>
          {brandName}
        </a>
      </footer>
    );
  }
}
