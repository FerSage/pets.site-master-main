import React, { useState, useEffect } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';

const AnimalCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiHost = "https://pets.сделай.site"; // Базовый адрес API

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${apiHost}/api/pets/slider`);
        if (response.ok) {
          const data = await response.json();
          setSlides(data?.data?.pets || []);
        } else {
          console.error('Ошибка загрузки данных слайдера');
        }
      } catch (error) {
        console.error('Ошибка подключения к серверу:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '450px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </div>
    );
  }

  if (!slides.length) {
    return null; // Если данные отсутствуют
  }

  return (
    <div className="d-flex justify-content-center">
      <Carousel className="w-75 p-3">
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img
              className="d-block rounded"
              src={`${apiHost}${slide.image}`} // Формирование полного URL
              alt={slide.description}
              style={{ width: '100%', height: '450px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h5 className="bg-dark text-white" style={{ borderRadius: '50px', padding: '3px' }}>
                {slide.kind}: {slide.description}
              </h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default AnimalCarousel;
