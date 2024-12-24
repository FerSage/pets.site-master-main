import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-5">
      <div className="container p-4">
        {/* Секция "О нас" */}
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">О нас</h5>
            <p>
              Pet's Home помогает находить потерявшихся питомцев и возвращать их домой. Мы
              объединяем усилия волонтеров, владельцев и неравнодушных людей.
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text">Быстрые ссылки</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/" className="text-dark">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-dark">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-dark">
                  Помощь проекту
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Контакты</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-envelope"></i> info@petshome.ru
              </li>
              <li>
                <i className="bi bi-telephone"></i> +7 (800) 123-45-67
              </li>
              <li>
                <i className="bi bi-geo-alt"></i> Москва, Россия
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className="text-center p-3 bg-dark text-white">
        © 2024 Pet's Home. Все права защищены.{' '}
        <Link to="/terms" className="text-white">
          Условия использования
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
