import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmpleadosAdmin.css";

export default function EmpleadosAdmin() {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=4`, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error("Error al obtener empleados");

        const data = await res.json();
        setEmpleados(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los empleados.");
      }
    };

    obtenerEmpleados();
  }, []);

  const irADetalle = (correo) => {
    navigate(`/empleados/${correo}`);
  };

  return (
    <div className="empleados-admin-container">
      <h2>Empleados Registrados</h2>
      {error && <p className="error">{error}</p>}

      <div className="tarjetas-empleados">
        {empleados.map((empleado) => (
          <div
            key={empleado.idcuenta}
            className="tarjeta-empleado"
            onClick={() => irADetalle(empleado.correo)}
          >
            <h3>{empleado.nombrecuenta}</h3>
            <p>{empleado.correo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
