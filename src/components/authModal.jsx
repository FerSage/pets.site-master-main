import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import key from '../media/key.svg';
import emojiSmile from '../media/emoji-smile.svg';

const AuthModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  const validate = () => {
    const validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      validationErrors.email = 'Введите корректный email.';
    }
    if (!formData.password) {
      validationErrors.password = 'Введите пароль.';
    }

    return validationErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setServerMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('https://pets.сделай.site/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setServerMessage('Успешная авторизация!');
        const token = data?.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved:', token);
          handleClose();
          // Обновляем страницу для обновления состояния аутентификации
          window.location.reload();
        }
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrors(errorData.error?.errors || {});
      } else if (response.status === 401) {
        setServerMessage('Неверный email или пароль.');
      } else {
        setServerMessage('Произошла ошибка. Попробуйте позже.');
      }
    } catch (error) {
      setServerMessage('Ошибка сети. Проверьте соединение.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Авторизация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {serverMessage && (
            <div className={`alert ${errors.email || errors.password ? 'alert-danger' : 'alert-success'}`}>
              {serverMessage}
            </div>
          )}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Электронная почта</Form.Label>
            <div className="input-group">
              <span className="input-group-text">
                <img src={emojiSmile} alt="Эмодзи" style={{ width: '20px' }} />
              </span>
              <Form.Control
                type="email"
                name="email"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <div className="input-group">
              <span className="input-group-text">
                <img src={key} alt="Ключ" style={{ width: '20px' }} />
              </span>
              <Form.Control
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCheck">
            <Form.Check type="checkbox" label="Запомнить меня" />
          </Form.Group>
          <div className="mb-3">
            <Link to="/registration">Регистрация</Link>
          </div>
          <div className="mb-3">
            <a href="#forgot-password">Забыли пароль?</a>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отменить
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Войти
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthModal;
