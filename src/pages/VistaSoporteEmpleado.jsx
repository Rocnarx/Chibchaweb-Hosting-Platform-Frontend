import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { mockTickets } from '../data/mockTickets';

function VistaSoporteEmpleado() {
  const [tickets, setTickets] = useState([]);
  const [resolviendo, setResolviendo] = useState(null);
  const [feedbackTexto, setFeedbackTexto] = useState('');

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const enviarFeedback = (id) => {
    if (!feedbackTexto.trim()) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              estado: 'Resuelto',
              feedback: feedbackTexto.trim(),
            }
          : ticket
      )
    );
    setResolviendo(null);
    setFeedbackTexto('');
  };

  const subirNivel = (id) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;

        const niveles = ['Soporte 1', 'Soporte 2', 'Soporte 3'];
        const actualIndex = niveles.indexOf(ticket.nivel);
        if (actualIndex < 2) {
          return {
            ...ticket,
            nivel: niveles[actualIndex + 1],
          };
        }
        return ticket;
      })
    );
  };

  return (
    <div className="panel-soporte">
      <h2>📋 Panel de Soporte Técnico</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Asunto</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <React.Fragment key={ticket.id}>
              <tr>
                <td>#{ticket.id}</td>
                <td>{ticket.cliente}</td>
                <td>{ticket.asunto}</td>
                <td>
                  <span className="nivel-wrapper">
                    {ticket.nivel}
                    {ticket.nivel !== 'Soporte 3' && (
                      <span
                        className="icono-escalar"
                        title="Escalar ticket"
                        onClick={(e) => {
                        const confirmar = window.confirm('¿Deseas escalar este ticket al siguiente nivel?');
                        if (confirmar) {
                          e.currentTarget.classList.add('animado');
                          setTimeout(() => e.currentTarget.classList.remove('animado'), 500);
                          subirNivel(ticket.id);
                        }
                      }}

                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </span>
                    )}
                  </span>
                </td>

                <td>
                  <span className={`estado-tag ${ticket.estado.toLowerCase().replace(" ", "-")}`}>
                    {ticket.estado}
                  </span>
                </td>
                <td>
                  {ticket.estado !== 'Resuelto' ? (
                    <button onClick={() => setResolviendo(ticket.id)}>
                      ✔ Resolver
                    </button>
                  ) : (
                    '✔'
                  )}
                </td>
              </tr>

              {resolviendo === ticket.id && (
                <tr className="feedback-row">
                  <td colSpan="6">
                    <textarea
                      placeholder="Escribe el feedback para este ticket..."
                      value={feedbackTexto}
                      onChange={(e) => setFeedbackTexto(e.target.value)}
                    />
                    <button onClick={() => enviarFeedback(ticket.id)}>
                      Enviar feedback y marcar como resuelto
                    </button>
                  </td>
                </tr>
              )}

              {ticket.feedback && (
                <tr className="feedback-row">
                  <td colSpan="6">
                    <strong>📝 Feedback enviado:</strong> {ticket.feedback}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VistaSoporteEmpleado;
