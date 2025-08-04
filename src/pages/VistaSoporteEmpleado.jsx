import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function VistaSoporteEmpleado() {
  const [tickets, setTickets] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [nivelFiltro, setNivelFiltro] = useState("todos");
  const [ticketActivo, setTicketActivo] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    const cargarTicketsDesdeBackend = async () => {
      try {
        const niveles = [1, 2, 3];
        const estados = estadoFiltro === "todos" ? [1, 2]
                      : estadoFiltro === "proceso" ? [1]
                      : [2];

        const nivelesFiltrados = nivelFiltro === "todos"
          ? niveles
          : [parseInt(nivelFiltro)];

        const peticiones = [];

        for (const nivel of nivelesFiltrados) {
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

        const formateados = todos.map((t) => ({
          id: String(t.id_ticket),
          cliente: t.cliente?.nombre || 'Sin nombre',
          correo: t.cliente?.correo || '',
          descripcion: t.descripcion ?? '',
          fecha_creacion: t.fecha_creacion ?? '',
          asunto: typeof t.descripcion === 'string' && t.descripcion.trim()
            ? t.descripcion.slice(0, 60) + (t.descripcion.length > 60 ? '…' : '')
            : 'Sin descripción',
          nivel: typeof t.nivel === 'number' ? `Soporte ${t.nivel}` : 'Sin nivel',
          estado: t.estado === 2 ? 'Resuelto' : 'En proceso',
        }));

        setTickets(formateados);
      } catch (err) {
        console.error('❌ Error al cargar tickets:', err);
      }
    };

    cargarTicketsDesdeBackend();
  }, [estadoFiltro, nivelFiltro]);

  const subirNivel = async (id, nivelActual) => {
    const nuevoNivel = nivelActual + 1;
    if (nuevoNivel > 3 || !id) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/CambiarNivelTicket/${id}`, {
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
          ticket.id === id
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
    if (!respuestaTexto.trim() || !ticketActivo?.id) return;

    try {
      setEnviandoRespuesta(true);

      const resRespuesta = await fetch(`${import.meta.env.VITE_API_URL}/ticket/${ticketActivo.id}/respuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ mensaje: respuestaTexto.trim() })
      });

      if (!resRespuesta.ok) throw new Error('Error al enviar respuesta');

      const resEstado = await fetch(`${import.meta.env.VITE_API_URL}/CambiarEstadoTicket/${ticketActivo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ estado: 2 })
      });

      if (!resEstado.ok) throw new Error('Error al cambiar estado');

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketActivo.id
            ? { ...ticket, estado: 'Resuelto' }
            : ticket
        )
      );

      alert("✅ Respuesta enviada con éxito");
      setTicketActivo(null);
      setRespuestaTexto('');
    } catch (err) {
      alert("❌ No se pudo enviar la respuesta o actualizar el estado.");
      console.error("Error:", err);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const abrirTicket = async (ticket) => {
    setTicketActivo(ticket);
    setRespuestaTexto('');
    setRespuestas([]);

    if (ticket.estado === 'Resuelto') {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ticket/${ticket.id}`, {
          headers: {
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          }
        });
        const data = await res.json();
        setRespuestas(data.respuestas || []);
      } catch (err) {
        console.error('❌ Error al obtener detalle del ticket:', err);
      }
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

      <div className="filtro-niveles">
        <button className={nivelFiltro === "todos" ? "activo" : ""} onClick={() => setNivelFiltro("todos")}>Cualquier nivel</button>
        <button className={nivelFiltro === "1" ? "activo" : ""} onClick={() => setNivelFiltro("1")}>Soporte 1</button>
        <button className={nivelFiltro === "2" ? "activo" : ""} onClick={() => setNivelFiltro("2")}>Soporte 2</button>
        <button className={nivelFiltro === "3" ? "activo" : ""} onClick={() => setNivelFiltro("3")}>Soporte 3</button>
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
            <tr key={ticket.id} onClick={() => abrirTicket(ticket)}>
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
                          subirNivel(ticket.id, nivelActual);
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

      {ticketActivo && (
        <div className="modal-overlay" onClick={() => setTicketActivo(null)}>
          <div className="modal-ticket" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setTicketActivo(null)}>✖</button>
            <h2>🎫 Detalles del Ticket</h2>
            <p><strong>ID:</strong> {ticketActivo.id}</p>
            <p><strong>Cliente:</strong> {ticketActivo.cliente}</p>
            <p><strong>Correo:</strong> {ticketActivo.correo}</p>
            <p><strong>Nivel:</strong> {ticketActivo.nivel}</p>
            <p><strong>Estado:</strong> {ticketActivo.estado}</p>
            <p><strong>Fecha de creación:</strong> {ticketActivo.fecha_creacion}</p>
            <p><strong>Descripción completa:</strong></p>
            <div className="descripcion-completa">{ticketActivo.descripcion}</div>

            {ticketActivo.estado === 'Resuelto' ? (
              <div className="respuesta-mostrada">
                <p><strong>✉ Respuestas del empleado:</strong></p>
                {respuestas.length > 0 ? (
                  respuestas.map((r) => (
                    <div className="respuesta-box" key={r.id_respuesta}>
                      <p>{r.contenido}</p>
                      <small><em>📅 {r.fecha}</em></small>
                    </div>
                  ))
                ) : (
                  <p><em>No hay respuestas registradas.</em></p>
                )}
              </div>
            ) : (
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VistaSoporteEmpleado;
