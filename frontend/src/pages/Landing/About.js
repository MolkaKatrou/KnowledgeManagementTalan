import React from 'react';
import Cards from '../../Components/landing/Cards'
import Company from '../../Components/landing/Company';
import Footer from '../../Components/landing/Footer';
import Navbar from '../../Common/Navbar';

function About() {
  return (
    <>
      <Navbar/>
      <Company />
      <Cards/>
      <Footer/>
    </>
  );
}

export default About;