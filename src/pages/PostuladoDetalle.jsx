import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostuladoDetalle.css";
import { FiArrowLeft } from "react-icons/fi";

export default function PostuladoDetalle() {
  const { correo } = useParams();
  const [postulado, setPostulado] = useState(null);
  const [error, setError] = useState("");
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
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

  const asignar = async () => {
    if (!nivelSeleccionado) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${postulado.IDCUENTA}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ IDTIPOCUENTA: nivelSeleccionado }),
        }
      );

      if (!res.ok) throw new Error("Error al asignar nivel");

      navigate("/PostuladosAdmin");
    } catch (err) {
      console.error(err);
      setError("No se pudo asignar el nivel.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!postulado) return <p className="cargando">Cargando...</p>;

  return (
    <div className="postulado-detalle-container">
      <button className="btn-volver-arriba" onClick={() => navigate(-1)} title="Volver">
        <FiArrowLeft />
      </button>

      <h2>Detalle del Postulado</h2>
      <p><strong>ID:</strong> {postulado.IDCUENTA}</p>
      <p><strong>Nombre:</strong> {postulado.NOMBRECUENTA}</p>
      <p><strong>Correo:</strong> {postulado.CORREO}</p>
      <p><strong>Teléfono:</strong> {postulado.TELEFONO}</p>
      <p><strong>Dirección:</strong> {postulado.DIRECCION}</p>

      <div className="nivel-soporte-selector">
        <label className="nivel-soporte-label">Asignar nivel de soporte:</label>
        <div className="botones-nivel">
          {[11, 12, 13].map((nivel) => (
            <button
              key={nivel}
              onClick={() => setNivelSeleccionado(nivel)}
              className={`boton-nivel ${nivelSeleccionado === nivel ? "selected" : ""}`}
            >
              Técnico Nivel {nivel - 10}
            </button>
          ))}
        </div>
      </div>

      <div className="botones-detalle">
        <button
          className="btn-asignar"
          onClick={asignar}
          disabled={!nivelSeleccionado}
        >
          🛠 Asignar Nivel
        </button>
      </div>
    </div>
  );
}
