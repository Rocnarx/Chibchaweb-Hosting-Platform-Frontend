import React, { useEffect, useState } from "react";
import "./TicketsCoordinador.css";
import { useUser } from "../Context/UserContext";

export default function TicketsCoordinador() {
  const [ticketsPorEstado, setTicketsPorEstado] = useState({
    sinAsignar: [],
    enProceso: [],
    terminados: [],
  });
  const [error, setError] = useState("");
  const { usuario } = useUser();

  useEffect(() => {
    const obtenerTicketsPorEstado = async (estado, key) => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/ver-tickets?estado_ticket=${estado}`;
        const res = await fetch(url, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error(`Error al cargar tickets estado ${estado}`);
        const data = await res.json();

        setTicketsPorEstado((prev) => ({
          ...prev,
          [key]: data,
        }));
      } catch (err) {
        console.error(err);
        setError("Error al cargar los tickets.");
      }
    };

    obtenerTicketsPorEstado(3, "sinAsignar"); // Sin asignar
    obtenerTicketsPorEstado(1, "enProceso");  // En proceso
    obtenerTicketsPorEstado(2, "terminados"); // Terminados
  }, []);

  const filtrarPorNivel = (tickets) => {
    if (!usuario) return [];

    const tipo = usuario.tipocuenta;
    if (tipo === "COORDINADOR NIVEL 1") return tickets.filter(t => t.nivel === 1);
    if (tipo === "COORDINADOR NIVEL 2") return tickets.filter(t => t.nivel === 2);
    if (tipo === "COORDINADOR NIVEL 3") return tickets.filter(t => t.nivel === 3);

    return tickets; // Si no es coordinador, ve todos los tickets
  };

  const renderTabla = (titulo, tickets, color) => {
    const ticketsFiltrados = filtrarPorNivel(tickets);
    if (ticketsFiltrados.length === 0) return null;

    return (
      <div className="bloque-tabla">
        <h3 className={`titulo-${color}`}>{titulo}</h3>
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
            {ticketsFiltrados.map((ticket) => (
              <tr key={ticket.id_ticket}>
                <td>{ticket.id_ticket}</td>
                <td>{ticket.descripcion}</td>
                <td>{ticket.nivel}</td>
                <td>{ticket.cliente?.nombre}</td>
                <td>{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                <td>{ticket.empleado_asignado ? ticket.empleado_asignado.nombre : "Sin asignar"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="tickets-coordinador-container">
      <h2>Gestión de Tickets</h2>
      {error && <p className="error">{error}</p>}

      {renderTabla("🟡 Tickets sin asignar", ticketsPorEstado.sinAsignar, "amarillo")}
      {renderTabla("🔵 Tickets en proceso", ticketsPorEstado.enProceso, "azul")}
      {renderTabla("✅ Tickets terminados", ticketsPorEstado.terminados, "verde")}
    </div>
  );
}
