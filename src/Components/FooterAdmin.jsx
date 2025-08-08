import './FooterAdmin.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBill,
  faUsers,
  faUserCheck,
  faUserTie,
  faGlobe,
  faServer,
  faUser,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons';

function FooterAdmin() {
  return (
    <footer className="footer admin-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Panel Administrativo</h3>
          <p>Gestión interna del sistema ChibchaWeb</p>
        </div>

        <ul className="footer-links">
          <li>
            <NavLink to="/extensiones" className="nav-link-admin">
              <FontAwesomeIcon icon={faMoneyBill} /> Precios
            </NavLink>
          </li>
          <li>
            <NavLink to="/ClientesAdmin" className="nav-link-admin">
              <FontAwesomeIcon icon={faUsers} /> Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/PostuladosAdmin" className="nav-link-admin">
              <FontAwesomeIcon icon={faUserCheck} /> Postulados
            </NavLink>
          </li>
          <li>
            <NavLink to="/EmpleadosAdmin" className="nav-link-admin">
              <FontAwesomeIcon icon={faUserTie} /> Empleados
            </NavLink>
          </li>
          <li>
            <NavLink to="/CoordinadoresAdmin" className="nav-link-admin">
              <FontAwesomeIcon icon={faUserGroup} /> Coordinadores
            </NavLink>
          </li>
          <li>
            <NavLink to="/DistribuidoresAdmin" className="nav-link-admin">
              <FontAwesomeIcon icon={faGlobe} /> Distribuidores
            </NavLink>
          </li>
          <li>
            <NavLink to="/paquetes" className="nav-link-admin">
              <FontAwesomeIcon icon={faServer} /> Hosting
            </NavLink>
          </li>
          <li>
            <NavLink to="/perfil" className="nav-link-admin">
              <FontAwesomeIcon icon={faUser} /> Perfil
            </NavLink>
          </li>
        </ul>
      </div>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} ChibchaWeb - Administrador
      </p>
    </footer>
  );
}

export default FooterAdmin;
