import React, { useState, useEffect } from 'react';
import Pagination from '../components/pagination';
import Card from '../components/LACard';

const FoundAnimalsCards = ({ searchParams }) => {
    const [animals, setAnimals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnimals = async (page) => {
        const { district, kind } = searchParams;
    
        // Формируем URL с параметрами

        try {
            const response = await fetch(`https://pets.сделай.site/api/search/order?district=${district}&kind=${kind}`);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Данные:', result);
                setAnimals(result.data.orders);
                setTotalPages(Math.ceil(result.data.orders.length / 10));
            } else if (response.status === 204) {
                setAnimals([]);
            } else {
                throw new Error(`Ошибка: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить данные.');
        }
    };
    

    useEffect(() => {
        fetchAnimals(currentPage);
    }, [searchParams, currentPage]);

    return (
        <div className="container mt-5">
            <h2>Результаты поиска</h2>
            {loading ? (
                <div>Загрузка...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : animals.length > 0 ? (
                <>
                    <div className="row">
                        {animals.slice((currentPage - 1) * 10, currentPage * 10).map((animal) => (
                            <Card key={animal.id} data={animal} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </>
            ) : (
                <div className="alert alert-info">Нет результатов по вашему запросу.</div>
            )}
        </div>
    );
};

export default FoundAnimalsCards;