import React from 'react';
import './styles/ice-cream.scss';
import Header from './structure/Header';
import Footer from './structure/Footer';
import Menu from './ice-cream/Menu';
const App = () => {
  return (
    <>
      <Header />
      <Menu />
      <Footer />
    </>
  );
};

export default App;
