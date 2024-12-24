import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalType, setModalType] = useState(null);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Вы не авторизованы.');
            navigate('/login');
        } else {
            fetchUserData(token);
        }
    }, [navigate]);

    const fetchUserData = async (token) => {
        setLoading(true);
        try {
            const response = await fetch(`https://pets.сделай.site/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const daysSinceRegistration = calculateDaysSinceRegistration(data.registrationDate);
                setUserData({
                    ...data,
                    daysSinceRegistration,
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ошибка при загрузке данных.');
            }
        } catch (error) {
            setError('Произошла ошибка при подключении к серверу.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysSinceRegistration = (registrationDate) => {
        const today = new Date();
        const registration = new Date(registrationDate);
        const diffTime = today - registration;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFeedback('Вы не авторизованы.');
            return;
        }

        const endpoint = modalType === 'phone' ? '/api/users/phone' : '/api/users/email';
        const body = modalType === 'phone' ? { phone: formData.phone } : { email: formData.email };

        try {
            const response = await fetch(`https://pets.сделай.site${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                setFeedback('Изменения успешно сохранены!');
                setModalType(null);
                fetchUserData(token); // Обновить данные пользователя
            } else {
                setFeedback(result.error.message || 'Ошибка при сохранении изменений.');
            }
        } catch (error) {
            setFeedback('Произошла ошибка при подключении к серверу.');
            console.log(error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {userData && (
                <main className="container mt-4">
                    <section className="mb-4">
                        <h2>Информация о пользователе</h2>
                        <ul className="list-group">
                            <li className="list-group-item">Имя: {userData.name}</li>
                            <li className="list-group-item">Email: {userData.email}</li>
                            <li className="list-group-item">Телефон: {userData.phone}</li>
                            <li className="list-group-item">Дней с момента регистрации: {userData.daysSinceRegistration}</li>
                            <li className="list-group-item">Объявлений добавлено: {userData.countOrder}</li>
                            <li className="list-group-item">Животных найдено: {userData.countPets}</li>
                        </ul>
                    </section>
                    <button className="btn btn-primary me-2" onClick={() => setModalType('email')}>
                        Изменить Email
                    </button>
                    <button className="btn btn-primary" onClick={() => setModalType('phone')}>
                        Изменить Телефон
                    </button>
                </main>
            )}

            <Modal show={!!modalType} onHide={() => setModalType(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Изменение {modalType === 'phone' ? 'телефона' : 'электронной почты'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId={`form${modalType}`}>
                            <Form.Label>{modalType === 'phone' ? 'Новый телефон' : 'Новый email'}</Form.Label>
                            <Form.Control
                                type="text"
                                name={modalType}
                                placeholder={`Введите новый ${modalType === 'phone' ? 'телефон' : 'email'}`}
                                value={formData[modalType] || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        {feedback && <div className="text-danger mb-3">{feedback}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalType(null)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleFormSubmit}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserDashboard;
