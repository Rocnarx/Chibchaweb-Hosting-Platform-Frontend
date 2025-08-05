import React from "react";
import "./FooterCoordinador.css";

export default function FooterCoordinador() {
  return (
    <footer className="footer-coordinador">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} ChibchaWeb - Coordinador</p>
        <p className="footer-links">
          <a href="/">Inicio</a> | <a href="/tickets">Tickets</a> | <a href="/asignar-tickets">Asignar</a>
        </p>
      </div>
    </footer>
  );
}
