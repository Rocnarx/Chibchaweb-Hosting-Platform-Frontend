import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from './resources/logo.png';

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
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo-img" />
        <div className="brand-text">
          <strong>ChibchaWeb</strong>
          <span className="subtitle">Hosting Platform</span>
        </div>
      </div>

      {/* Icono hamburguesa */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Menú y carrito */}
      <div className={`navbar-right ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul className="navbar-menu">
          <li onClick={handleMenuClick}>Planes</li>
          <li onClick={handleMenuClick}>Hosting</li>
          <li onClick={handleMenuClick}>Dominios</li>
          <li onClick={handleMenuClick}>Mi perfil</li>
        </ul>
        <button className="cart-button" onClick={handleMenuClick}>Carrito</button>
      </div>
    </nav>
  );
}

export default Navbar;
