import { useState, useEffect, useRef } from 'react';
import './NavbarAdmin.css';
import logo from './resources/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

function NavbarAdmin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const { usuario } = useUser();
  const navigate = useNavigate();

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

  return (
    <nav className="navbar-admin">
      <NavLink to="/" className="navbar-logo-admin">
        <div className="navbar-left-admin">
          <img src={logo} alt="Logo" className="logo-img-admin" />
          <div className="brand-text-admin">
            <strong>ChibchaWeb</strong>
            <span className="subtitle-admin">Panel Administrador</span>
          </div>
        </div>
      </NavLink>

      <div className="hamburger-admin" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`navbar-right-admin ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul className="navbar-menu-admin">
          <li><NavLink to="/extensiones" className="nav-link-admin" onClick={handleMenuClick}>Precios</NavLink></li>
          <li><NavLink to="/ClientesAdmin" className="nav-link-admin" onClick={handleMenuClick}>Usuarios</NavLink></li>
          <li><NavLink to="/estadisticas" className="nav-link-admin" onClick={handleMenuClick}>Estadísticas</NavLink></li>
          <li><NavLink to="/perfil" className="nav-link-admin" onClick={handleMenuClick}>Perfil</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
