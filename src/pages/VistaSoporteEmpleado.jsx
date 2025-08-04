import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function VistaSoporteEmpleado() {
  const [tickets, setTickets] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [ticketActivo, setTicketActivo] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false);

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

        const formateados = todos.map((t, i) => ({
          id: t.idticket ? String(t.idticket) : `tmp-${i}`,
          codigo: t.codigo ?? `TK-TMP-${i}`,
          cliente: t.cliente?.nombre || 'Sin nombre',
          correo: t.cliente?.correo || '',
          descripcion: t.descripcion ?? '',
          fecha_creacion: t.fecha_creacion ?? '',
          asunto: typeof t.descripcion === 'string' && t.descripcion.trim()
            ? t.descripcion.slice(0, 60) + (t.descripcion.length > 60 ? '…' : '')
            : 'Sin descripción',
          nivel: typeof t.nivel === 'number' ? `Soporte ${t.nivel}` : 'Sin nivel',
          estado: t.estado_ticket === 2 ? 'Resuelto' : 'En proceso',
        }));

        setTickets(formateados);
      } catch (err) {
        console.error('❌ Error al cargar tickets:', err);
      }
    };

    cargarTicketsDesdeBackend();
  }, [estadoFiltro]);

  const subirNivel = async (codigo, nivelActual) => {
    const nuevoNivel = nivelActual + 1;
    if (nuevoNivel > 3 || !codigo || !codigo.startsWith("TK")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/CambiarNivelTicket/${codigo}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ nivel: nuevoNivel })
      });

      if (!res.ok) throw new Error("No se pudo escalar el ticket");

      setTickets(prev =>
        prev.map(ticket =>
          ticket.codigo === codigo
            ? { ...ticket, nivel: `Soporte ${nuevoNivel}` }
            : ticket
        )
      );
    } catch (err) {
      console.error("❌ Error al escalar ticket:", err);
      alert("No se pudo escalar el ticket.");
    }
  };

  const enviarRespuestaTicket = async () => {
    if (!respuestaTexto.trim() || !ticketActivo?.codigo) return;

    try {
      setEnviandoRespuesta(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ticket/${ticketActivo.codigo}/respuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          mensaje: respuestaTexto.trim(),
          autor: 'empleado'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Error al enviar respuesta');

      setRespuestaEnviada(true);
      setRespuestaTexto('');
    } catch (err) {
      alert("❌ No se pudo enviar la respuesta.");
      console.error("Error:", err);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  return (
    <div className="panel-soporte">
      <h2>📋 Panel de Soporte Técnico</h2>

      <div className="filtro-estados">
        <button className={estadoFiltro === "todos" ? "activo" : ""} onClick={() => setEstadoFiltro("todos")}>Todos</button>
        <button className={estadoFiltro === "proceso" ? "activo" : ""} onClick={() => setEstadoFiltro("proceso")}>En proceso</button>
        <button className={estadoFiltro === "resuelto" ? "activo" : ""} onClick={() => setEstadoFiltro("resuelto")}>Resueltos</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Asunto</th>
            <th>Nivel</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} onClick={() => setTicketActivo(ticket)}>
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
                        e.stopPropagation();
                        const confirmar = window.confirm('¿Deseas escalar este ticket al siguiente nivel?');
                        if (confirmar) {
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal detallado del ticket */}
      {ticketActivo && (
        <div className="modal-overlay" onClick={() => setTicketActivo(null)}>
          <div className="modal-ticket" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setTicketActivo(null)}>✖</button>
            <h2>🎫 Detalles del Ticket</h2>
            <p><strong>Código:</strong> {ticketActivo.codigo}</p>
            <p><strong>Cliente:</strong> {ticketActivo.cliente}</p>
            <p><strong>Correo:</strong> {ticketActivo.correo}</p>
            <p><strong>Nivel:</strong> {ticketActivo.nivel}</p>
            <p><strong>Estado:</strong> {ticketActivo.estado}</p>
            <p><strong>Fecha de creación:</strong> {ticketActivo.fecha_creacion}</p>
            <p><strong>Descripción completa:</strong></p>
            <div className="descripcion-completa">{ticketActivo.descripcion}</div>

            <div className="area-respuesta">
              <label htmlFor="respuesta">✉ Escribir respuesta:</label>
              <textarea
                id="respuesta"
                value={respuestaTexto}
                onChange={(e) => setRespuestaTexto(e.target.value)}
                placeholder="Escribe aquí tu respuesta al cliente..."
                rows="4"
              />
              <button
                className="btn-responder"
                onClick={enviarRespuestaTicket}
                disabled={enviandoRespuesta}
              >
                {enviandoRespuesta ? "Enviando..." : "Enviar respuesta"}
              </button>

              {respuestaEnviada && (
                <p className="mensaje-exito">✅ Respuesta enviada con éxito</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VistaSoporteEmpleado;
