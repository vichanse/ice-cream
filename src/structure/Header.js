import React from 'react';
import iceCreamImg from '../assets/img/ultimate-ice-cream.svg';
import FocusLink from './FocusLink';

const Header = () => (
  <header>
    <h1>
      <img src={iceCreamImg} alt="" />
      Vichanse Ice Cream
    </h1>
    <nav>
      <FocusLink to="/" activeClassName="active" exact>
        Menu
      </FocusLink>
    </nav>
  </header>
);

export default Header;
