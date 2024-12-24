import React, { useState } from 'react';

const SubscriptionForm = () => {
  // Состояния для email, сообщений об ошибке и успехе
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Обработчик изменения в поле ввода
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Сброс сообщений
    setSuccessMessage('');
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Пожалуйста, введите адрес электронной почты.');
      return;
    }

    const requestBody = {
      email: email,
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch('https://pets.сделай.site/api/subscription', requestOptions);

      if (response.ok) {
        console.log(response);
        setSuccessMessage('Спасибо за подписку! Теперь вы будете получать новости.');
        setEmail('');
      } else {
        setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      setErrorMessage('Ошибка сети. Проверьте соединение.');
    }
  };

  return (
    <div className="m-3 text-center">
      <h1 className="mb-4">
        Подпишитесь на нас, чтобы всегда быть в курсе нахождения животных!
      </h1>

      {successMessage ? (
        <div className="alert alert-success">{successMessage}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            className="input-group justify-content-center"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <span className="input-group-text" id="addon-wrapping">
              @
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Адрес электронной почты"
              aria-label="Имя пользователя"
              aria-describedby="addon-wrapping"
              value={email}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </div>
        </form>
      )}

      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
};

export default SubscriptionForm;
