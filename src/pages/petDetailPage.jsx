import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PetDetail from '../components/petDetail';

const PetDetailPage = () => {
  const { id } = useParams(); // Извлекаем параметр id
  const [animal, setAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Запрос к API
    fetch(`https://pets.сделай.site/api/pets/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data?.data?.pet) {
          setAnimal(data.data.pet); // Сохраняем объект `pet` напрямую
        } else {
          throw new Error('Животное не найдено');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setAnimal(null);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <h2 className="text-center my-5">Загрузка...</h2>;
  }

  if (!animal) {
    return <h2 className="text-center my-5">Информация о животном не найдена.</h2>;
  }

  return <PetDetail data={animal} />;
};

export default PetDetailPage;
