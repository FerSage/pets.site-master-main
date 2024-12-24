import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/card';

const FoundAnimalsCards = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const isMainPage = location.pathname === '/';

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('https://pets.сделай.site/api/pets');
        const result = await response.json();

        if (result.data && result.data.orders) {
          const sortedAnimals = result.data.orders.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          setAnimals(sortedAnimals);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!animals.length) {
    return <div>Нет найденных животных</div>;
  }

  const displayedAnimals = animals

  return (
    <div className="container mt-5">
      <div className="row">
        {displayedAnimals.map((animal) => (
          <Card key={animal.id} data={animal} />
        ))}
      </div>
    </div>
  );
};

export default FoundAnimalsCards;
