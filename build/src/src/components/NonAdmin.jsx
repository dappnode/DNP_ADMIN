import React from "react";
import LogoImg from "img/DAppNode-Black.png";

const NonAdmin = () => (
  <div className="container-fluid app-content">
    <div className="body">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to the DAppNode admin page!</h1>
        <p className="lead">
          Turns out that you are not an admin. If you need to do admin stuff
          please contact the admin of this DAppNode to get access
        </p>
      </div>
    </div>
  </div>
);

export default NonAdmin;
