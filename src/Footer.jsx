import './Footer.css';

function Footer() {
return (
    <footer className="footer">
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="footer-brand">
                <h3>ChibchaWeb</h3>
                <p>Tu puerta al mundo digital</p>
            </div>
            <ul className="footer-links">
                <li><a href="#">Planes</a></li>
                <li><a href="#">Hosting</a></li>
                <li><a href="#">Dominios</a></li>
                <li><a href="#">Contacto</a></li>
            </ul>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} ChibchaWeb. Todos los derechos reservados.</p>
    </footer>
);
}

export default Footer;
