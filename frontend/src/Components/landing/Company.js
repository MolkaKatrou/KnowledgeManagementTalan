import React, { useContext } from 'react';
import { Button } from '../Button';
import '../../App.css';
import '../../assets/About.css';
import { HomeContext } from '../../Context/HomeContext';

function Company() {
    const {t} = useContext(HomeContext)
  return (
    <div className='hero-container'>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
         {t('Get_Started')}
        </Button>
  
      </div>
    </div>
  );
}

export default Company;