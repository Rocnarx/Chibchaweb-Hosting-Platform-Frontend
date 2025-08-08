import React from "react";
import { Link } from "react-router-dom";
import "./FooterCoordinador.css";

export default function FooterCoordinador() {
  return (
    <footer className="footer-coordinador">
      <div className="footer-content">
        <p className="footer-copy">
          © {new Date().getFullYear()} ChibchaWeb - Coordinador
        </p>
        <div className="footer-links">
          <Link to="/tickets">Tickets</Link>
          <span className="divider">|</span>
          <Link to="/asignar-tickets">Asignar</Link>
        </div>
      </div>
    </footer>
  );
}
