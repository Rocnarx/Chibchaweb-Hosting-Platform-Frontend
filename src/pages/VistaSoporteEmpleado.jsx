import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function VistaSoporteEmpleado() {
  const [tickets, setTickets] = useState([]);
  const [resolviendo, setResolviendo] = useState(null);
  const [feedbackTexto, setFeedbackTexto] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  useEffect(() => {
    const cargarTicketsDesdeBackend = async () => {
      try {
        const niveles = [1, 2, 3];
        const estados = estadoFiltro === "todos" ? [1, 2]
                      : estadoFiltro === "proceso" ? [1]
                      : [2];

        const peticiones = [];

        for (const nivel of niveles) {
          for (const estado of estados) {
            peticiones.push(
              fetch(`${import.meta.env.VITE_API_URL}/ver-tickets-niveles?estado_ticket=${estado}&nivel_ticket=${nivel}`, {
                headers: {
                  'Chibcha-api-key': import.meta.env.VITE_API_KEY
                }
              })
              .then(async res => {
                if (res.status === 404) return [];
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return await res.json();
              })
            );
          }
        }

        const respuestas = await Promise.allSettled(peticiones);

        const todos = respuestas
          .filter(r => r.status === "fulfilled")
          .flatMap(r => r.value);

        const formateados = todos.map((t, i) => {
          console.log("✔ Ticket recibido:", t);
          return {
            id: t.idticket ? String(t.idticket) : `tmp-${i}`,
            codigo: t.codigo ?? `TK-TMP-${i}`,
            cliente: t.cliente?.nombre || 'Sin nombre',
            asunto: typeof t.descripcion === 'string' && t.descripcion.trim()
              ? t.descripcion.slice(0, 60) + (t.descripcion.length > 60 ? '…' : '')
              : 'Sin descripción',
            nivel: typeof t.nivel === 'number' ? `Soporte ${t.nivel}` : 'Sin nivel',
            estado: t.estado_ticket === 2 ? 'Resuelto' : 'En proceso',
            feedback: '',
          };
        });

        console.log("📥 Tickets cargados:", formateados);
        setTickets(formateados);
      } catch (err) {
        console.error('❌ Error inesperado al cargar tickets:', err);
      }
    };

    cargarTicketsDesdeBackend();
  }, [estadoFiltro]);

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

  const subirNivel = async (codigo, nivelActual) => {
    const nuevoNivel = nivelActual + 1;
    if (nuevoNivel > 3 || !codigo || !codigo.startsWith("TK")) {
      console.warn("⛔ Código inválido o sin escalar:", codigo);
      return;
    }

    console.log(`⬆ Escalando ticket ${codigo} de nivel ${nivelActual} → ${nuevoNivel}`);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/CambiarNivelTicket/${codigo}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ nivel: nuevoNivel })
      });

      const respuestaTexto = await res.text();
      console.log(`🛰 PATCH response (${res.status}):`, respuestaTexto);

      if (!res.ok) throw new Error(`No se pudo escalar el ticket (${res.status}): ${respuestaTexto}`);

      setTickets(prev =>
        prev.map(ticket =>
          ticket.codigo === codigo
            ? { ...ticket, nivel: `Soporte ${nuevoNivel}` }
            : ticket
        )
      );
    } catch (err) {
      console.error("❌ Error al escalar ticket:", err);
      alert("No se pudo escalar el ticket. Inténtalo más tarde.");
    }
  };

  return (
    <div className="panel-soporte">
      <h2>📋 Panel de Soporte Técnico</h2>

      <div className="filtro-estados">
        <button
          className={estadoFiltro === "todos" ? "activo" : ""}
          onClick={() => setEstadoFiltro("todos")}
        >
          Todos
        </button>
        <button
          className={estadoFiltro === "proceso" ? "activo" : ""}
          onClick={() => setEstadoFiltro("proceso")}
        >
          En proceso
        </button>
        <button
          className={estadoFiltro === "resuelto" ? "activo" : ""}
          onClick={() => setEstadoFiltro("resuelto")}
        >
          Resueltos
        </button>
      </div>

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
                    {ticket.estado !== 'Resuelto' && ticket.nivel !== 'Soporte 3' && (
                      <span
                        className="icono-escalar"
                        title="Escalar ticket"
                        onClick={(e) => {
                          const confirmar = window.confirm('¿Deseas escalar este ticket al siguiente nivel?');
                          if (confirmar) {
                            const target = e.currentTarget;
                            target.classList.add('animado');
                            setTimeout(() => {
                              if (target) target.classList.remove('animado');
                            }, 500);
                            const nivelActual = Number(ticket.nivel?.match(/\d+/)?.[0] || 1);
                            subirNivel(ticket.codigo, nivelActual);
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
