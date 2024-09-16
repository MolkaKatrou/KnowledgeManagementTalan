import React, { useContext } from 'react';
import '../../assets/About.css';
import CardItem from './CardItem';
import msg from '../../images/msg.png';
import post from '../../images/post.jpg';
import qanda from '../../images/qanda.jpg';
import { HomeContext } from '../../Context/HomeContext';




function Cards() {
  const {t} = useContext(HomeContext)
  return (
    <div className='cards backgroundColor'>
      <h1 className='h1'>{t('offer')}</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src={msg}
              text={t('card1')}
              

            />
            <CardItem
              src={post}
              text={t('card2')}
             

            />
            <CardItem
              src={qanda}
              text={t('card3')}
           

            />
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Cards;
