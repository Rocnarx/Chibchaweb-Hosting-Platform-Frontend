import React from "react";
import { Link } from "react-router-dom";
import "./FooterCoordinador.css";

export default function FooterCoordinador() {
  return (
    <footer className="footer-coordinador">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} ChibchaWeb - Coordinador</p>
        <p className="footer-links">
          <Link to="/tickets">Tickets</Link> | <Link to="/asignar-tickets">Asignar</Link>
        </p>
      </div>
    </footer>
  );
}
