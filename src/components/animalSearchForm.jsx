import React, { useState } from 'react';

const AnimalSearchForm = ({ onSearch }) => {
    const [district, setDistrict] = useState('');
    const [kind, setKind] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!district && !kind) {
            alert('Укажите хотя бы один параметр для поиска!');
            return;
        }
        onSearch({ district, kind });
    };

    return (
        <main className="container mt-4">
            <h1>Поиск животных</h1>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="district" className="form-label">Район:</label>
                    <input
                        type="text"
                        id="district"
                        name="district"
                        className="form-control"
                        placeholder="Введите район"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="kind" className="form-label">Вид животного:</label>
                    <input
                        type="text"
                        id="kind"
                        name="kind"
                        className="form-control"
                        placeholder="Введите вид животного"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                    />
                </div>
                <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary">Найти</button>
                </div>
            </form>
        </main>
    );
};

export default AnimalSearchForm;