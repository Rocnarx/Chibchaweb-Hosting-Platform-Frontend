import React, { useEffect, useState } from "react";
import "./TicketsCoordinador.css";

export default function TicketsCoordinador() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/ver-tickets?estado_ticket=1`;

        const res = await fetch(url, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error("No se pudo cargar los tickets");

        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los tickets.");
      }
    };

    obtenerTickets();
  }, []);

  return (
    <div className="tickets-coordinador-container">
      <h2>Tickets activos</h2>

      {error && <p className="error">{error}</p>}

      {tickets.length === 0 ? (
        <p>No hay tickets activos.</p>
      ) : (
        <table className="tabla-tickets">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Nivel</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Empleado asignado</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id_ticket}>
                <td>{ticket.id_ticket}</td>
                <td>{ticket.descripcion}</td>
                <td>{ticket.nivel}</td>
                <td>{ticket.cliente?.correo}</td>
                <td>{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                <td>{ticket.empleado_asignado ? ticket.empleado_asignado.correo : "Sin asignar"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
