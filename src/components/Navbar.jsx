import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from './resources/logo.png';
import { NavLink } from 'react-router-dom'


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cierra menú al hacer clic en un link
  const handleMenuClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo + marca */}
      <NavLink to="/" className="navbar-logo">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-img" />
          <div className="brand-text">
            <strong>ChibchaWeb</strong>
            <span className="subtitle">Hosting Platform</span>
          </div>
        </div>
      </NavLink>

      {/* Icono hamburguesa */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Menú y carrito */}
      <div className={`navbar-right ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul className="navbar-menu">
          <li><NavLink to="/" className="nav-link" onClick={handleMenuClick}>Inicio</NavLink></li>
          <li><NavLink to="/dominios" className="nav-link" onClick={handleMenuClick}>Dominios</NavLink></li>
          <li><NavLink to="/planes" className="nav-link" onClick={handleMenuClick}>Planes</NavLink></li>
          <li><NavLink to="/hosting" className="nav-link" onClick={handleMenuClick}>Hosting</NavLink></li>
          <li><NavLink to="/perfil" className="nav-link" onClick={handleMenuClick}>Mi perfil</NavLink></li>
        </ul>
        <button className="cart-button" onClick={handleMenuClick}>Carrito</button>
      </div>
    </nav>
  );
}

export default Navbar;
