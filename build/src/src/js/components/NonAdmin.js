import React from 'react';
import LogoImg from '../../img/DAppNode-Black.png'

const NonAdmin = () => (
  <div class="container-fluid app-content">
    <div class='body'>

      <div class="jumbotron">
      <div class="logo-image-container nav-link text-center">
        <img src={LogoImg} class="img-fluid" alt="Responsive image"/>
      </div>
      <h1 class="display-4">Welcome to the DAppNode admin page!</h1>
      <p class="lead">Turns out that you are not an admin. If you need to do admin stuff please contact the admin of this DAppNode to get access</p>
      </div>

    </div>
  </div>
);

export default NonAdmin
