import React from 'react';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="contacto-container">
      <h2>¿Necesitas ayuda?</h2>
      <p className="subtexto">
        Estamos aquí para ayudarte. Puedes contactarnos a través de los siguientes canales:
      </p>

      <div className="info-grid">
        <div className="info-card">
          <div className="icono">📧</div>
          <h3>Correo electrónico</h3>
          <p>soporte@midominio.com</p>
        </div>

        <div className="info-card">
          <div className="icono">📍</div>
          <h3>Dirección</h3>
          <p>Calle 13 # 31 -75<br />Bogotá, Colombia</p>
        </div>

        <div className="info-card">
          <div className="icono">⏰</div>
          <h3>Horario de atención</h3>
          <p>Lunes a Viernes<br />8:00 a.m. - 6:00 p.m.</p>
        </div>
      </div>
    </div>
  );
}
