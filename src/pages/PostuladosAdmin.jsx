import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostuladosAdmin.css";

export default function PostuladosAdmin() {
  const [postulados, setPostulados] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPostulados = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=5`, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los postulados");

        const data = await res.json();
        setPostulados(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los postulados.");
      }
    };

    obtenerPostulados();
  }, []);

  const irADetalle = (correo) => {
    navigate(`/postulado/${encodeURIComponent(correo)}`);
  };

  return (
    <div className="postulados-admin-container">
      <h2>Postulaciones Pendientes</h2>
      {error && <p className="error">{error}</p>}

      <div className="tarjetas-postulados">
        {postulados.map((postulado) => (
          <div
            key={postulado.idcuenta}
            className="tarjeta-postulado"
            onClick={() => irADetalle(postulado.correo)} // ✅ corrección aquí
            style={{ cursor: "pointer" }}
          >
            <h3>{postulado.nombrecuenta}</h3>
            <p>{postulado.correo}</p>
            <span className="ver-detalle">Ver detalle →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
