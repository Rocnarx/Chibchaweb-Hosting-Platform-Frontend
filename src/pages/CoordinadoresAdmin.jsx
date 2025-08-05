import React, { useEffect, useState } from "react";
import { FaSyncAlt, FaSave } from "react-icons/fa";
import "./CoordinadoresAdmin.css"; // Puedes usar el mismo CSS o crear CoordinadoresAdmin.css si deseas estilos distintos

export default function CoordinadoresAdmin() {
  const [coordinadores, setCoordinadores] = useState([]);
  const [coordinadorEditando, setCoordinadorEditando] = useState(null);
  const [nuevoNivel, setNuevoNivel] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const niveles = {
    8: "Coordinador Nivel 1",
    9: "Coordinador Nivel 2",
    10: "Coordinador Nivel 3",
  };

  const obtenerCoordinadores = async () => {
    const tipos = [8, 9, 10];
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

          return datos.map((coord) => ({
            ...coord,
            idtipocuenta: tipo,
          }));
        })
      );

      const coordinadoresFinal = respuestas.flat().map((coord) => ({
        idcuenta: coord.idcuenta ?? coord.IDCUENTA,
        nombrecuenta: coord.nombrecuenta ?? coord.NOMBRECUENTA,
        correo: coord.correo ?? coord.CORREO,
        idtipocuenta: coord.idtipocuenta ?? coord.IDTIPOCUENTA,
      }));

      setCoordinadores(coordinadoresFinal);
    } catch (err) {
      console.error(err);
      setError("Error al cargar coordinadores.");
    }
  };

  useEffect(() => {
    obtenerCoordinadores();
  }, []);

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
      setCoordinadorEditando(datos);
      setNuevoNivel(datos.IDTIPOCUENTA);
      setMensaje("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del coordinador.");
    }
  };

  const guardarCambios = async () => {
    if (!coordinadorEditando || !nuevoNivel) {
      setError("Faltan datos para guardar.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${coordinadorEditando.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          ...coordinadorEditando,
          IDTIPOCUENTA: parseInt(nuevoNivel),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      setMensaje("Nivel actualizado correctamente.");
      setCoordinadorEditando(null);
      setNuevoNivel(null);
      setError("");

      await obtenerCoordinadores(); // ✅ Recarga sin refrescar la página
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios.");
    }
  };

 return (
  <div className="coordinadores-page-container">
    <h2>Gestión de Coordinadores</h2>
    {error && <p className="error-coordinador">{error}</p>}
    {mensaje && <p className="mensaje-coordinador">{mensaje}</p>}

    <table className="tabla-coordinadores-admin">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Nivel Actual</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {coordinadores.map((coord) => (
          <tr key={coord.idcuenta}>
            <td>{coord.nombrecuenta}</td>
            <td>{coord.correo}</td>
            <td>{niveles[coord.idtipocuenta] || "Sin asignar"}</td>
            <td>
              {coordinadorEditando?.CORREO === coord.correo ? (
                <>
                  <select
                    className="coordinador-select"
                    value={nuevoNivel}
                    onChange={(e) => setNuevoNivel(parseInt(e.target.value))}
                  >
                    <option value="">Selecciona un nivel</option>
                    <option value={8}>Coordinador Nivel 1</option>
                    <option value={9}>Coordinador Nivel 2</option>
                    <option value={10}>Coordinador Nivel 3</option>
                  </select>
                  <button className="btn-coordinador-guardar" onClick={guardarCambios}>
                    <FaSave style={{ marginRight: "6px" }} />
                    Guardar
                  </button>
                </>
              ) : (
                <button
                  className="btn-coordinador-reasignar"
                  onClick={() => manejarReasignar(coord.correo)}
                >
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
