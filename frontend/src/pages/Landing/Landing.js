import React, {useContext} from "react";
import { Button } from '../../Components/Button';
import image1 from '../../images/home1.png';
import '../../App.css';
import "../../assets/home.css";
import Navbar from "../../Common/Navbar";
import { HomeContext } from "../../Context/HomeContext";

export default function Landing () {
  const {t} = useContext(HomeContext)
  return (
    <>
    <Navbar/>
    <section className="home-container backgroundColor">
      <div className="home-wrapper">
      <img src={image1}/>
      <div className="Left-wrapper">
      <h1 className='login-h2'>{t('Landing1')}</h1>
      <h2>{t('Landing2')} </h2>
      <div className="get-started">
        <Button
          className='btns'
          buttonStyle='.btn--primary'
          buttonSize='btn--large'
        >
         {t('Get_Started')} 
        </Button>
        </div>
        </div>
  
       </div>
      
    </section>
    </>
  );
};

