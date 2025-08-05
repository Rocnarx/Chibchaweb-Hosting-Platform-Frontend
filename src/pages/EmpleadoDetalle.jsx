import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmpleadoDetalle.css";

export default function EmpleadoDetalle() {
  const { correo } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const paises = {
    76: "BRASIL",
    170: "COLOMBIA",
    218: "ECUADOR",
    604: "PERÚ",
    862: "VENEZUELA",
  };

  useEffect(() => {
    const obtenerEmpleado = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuenta_por_correo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ correo }),
        });

        if (!res.ok) throw new Error("Error al obtener empleado");

        const data = await res.json();
        setEmpleado(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del empleado.");
      }
    };

    obtenerEmpleado();
  }, [correo]);

  const despedirEmpleado = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas pasar al empleado a postulado?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${empleado.IDCUENTA}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ ...empleado, IDTIPOCUENTA: 5 }), // Postulado
        }
      );

      if (!res.ok) throw new Error("Error al cambiar el tipo de cuenta");

      setMensaje("Empleado cambiado a postulado correctamente.");
      setTimeout(() => navigate("/EmpleadosAdmin"), 1500);
    } catch (err) {
      console.error(err);
      setError("No se pudo modificar el tipo de cuenta.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!empleado) return <p className="cargando">Cargando información del empleado...</p>;

  return (
    <div className="empleado-detalle-container">
      <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
      <h2>Detalle del Empleado</h2>

      <div className="detalle-box">
        <p><strong>ID:</strong> {empleado.IDCUENTA}</p>
        <p><strong>Nombre:</strong> {empleado.NOMBRECUENTA}</p>
        <p><strong>Correo:</strong> {empleado.CORREO}</p>
        <p><strong>Teléfono:</strong> {empleado.TELEFONO}</p>
        <p><strong>Dirección:</strong> {empleado.DIRECCION}</p>
        <p><strong>País:</strong> {paises[empleado.IDPAIS] || `Código ${empleado.IDPAIS}`}</p>
      </div>

      <button className="btn-despedir" onClick={despedirEmpleado}>
        Despedir
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
