import React, { useEffect, useState } from "react";
import "./AsignarTickets.css";
import { useUser } from "../Context/UserContext";

export default function AsignarTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [cargandoEmpleados, setCargandoEmpleados] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState("");
  const [empleadoIDCuenta, setEmpleadoIDCuenta] = useState(null);
  const [asignando, setAsignando] = useState(false);

  const { usuario } = useUser();

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
        const data = await res.json();

        let nivelPermitido;
        if (usuario?.tipocuenta === "COORDINADOR NIVEL 1") nivelPermitido = 1;
        else if (usuario?.tipocuenta === "COORDINADOR NIVEL 2") nivelPermitido = 2;
        else if (usuario?.tipocuenta === "COORDINADOR NIVEL 3") nivelPermitido = 3;

        console.log("Tipo de cuenta:", usuario?.tipocuenta);
        console.log("Nivel permitido:", nivelPermitido);

        const filtrados = nivelPermitido
          ? data.filter(ticket => ticket.nivel === nivelPermitido)
          : [];

        setTickets(filtrados);
      } catch (err) {
        console.error("Error al obtener tickets:", err);
        setError("No se pudieron cargar los tickets.");
      }
    };

    if (usuario?.tipocuenta) {
      obtenerTickets();
    }
  }, [usuario]);

  const abrirAsignacion = async (ticket) => {
    setTicketSeleccionado(ticket);
    setEmpleados([]);
    setCorreoSeleccionado("");
    setEmpleadoIDCuenta(null);
    setCargandoEmpleados(true);

    let idtipo;
    if (ticket.nivel === 1) idtipo = 11;
    else if (ticket.nivel === 2) idtipo = 12;
    else if (ticket.nivel === 3) idtipo = 13;
    else return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=${idtipo}`,
        {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      const data = await res.json();
      setEmpleados(data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
    } finally {
      setCargandoEmpleados(false);
    }
  };

  const cerrarModal = () => {
    setTicketSeleccionado(null);
    setEmpleados([]);
    setCorreoSeleccionado("");
    setEmpleadoIDCuenta(null);
  };

  const manejarSeleccionEmpleado = async (correo) => {
    setCorreoSeleccionado(correo);
    setEmpleadoIDCuenta(null);

    if (!correo) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cuenta_por_correo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();
      setEmpleadoIDCuenta(data.IDCUENTA);
    } catch (error) {
      console.error("Error al obtener cuenta del empleado:", error);
    }
  };

  const asignarTicket = async () => {
    if (!ticketSeleccionado?.id_ticket || !empleadoIDCuenta) {
      alert("Faltan datos para asignar el ticket.");
      return;
    }

    setAsignando(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/asignarTicket/${ticketSeleccionado.id_ticket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ IDEMPLEADO: empleadoIDCuenta }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.detail || "Error al asignar el ticket.");
      }

      const cambioEstado = await fetch(
        `${import.meta.env.VITE_API_URL}/CambiarEstadoTicket/${ticketSeleccionado.id_ticket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ estado: 1 }),
        }
      );

      if (!cambioEstado.ok) {
        const errorData = await cambioEstado.json();
        throw new Error(errorData?.detail || "Error al cambiar el estado del ticket.");
      }

      setTickets(tickets.filter(t => t.id_ticket !== ticketSeleccionado.id_ticket));
      cerrarModal();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al asignar el ticket: " + err.message);
    } finally {
      setAsignando(false);
    }
  };

  const escalarTicket = async (idTicket, nivelActual) => {
    const nuevoNivel = nivelActual + 1;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/CambiarNivelTicket/${idTicket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ nivel: nuevoNivel }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.detail || "Error al escalar el ticket.");
      }

      setTickets((prev) => prev.filter((t) => t.id_ticket !== idTicket));
      alert("Ticket escalado al siguiente nivel.");
    } catch (error) {
      console.error("Error al escalar ticket:", error);
      alert("Error al escalar el ticket.");
    }
  };

  return (
    <div className="asignar-tickets-container">
      <h2>Asignar Tickets</h2>
      {error && <p className="error">{error}</p>}
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <div key={ticket.id_ticket} className="ticket-card">
            <h3>{ticket.asunto || "Sin asunto"}</h3>
            <p><strong>Descripción:</strong> {ticket.descripcion}</p>
            <p><strong>Nivel:</strong> {ticket.nivel}</p>
            <p><strong>Cliente:</strong> {ticket.cliente?.nombre}</p>
            <button onClick={() => abrirAsignacion(ticket)}>Asignar</button>
            {(ticket.nivel === 1 || ticket.nivel === 2) && (
              <button
                className="escalar-btn"
                onClick={() => escalarTicket(ticket.id_ticket, ticket.nivel)}
              >
                Escalar
              </button>
            )}
          </div>
        ))}
      </div>

      {ticketSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <span className="cerrar" onClick={cerrarModal}>&times;</span>
            <h3>Asignar Ticket:</h3>
            <p><strong>Descripción:</strong> {ticketSeleccionado.descripcion}</p>
            <p><strong>Nivel:</strong> {ticketSeleccionado.nivel}</p>

            {cargandoEmpleados ? (
              <p>Cargando empleados disponibles...</p>
            ) : empleados.length === 0 ? (
              <p>No hay empleados disponibles para este nivel.</p>
            ) : (
              <>
                <label htmlFor="empleado-select">Selecciona un empleado:</label>
                <select
                  id="empleado-select"
                  value={correoSeleccionado}
                  onChange={(e) => manejarSeleccionEmpleado(e.target.value)}
                >
                  <option value="">-- Selecciona --</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idcuenta} value={empleado.correo}>
                      {empleado.nombrecuenta} - {empleado.correo}
                    </option>
                  ))}
                </select>

                <button
                  disabled={!empleadoIDCuenta || asignando}
                  onClick={asignarTicket}
                >
                  {asignando ? "Asignando..." : "Confirmar asignación"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
