import React, { useEffect, useState } from "react";
import "./AsignarTickets.css";

export default function AsignarTickets() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [cargandoEmpleados, setCargandoEmpleados] = useState(false);

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/ver-tickets?estado_ticket=3`,
          {
            headers: {
              "Chibcha-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        if (!res.ok) throw new Error(`Error al obtener tickets: ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("La respuesta del servidor no es un arreglo.");

        setTickets(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setTickets([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerTickets();
  }, []);

  const abrirAsignacion = async (ticket) => {
    setTicketSeleccionado(ticket);
    setCargandoEmpleados(true);
    setEmpleados([]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/empleados-disponibles?nivel=${ticket.nivel}`,
        {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (!res.ok) throw new Error("Error al obtener empleados.");
      const data = await res.json();

      setEmpleados(data);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    } finally {
      setCargandoEmpleados(false);
    }
  };

  const cerrarAsignacion = () => {
    setTicketSeleccionado(null);
    setEmpleados([]);
  };

  return (
    <div className="asignar-tickets-container">
      <h1 className="titulo-asignar">Asignar Tickets</h1>

      {cargando ? (
        <p>Cargando tickets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tickets.length === 0 ? (
        <p>No hay tickets disponibles para asignar.</p>
      ) : (
        <div className="tickets-lista">
          {tickets.map((ticket, index) => (
            <div key={index} className="ticket-card">
              <h3>Asunto: {ticket.asunto}</h3>
              <p><strong>Cliente:</strong> {ticket.cliente?.nombre || "Desconocido"}</p>
              <p><strong>Correo:</strong> {ticket.cliente?.correo || "Desconocido"}</p>
              <p><strong>Descripción:</strong> {ticket.descripcion}</p>
              <button className="btn-asignar" onClick={() => abrirAsignacion(ticket)}>
                Asignar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de empleados disponibles */}
      {ticketSeleccionado && (
        <div className="modal-asignacion">
          <div className="modal-contenido">
            <h2>Asignar Ticket: {ticketSeleccionado.asunto}</h2>
            <button className="cerrar-modal" onClick={cerrarAsignacion}>✖</button>

            {cargandoEmpleados ? (
              <p>Cargando empleados disponibles...</p>
            ) : empleados.length === 0 ? (
              <p>No hay empleados disponibles para este nivel.</p>
            ) : (
              <ul className="lista-empleados">
                {empleados.map((emp) => (
                  <li key={emp.idcuenta}>
                    {emp.nombre} - {emp.correo}
                    <button className="btn-confirmar">Asignar</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
