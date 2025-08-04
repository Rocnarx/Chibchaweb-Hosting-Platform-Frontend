// src/pages/PostuladoDetalle.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostuladoDetalle.css";

export default function PostuladoDetalle() {
  const { correo } = useParams();
  const [postulado, setPostulado] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostulado = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuenta_por_correo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ correo }),
        });

        if (!res.ok) throw new Error("Error al obtener el detalle");

        const data = await res.json();
        setPostulado(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del postulado.");
      }
    };

    fetchPostulado();
  }, [correo]);

  const aceptar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${postulado.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ IDTIPOCUENTA: 4 }), // Aceptado como EMPLEADO
      });

      if (!res.ok) throw new Error("Error al aceptar");

      navigate("/PostuladosAdmin");
    } catch (err) {
      console.error(err);
      setError("No se pudo aceptar.");
    }
  };

  const rechazar = async () => {
    const confirmar = confirm("¿Seguro que quieres rechazar esta postulación?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${postulado.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ IDTIPOCUENTA: 6 }), // Rechazado (Eliminado)
      });

      if (!res.ok) throw new Error("Error al rechazar");

      navigate("/PostuladosAdmin");
    } catch (err) {
      console.error(err);
      setError("No se pudo rechazar.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!postulado) return <p>Cargando...</p>;

  return (
    <div className="postulado-detalle-container">
      <button onClick={() => navigate(-1)}>← Volver</button>
      <h2>Detalle del Postulado</h2>
      <p><strong>ID:</strong> {postulado.IDCUENTA}</p>
      <p><strong>Nombre:</strong> {postulado.NOMBRECUENTA}</p>
      <p><strong>Correo:</strong> {postulado.CORREO}</p>
      <p><strong>Teléfono:</strong> {postulado.TELEFONO}</p>
      <p><strong>Dirección:</strong> {postulado.DIRECCION}</p>

      <div className="botones-detalle">
        <button className="btn-aceptar" onClick={aceptar}>✔ Aceptar</button>
        <button className="btn-rechazar" onClick={rechazar}>✖ Rechazar</button>
      </div>
    </div>
  );
}
