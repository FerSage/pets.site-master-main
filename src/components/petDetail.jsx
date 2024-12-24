import React from 'react';

function PetDetail({ data }) {
  const photos = [
    data.photos1,
    data.photos2,
    data.photos3,
  ].filter(Boolean); // Оставляем только существующие изображения

  return (
    <main className="container my-5">
      <div className="row align-items-center bg-light p-4 rounded shadow">
        <div className="col-md-6 text-center">
          {photos.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={`https://pets.сделай.site${photo}`}
                  className="img-fluid rounded m-2"
                  alt={data.mark || `Фото ${index + 1}`}
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px' }}
                />
              ))}
            </div>
          ) : (
            <img
              src="https://via.placeholder.com/300x200?text=No+Image"
              className="img-fluid rounded"
              alt="Нет изображения"
            />
          )}
        </div>
        <div className="col-md-6">
          <h2>{data.kind || 'Неизвестное животное'}</h2>
          <p>
            <strong>Описание:</strong> {data.description || 'Нет описания'}
          </p>
          <p>
            <strong>Клеймо:</strong> {data.mark || 'Нет информации'}
          </p>
          <p>
            <strong>Район:</strong> {data.district || 'Не указан'}
          </p>
          <p>
            <strong>Дата:</strong> {data.date || 'Неизвестно'}
          </p>
          <p>
            <strong>Телефон:</strong> {data.phone || 'Нет телефона'}
          </p>
          <p>
            <strong>Email:</strong> {data.email || 'Нет email'}
          </p>
          <button className="btn btn-primary btn-lg">
            Связаться
          </button>
        </div>
      </div>
    </main>
  );
}

export default PetDetail;
