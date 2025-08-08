import React, { useEffect, useState } from "react";
import { FaSyncAlt, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./EmpleadosAdmin.css";

export default function EmpleadosAdmin() {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [nuevoNivel, setNuevoNivel] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ para redirigir

  const niveles = {
    11: "Técnico Nivel 1",
    12: "Técnico Nivel 2",
    13: "Técnico Nivel 3",
  };

  const obtenerTodosLosEmpleados = async () => {
    const tipos = [11, 12, 13];
    try {
      const respuestas = await Promise.all(
        tipos.map(async (tipo) => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=${tipo}`, {
            headers: {
              "Chibcha-api-key": import.meta.env.VITE_API_KEY,
            },
          });

          if (res.status === 404) return [];

          const datos = await res.json();

          return datos.map((emp) => ({
            ...emp,
            idtipocuenta: tipo,
          }));
        })
      );

      const empleadosFinal = respuestas.flat().map((emp) => ({
        idcuenta: emp.idcuenta ?? emp.IDCUENTA,
        nombrecuenta: emp.nombrecuenta ?? emp.NOMBRECUENTA,
        correo: emp.correo ?? emp.CORREO,
        idtipocuenta: emp.idtipocuenta ?? emp.IDTIPOCUENTA,
      }));

      setEmpleados(empleadosFinal);
    } catch (err) {
      console.error(err);
      setError("Error al cargar empleados.");
    }
  };

  useEffect(() => {
    obtenerTodosLosEmpleados();
  }, []);

  const irADetalle = (correo) => {
    navigate(`/empleado/${correo}`);
  };

  const manejarReasignar = async (correo) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cuenta_por_correo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ correo }),
      });

      if (!res.ok) throw new Error("No se pudo obtener los datos");

      const datos = await res.json();
      setEmpleadoEditando(datos);
      setNuevoNivel(datos.IDTIPOCUENTA);
      setMensaje("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del empleado.");
    }
  };

  const guardarCambios = async () => {
    if (!empleadoEditando || !nuevoNivel) {
      setError("Faltan datos para guardar.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${empleadoEditando.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          ...empleadoEditando,
          IDTIPOCUENTA: parseInt(nuevoNivel),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      setMensaje("Nivel actualizado correctamente.");
      setEmpleadoEditando(null);
      setNuevoNivel(null);
      setError("");

      await obtenerTodosLosEmpleados();
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios.");
    }
  };

  return (
    <div className="empleados-admin-container">
      <h2>Gestión de Técnicos</h2>
      {error && <p className="error">{error}</p>}
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <table className="tabla-empleados">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Nivel Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.idcuenta}>
              <td
                className="nombre-enlace"
                style={{ cursor: "pointer", color: "#924600" }}
                onClick={() => irADetalle(emp.correo)}
              >
                {emp.nombrecuenta}
              </td>
              <td>{emp.correo}</td>
              <td>{niveles[emp.idtipocuenta] || "Sin asignar"}</td>
              <td>
                {empleadoEditando?.CORREO === emp.correo ? (
                  <>
                    <select
                      value={nuevoNivel}
                      onChange={(e) => setNuevoNivel(parseInt(e.target.value))}
                    >
                      <option value="">Selecciona un nivel</option>
                      <option value={11}>Técnico Nivel 1</option>
                      <option value={12}>Técnico Nivel 2</option>
                      <option value={13}>Técnico Nivel 3</option>
                    </select>
                    <button className="btn-guardar" onClick={guardarCambios}>
                      <FaSave style={{ marginRight: "6px" }} />
                      Guardar
                    </button>
                  </>
                ) : (
                  <button className="btn-reasignar" onClick={() => manejarReasignar(emp.correo)}>
                    <FaSyncAlt style={{ marginRight: "6px" }} />
                    Reasignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
