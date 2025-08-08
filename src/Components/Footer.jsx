import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importar Font Awesome completo
import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

function Footer() {
  const { usuario } = useUser();

  return (
    <footer className="footer">
      <div
        className="footer-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Marca y redes */}
        <div className="footer-brand">
          <h3>ChibchaWeb</h3>
          <p>Tu puerta al mundo digital</p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61579028858597"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/chibchaweb/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://x.com/ChibchaWeb"
              target="_blank"
              rel="noopener noreferrer"
              title="X (Twitter)"
            >
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Navegación */}
        <ul className="footer-links">
          <li>
            <NavLink to="/" className="nav-link">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/planesHosting" className="nav-link">Hosting</NavLink>
          </li>
          {usuario ? (
            <li>
              <NavLink to="/soporte" className="nav-link">Soporte</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/login" className="nav-link">Iniciar sesión</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/contacto" className="nav-link">Contacto</NavLink>
          </li>
        </ul>
      </div>

      {/* Copyright */}
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} ChibchaWeb. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
