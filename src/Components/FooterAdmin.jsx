import './FooterAdmin.css';

function FooterAdmin() {
  return (
    <footer className="footer admin-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Panel Administrativo</h3>
          <p>Gestión interna del sistema ChibchaWeb</p>
        </div>
        <ul className="footer-links">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Usuarios</a></li>
          <li><a href="#">Precios</a></li>
          <li><a href="#">Reportes</a></li>
          <li><a href="#">Soporte Técnico</a></li>
        </ul>
      </div>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} ChibchaWeb - Administrador
      </p>
    </footer>
  );
}

export default FooterAdmin;
