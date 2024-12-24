import React, { useState, useEffect } from 'react';

const AddPetForm = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    kind: '',
    register: '0',
    password: '',
    passwordConfirmation: '',
    mark: '',
    description: '',
    photos1: null,
    photos2: null,
    photos3: null,
    confirm: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (token) {
      fetchUserData(token).then((data) => {
        if (data) {
          setFormData((prevData) => ({
            ...prevData,
            name: data.name,
            phone: data.phone,
            email: data.email,
          }));
        }
      });
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://pets.сделай.site/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        throw new Error('Ошибка авторизации');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files : value,
    }));
  };

  const handleRegisterChange = (e) => {
    setIsRegistered(e.target.value === '1');
  };

  const validateForm = () => {
    // Имя пользователя: только кириллица и пробелы, убираем пробелы в начале и конце
    const namePattern = /^[а-яА-ЯёЁ\s\-]+$/;
    if (!formData.name.trim() || !namePattern.test(formData.name)) {
      return 'Имя должно быть на русском языке и без лишних пробелов.';
    }

    // Телефон: только цифры и знак +
    const phonePattern = /^\+?\d{1,15}$/;
    if (!phonePattern.test(formData.phone)) {
      return 'Телефон должен содержать только цифры и знак "+" (до 15 цифр).';
    }

    // Почта: валидный формат почты
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      return 'Введите корректный адрес электронной почты.';
    }

    // Пароль: минимум 7 символов, 1 заглавная, 1 строчная, 1 цифра
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$/;
    if (isRegistered && !passwordPattern.test(formData.password)) {
      return 'Пароль должен содержать минимум 7 символов, включая одну заглавную букву, одну строчную и одну цифру.';
    }

    // Подтверждение пароля
    if (isRegistered && formData.password !== formData.passwordConfirmation) {
      return 'Пароли должны совпадать.';
    }

    // Обязательные поля
    if (!formData.name || !formData.phone || !formData.email || !formData.photos1 || !formData.confirm) {
      return 'Пожалуйста, заполните все обязательные поля.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация формы
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    // Создаем объект FormData для отправки данных
    const form = new FormData();
    form.append('name', formData.name);
    form.append('phone', formData.phone);
    form.append('email', formData.email);
    form.append('district', formData.district);
    form.append('kind', formData.kind);

    if (isRegistered) {
      form.append('password', formData.password);
      form.append('password_confirmation', formData.passwordConfirmation);
    }

    form.append('confirm', formData.confirm ? 1 : 0);
    form.append('mark', formData.mark);
    form.append('description', formData.description);

    // Добавляем фото
    if (formData.photos1 && formData.photos1.length > 0) {
      form.append('photos1', formData.photos1[0]);
    }
    if (formData.photos2 && formData.photos2.length > 0) {
      form.append('photos2', formData.photos2[0]);
    }
    if (formData.photos3 && formData.photos3.length > 0) {
      form.append('photos3', formData.photos3[0]);
    }

    try {
      // Отправляем запрос на API
      const response = await fetch('https://pets.сделай.site/api/pets', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      if (response.status === 200) {
        setSuccessMessage('Объявление успешно добавлено!');
        setErrorMessage('');
      } else {
        setErrorMessage(data.error.errors);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при отправке данных.');
      setSuccessMessage('');
    }
  };

  return (
    <main className="container mt-4">
      <h1>Добавление нового объявления</h1>
      <form id="addPetForm" className="needs-validation" onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Имя пользователя</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Phone Field */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Телефон</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Электронная почта</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* District Field */}
        <div className="mb-3">
          <label htmlFor="district" className="form-label">Район</label>
          <input
            type="text"
            className="form-control"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Kind Field */}
        <div className="mb-3">
          <label htmlFor="kind" className="form-label">Вид животного</label>
          <input
            type="text"
            className="form-control"
            id="kind"
            name="kind"
            value={formData.kind}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Register Option */}
        <div className="mb-3">
          <label htmlFor="register" className="form-label">Автоматическая регистрация</label>
          <select
            className="form-select"
            id="register"
            name="register"
            value={isRegistered ? '1' : '0'}
            onChange={handleRegisterChange}
            required
          >
            <option value="0">Нет</option>
            <option value="1">Да</option>
          </select>
        </div>

        {/* Password Fields (only for registered users) */}
        {isRegistered && (
          <>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordConfirmation" className="form-label">Подтверждение пароля</label>
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {/* Photo Fields */}
        <div className="mb-3">
          <label htmlFor="photos1" className="form-label">Фото 1</label>
          <input
            type="file"
            className="form-control"
            id="photos1"
            name="photos1"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photos2" className="form-label">Фото 2</label>
          <input
            type="file"
            className="form-control"
            id="photos2"
            name="photos2"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photos3" className="form-label">Фото 3</label>
          <input
            type="file"
            className="form-control"
            id="photos3"
            name="photos3"
            onChange={handleInputChange}
          />
        </div>

        {/* Mark */}
        <div className="mb-3">
          <label htmlFor="mark" className="form-label">Клеймо</label>
          <input
            type="text"
            className="form-control"
            id="mark"
            name="mark"
            value={formData.mark}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Описание</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Confirm Checkbox */}
        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="confirm"
            name="confirm"
            checked={formData.confirm}
            onChange={handleInputChange}
            required
          />
          <label className="form-check-label" htmlFor="confirm">
            Согласен на обработку персональных данных
          </label>
        </div>

        {/* Error or Success Messages */}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <button type="submit" className="btn btn-primary">Добавить объявление</button>
      </form>
    </main>
  );
};

export default AddPetForm;
