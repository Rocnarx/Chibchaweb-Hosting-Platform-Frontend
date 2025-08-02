import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';

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
                <td>{ticket.nivel}</td>
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

              {/* Si se está resolviendo este ticket, mostrar textarea */}
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

              {/* Mostrar feedback si ya fue resuelto */}
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
