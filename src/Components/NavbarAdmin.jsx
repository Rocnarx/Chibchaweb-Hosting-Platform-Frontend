import { useState, useEffect } from 'react';
import './NavbarAdmin.css';
import logo from './resources/logo.png';
import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faAngleLeft,
  faMoneyBill,
  faUsers,
  faUserCheck,
  faUserTie,
  faGlobe,
  faServer,
  faUser,
  faUserGroup,
  faMoon,
  faCircleHalfStroke
} from '@fortawesome/free-solid-svg-icons';

export default function NavbarAdmin() {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { usuario } = useUser();

  const toggleSidebar = () => {
    setSidebarAbierta(!sidebarAbierta);
  };

  // Modo oscuro
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark-mode", savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark-mode", newMode);
  };

  return (
    <>
      <aside className={`sidebar-admin ${sidebarAbierta ? '' : 'collapsed'}`}>
        <div className="sidebar-content-admin">
          {/* Encabezado */}
          <div className="sidebar-header">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo-img-admin" />
              {sidebarAbierta && (
                <div className="brand-text-admin">
                  <strong>ChibchaWeb</strong>
                  <span className="subtitle-admin">Admin</span>
                </div>
              )}
            </div>

            <div className="toggle-container">
              <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={sidebarAbierta ? faAngleLeft : faBars} />
              </button>
            </div>
          </div>

          {/* Menú */}
          <ul className="sidebar-menu-admin">
            <li>
              <NavLink to="/extensiones" className="nav-link-admin">
                <FontAwesomeIcon icon={faMoneyBill} />
                {sidebarAbierta && <span>Precios</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/ClientesAdmin" className="nav-link-admin">
                <FontAwesomeIcon icon={faUsers} />
                {sidebarAbierta && <span>Usuarios</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/PostuladosAdmin" className="nav-link-admin">
                <FontAwesomeIcon icon={faUserCheck} />
                {sidebarAbierta && <span>Postulados</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/EmpleadosAdmin" className="nav-link-admin">
                <FontAwesomeIcon icon={faUserTie} />
                {sidebarAbierta && <span>Empleados</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/CoordinadoresAdmin" className="nav-link-admin">
                <FontAwesomeIcon icon={faUserGroup} />
                {sidebarAbierta && <span>Coordinadores</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/DistribuidoresAdmin" className="nav-link-admin">
                <FontAwesomeIcon icon={faGlobe} />
                {sidebarAbierta && <span>Distribuidoressss</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/paquetes" className="nav-link-admin">
                <FontAwesomeIcon icon={faServer} />
                {sidebarAbierta && <span>Hosting</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/perfil" className="nav-link-admin">
                <FontAwesomeIcon icon={faUser} />
                {sidebarAbierta && <span>Perfil</span>}
              </NavLink>
            </li>
          </ul>

          <div className="dark-mode-toggle-admin">
            <button className="mode-toggle-button-admin" onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faCircleHalfStroke : faMoon} />
              {sidebarAbierta && <span>{darkMode ? "" : ""}</span>}
            </button>
          </div>  
        </div>
      </aside>

      {sidebarAbierta && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
