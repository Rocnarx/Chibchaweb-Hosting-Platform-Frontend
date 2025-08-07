import { useState } from 'react';
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
  faHeadset  // 👈 Nuevo ícono para soporte
} from '@fortawesome/free-solid-svg-icons';

export default function NavbarAdmin() {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const { usuario } = useUser();

  const toggleSidebar = () => {
    setSidebarAbierta(!sidebarAbierta);
  };

  return (
    <>
      <aside className={`sidebar-admin ${sidebarAbierta ? '' : 'collapsed'}`}>
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
              {sidebarAbierta && <span>Distribuidores</span>}
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
          <li>
            <NavLink to="/vista-soporte-admin" className="nav-link-admin">
              <FontAwesomeIcon icon={faHeadset} />
              {sidebarAbierta && <span>Soporte</span>}
            </NavLink>
          </li>
        </ul>
      </aside>

      {sidebarAbierta && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
