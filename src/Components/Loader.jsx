// src/components/Loader.jsx
import React from "react";
import "../styles.css"; // Asegúrate de que contiene las clases globales

export default function Loader({ mensaje = "Cargando..." }) {
  return (
    <div className="busqueda-especial">
      <div className="spinner" />
      <p className="texto-carga">
        {mensaje} <br />
        <span>Por favor espera…</span>
      </p>
    </div>
  );
}
