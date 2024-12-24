import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import AuthModal from './authModal';
import logo from '../media/logo.jpg';

const Header = () => {
  const [show, setShow] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogoutModalClose = () => setShowLogoutModal(false);
  const handleLogoutModalShow = () => setShowLogoutModal(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Функция debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Функция поиска
  const searchAnimals = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`https://pets.сделай.site/api/search?query=${query}`);
        if (response.status === 200) {
          const result = await response.json();
          setSuggestions(result.data.orders || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Ошибка поиска:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  // Отслеживание изменения поискового запроса
  useEffect(() => {
    if (searchQuery) {
      searchAnimals(searchQuery);
    }
  }, [searchQuery, searchAnimals]);

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Логотип" style={{ width: '75px', height: 'auto' }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Переключатель навигации"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/') ? 'disabled' : ''}`} to="/">
                  Главная
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${!isAuthenticated ? 'disabled' : ''} ${isActive('/myaccount') ? 'disabled' : ''}`}
                  to="/myaccount"
                >
                  Личный кабинет
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/registration') ? 'disabled' : ''}`} to="/registration">
                  Регистрация
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/add-pet') ? 'disabled' : ''}`} to="/add-pet">
                  Добавить объявление
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/pet-search') ? 'disabled' : ''}`} to="/pet-search">
                  Поиск по объявлениям
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              {/* Поле ввода для поиска */}
              <div className="position-relative me-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Быстрый поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery.length >= 3 && (
                  <div
                    className="position-absolute bg-white border mt-1 p-2 w-100"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {loading ? (
                      <div>Загрузка...</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <div key={item.id} className="py-1 card border-0">
                          <Link to={`/pet/${item.id}`} className="text-decoration-none d-flex align-items-center">
                            <div>
                              <div className="fw-bold">{item.description}</div>
                              <div className="text-muted">{item.kind}</div>
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div>Нет результатов</div>
                    )}
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <Button variant="danger" onClick={handleLogoutModalShow}>
                  Выйти
                </Button>
              ) : (
                <Button variant="primary" onClick={handleShow}>
                  Авторизация
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal show={show} handleClose={handleClose} />
      <Modal show={showLogoutModal} onHide={handleLogoutModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение выхода</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите выйти из аккаунта?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutModalClose}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Выйти
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
