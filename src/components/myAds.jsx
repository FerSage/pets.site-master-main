import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MyAds = ({ userId }) => {
    const [ads, setAds] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAd, setCurrentAd] = useState(null);
    const [editData, setEditData] = useState({ kind: '', description: '', mark: '', photo1: null, photo2: null, photo3: null });

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch('https://pets.сделай.site/api/users/orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    setAds(data.data.orders);
                } else {
                    setError(data.error.message || 'Ошибка при загрузке объявлений.');
                }
            } catch (error) {
                setError('Произошла ошибка при подключении к серверу.');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [userId]);

    const handleDelete = async () => {
        if (!currentAd) return;
        try {
            const response = await fetch(`https://pets.сделай.site/api/users/orders/${currentAd.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                setAds(ads.filter((ad) => ad.id !== currentAd.id));
            } else {
                setError(data.error.message || 'Ошибка при удалении объявления.');
            }
        } catch (error) {
            setError('Произошла ошибка при удалении объявления.');
            console.log(error);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!currentAd) return;
        try {
            const formData = new FormData();
            formData.append('kind', editData.kind);
            formData.append('description', editData.description);
            formData.append('mark', editData.mark);
            if (editData.photos1) formData.append('photos1', editData.photos1);
            if (editData.photos2) formData.append('photos2', editData.photos2);
            if (editData.photos3) formData.append('photos3', editData.photos3);

            const response = await fetch(`https://pets.сделай.site/api/pets/${currentAd.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.status === 200) {
                setAds(ads.map((ad) => (ad.id === currentAd.id ? { ...ad, ...editData } : ad)));
            } else {
                setError(data.error.message || 'Ошибка при редактировании объявления.');
            }
        } catch (error) {
            setError('Произошла ошибка при редактировании объявления.');
            console.log(error);
        } finally {
            setShowEditModal(false);
        }
    };

    if (loading) {
        return <div>Загрузка объявлений...</div>;
    }

    return (
        <section>
            <h2>Мои объявления</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {ads?.length === 0 ? (
                    <div className="alert alert-info">У вас нет добавленных объявлений.</div>
                ) : (
                    ads?.map((ad) => (
                        <div className="col" key={ad.id} style={{ width: '25%' }}>
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">{ad.kind}</h3>
                                    <img
                                        src={`https://pets.сделай.site${ad.photos}`}
                                        className="card-img-top"
                                        alt={ad.description}
                                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                    />
                                    <p className="card-text">Описание: {ad.description}</p>
                                    <p className="card-text">Клеймо: {ad.mark}</p>
                                    <p className="card-text">Район: {ad.district}</p>
                                    <p className="card-text">Дата: {ad.date}</p>
                                    <p className="card-text">
                                        <small style={{ color: 'GrayText' }}>Статус: {ad.status}</small>
                                    </p>

                                    <button
                                        className="btn btn-secondary m-2"
                                        onClick={() => {
                                            setCurrentAd(ad);
                                            setEditData({
                                                kind: ad.kind,
                                                description: ad.description,
                                                mark: ad.mark,
                                                photos1: null,
                                                photos2: null,
                                                photos3: null,
                                            });
                                            setShowEditModal(true);
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setCurrentAd(ad);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Модальное окно для удаления */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить объявление "{currentAd?.kind}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно для редактирования */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование объявления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formKind">
                            <Form.Label>Тип животного</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.kind}
                                onChange={(e) => setEditData({ ...editData, kind: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formMark">
                            <Form.Label>Клеймо</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.mark}
                                onChange={(e) => setEditData({ ...editData, mark: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoto1">
                            <Form.Label>Фото 1</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setEditData({ ...editData, photos1: e.target.files[0] })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoto2">
                            <Form.Label>Фото 2</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setEditData({ ...editData, photos2: e.target.files[0] })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoto3">
                            <Form.Label>Фото 3</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setEditData({ ...editData, photos3: e.target.files[0] })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default MyAds;
