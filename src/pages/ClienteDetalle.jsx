import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClienteDetalle.css";

export default function ClienteDetalle() {
  const { correo } = useParams();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/cuenta_por_correo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Chibcha-api-key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ correo }),
          }
        );

        if (!res.ok) throw new Error("No se pudo obtener el cliente");

        const data = await res.json();
        setCliente(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del cliente.");
      }
    };

    obtenerCliente();
  }, [correo]);

  if (error) return <p className="error">{error}</p>;
  if (!cliente) return <p className="cargando">Cargando información...</p>;

  return (
    <div className="cliente-detalle-container">
      <h2>Detalle del Cliente</h2>
      <div className="cliente-info">
        <p><strong>Nombre:</strong> {cliente.NOMBRECUENTA}</p>
        <p><strong>Correo:</strong> {cliente.CORREO}</p>
        <p><strong>Teléfono:</strong> {cliente.TELEFONO}</p>
        <p><strong>Identificación:</strong> {cliente.IDENTIFICACION}</p>
        <p><strong>Dirección:</strong> {cliente.DIRECCION}</p>
        <p><strong>País:</strong> {cliente.IDPAIS}</p>
        <p><strong>Tipo de cuenta:</strong> {cliente.IDTIPOCUENTA}</p>
      </div>

      <button className="btn-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>
    </div>
  );
}
