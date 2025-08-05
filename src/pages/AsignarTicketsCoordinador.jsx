import React, { useEffect, useState } from "react";
import "./Coordinador.css";

export default function AsignarTicketsCoordinador() {
  const [tickets, setTickets] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const tRes = await fetch(`${import.meta.env.VITE_API_URL}/coordinador/tickets_pendientes`, {
        headers: { "Chibcha-api-key": import.meta.env.VITE_API_KEY },
      });
      const eRes = await fetch(`${import.meta.env.VITE_API_URL}/empleados`, {
        headers: { "Chibcha-api-key": import.meta.env.VITE_API_KEY },
      });

      const tData = await tRes.json();
      const eData = await eRes.json();

      setTickets(tData);
      setEmpleados(eData);
    };

    fetchData();
  }, []);

  const asignarTicket = async (idticket) => {
    const idempleado = asignaciones[idticket];
    if (!idempleado) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coordinador/asignar_ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ idticket, idempleado }),
      });

      if (!res.ok) throw new Error();

      setMensaje("Ticket asignado exitosamente.");
    } catch {
      setMensaje("Error al asignar el ticket.");
    }
  };

  return (
    <div className="coordinador-container">
      <h2>Asignar Tickets</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <table className="tabla-tickets">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asunto</th>
            <th>Asignar a</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.idticket}>
              <td>{t.idticket}</td>
              <td>{t.asunto}</td>
              <td>
                <select onChange={(e) => setAsignaciones(prev => ({ ...prev, [t.idticket]: e.target.value }))}>
                  <option value="">Selecciona empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.idcuenta} value={emp.idcuenta}>
                      {emp.nombrecuenta}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => asignarTicket(t.idticket)}>Asignar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
