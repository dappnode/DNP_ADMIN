import React from "react";
import Button from './Footer/Button.js';

let brandLink = 'https://github.com/dappnode/Dappnode';
let brandName = 'DappNode @2018';

export default class Header extends React.Component {

  render() {
    return (
      <footer>
        <a class='footerLink' href={brandLink}>{brandName}</a>
      </footer>
    );
  }
}
