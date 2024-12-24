import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Валидация данных
  const validate = () => {
    const errors = {};
    const nameRegex = /^[А-Яа-яЁё\s-]+$/;
    const phoneRegex = /^\+?\d{1,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/;

    if (!formData.name.trim() || !nameRegex.test(formData.name)) {
      errors.name = 'Имя может содержать только кириллицу, пробелы и дефисы.';
    }

    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Телефон должен быть в формате +7XXXXXXXXXX.';
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Введите корректный email.';
    }

    if (!formData.password || !passwordRegex.test(formData.password)) {
      errors.password =
        'Пароль должен быть не менее 7 символов и содержать заглавные, строчные буквы и цифры.';
    }

    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Пароли не совпадают.';
    }

    if (!formData.confirm) {
      errors.confirm = 'Необходимо согласие на обработку данных.';
    }

    return errors;
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Очистка сообщений
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Формирование тела запроса
    const requestBody = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirmation,
      confirm: formData.confirm ? 1 : 0,
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch('https://pets.сделай.site/api/register', requestOptions);

      if (response.ok) {
        console.log(response);
        setSuccessMessage('Регистрация прошла успешно!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          password: '',
          passwordConfirmation: '',
          confirm: false,
        });
      } else if (response.status === 422) {
        const errorData = await response.json();
        const serverErrors = errorData.error?.errors || {};
        setErrors(serverErrors);
      } else {
        setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      setErrorMessage('Ошибка сети. Проверьте соединение.');
    }
  };

  // Обработчик изменения полей
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        id="registrationForm"
        className="p-4 border rounded w-50 bg-light"
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-4">Регистрация</h3>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* Имя */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Имя
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите имя"
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        {/* Телефон */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Телефон
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7XXXXXXXXXX"
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        {/* Пароль */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        {/* Подтверждение пароля */}
        <div className="mb-3">
          <label htmlFor="password_confirmation" className="form-label">
            Подтвердите пароль
          </label>
          <input
            type="password"
            className="form-control"
            id="password_confirmation"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            placeholder="Повторите пароль"
          />
          {errors.passwordConfirmation && (
            <div className="text-danger">{errors.passwordConfirmation}</div>
          )}
        </div>

        {/* Согласие */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="confirm"
            name="confirm"
            checked={formData.confirm}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="confirm">
            Согласен на обработку персональных данных
          </label>
          {errors.confirm && <div className="text-danger">{errors.confirm}</div>}
        </div>

        {/* Кнопка отправки */}
        <button type="submit" className="btn btn-primary w-100">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
