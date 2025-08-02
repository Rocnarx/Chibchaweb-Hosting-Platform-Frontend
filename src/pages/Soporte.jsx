import React, { useState } from 'react';
import './Soporte.css';

function Soporte() {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('Bajo');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [asuntoInvalido, setAsuntoInvalido] = useState(false);
  const [descripcionInvalida, setDescripcionInvalida] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const asuntoValido = asunto.trim() !== '';
    const descripcionValida = descripcion.trim() !== '';

    setAsuntoInvalido(!asuntoValido);
    setDescripcionInvalida(!descripcionValida);

    if (!asuntoValido || !descripcionValida) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError('');
    setEnviando(true);

    // Simulación de envío
    setTimeout(() => {
      alert('Ticket enviado correctamente ✅');
      setAsunto('');
      setDescripcion('');
      setNivel('Bajo');
      setEnviando(false);
      setAsuntoInvalido(false);
      setDescripcionInvalida(false);
    }, 1500);
  };

  return (
    <div className="soporte-container">
      <div className="soporte-formulario">
        <h2><i className="fa-solid fa-headset"></i> Centro de Soporte Técnico</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <label htmlFor="asunto">Asunto</label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ej: Error al registrar dominio"
            className={asuntoInvalido ? 'input-error' : ''}
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe tu problema..."
            rows="4"
            className={descripcionInvalida ? 'input-error' : ''}
          />

          <label htmlFor="nivel">Nivel de servicio</label>
          <select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option>Bajo</option>
            <option>Medio</option>
            <option>Alto</option>
          </select>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Ticket'}
          </button>
        </form>
      </div>

      <div className="soporte-tickets">
        <h3>📋 Mis Tickets</h3>
        <div className="ticket">
          <span className="ticket-id">#1234</span>
          <span className="ticket-desc">Dominio no se activa</span>
          <span className="ticket-status en-proceso">En proceso</span>
        </div>
        <div className="ticket">
          <span className="ticket-id">#1229</span>
          <span className="ticket-desc">Error al pagar con tarjeta</span>
          <span className="ticket-status resuelto">Resuelto</span>
        </div>
      </div>
    </div>
  );
}

export default Soporte;
