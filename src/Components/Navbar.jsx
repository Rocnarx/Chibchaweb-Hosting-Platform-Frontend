import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from './resources/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef();
  const { usuario } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);

    if (savedMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = () => setMenuOpen(false);

  const irAlCarrito = () => {
    handleMenuClick();
    if (!usuario || !usuario.idcuenta) {
      alert("Debes iniciar sesión para ver tu carrito.");
    } else {
      navigate("/carrito");
    }
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-img" />
          <div className="brand-text">
            <strong>ChibchaWeb</strong>
            <span className="subtitle">Hosting Platform</span>
          </div>
        </div>
      </NavLink>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`navbar-right ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul className="navbar-menu">
          <li><NavLink to="/" className="nav-link" onClick={handleMenuClick}>Inicio</NavLink></li>
          {/* <li><NavLink to="/dominios" className="nav-link" onClick={handleMenuClick}>Dominios</NavLink></li> */}
          <li><NavLink to="/planesHosting" className="nav-link" onClick={handleMenuClick}>Hosting</NavLink></li>
          <li><NavLink to="/perfil" className="nav-link" onClick={handleMenuClick}>Mi perfil</NavLink></li>
          <li><NavLink to="/DominiosAdquiridos" className="nav-link" onClick={handleMenuClick}>Mis dominios</NavLink></li>
        </ul>

        <button className="cart-button" onClick={irAlCarrito}>
          Carrito
        </button>

        <button className="mode-toggle-button" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faCircleHalfStroke : faMoon} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
