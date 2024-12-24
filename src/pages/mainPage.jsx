import PhotoCarousel from "../components/photoCarousel";
import FoundAnimalsCard from "../components/foundAnimalCards";
import SubForm from "../components/subscriptionForm";
import React from 'react';
import catImage from '../media/кошка.jpg';
import goatImage from '../media/коза.jpg';
import mouseImage from '../media/мышь.jpg';
import dogImage from '../media/собака.jpg';

const slidesData = [
  {
    image: catImage,
    alt: 'Кошка',
    caption: 'Найден хозяин!',
  },
  {
    image: goatImage,
    alt: 'Коза',
    caption: 'Найден хозяин!',
  },
  {
    image: mouseImage,
    alt: 'Мышь',
    caption: 'Найден хозяин!',
  },
  {
    image: dogImage,
    alt: 'Собака',
    caption: 'Найден хозяин!',
  },
];


const MainPage = () => {
    return (
        <div>
        <PhotoCarousel  slides={slidesData}/>
        <FoundAnimalsCard/>
        <SubForm/>
        </div>
    );
};

export default MainPage;