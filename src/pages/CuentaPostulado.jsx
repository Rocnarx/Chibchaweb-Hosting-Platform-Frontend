import React from "react";
import { useNavigate } from "react-router-dom";
import "./CuentaPostulado.css"; // Asegúrate que este archivo existe

import { useUser } from "../Context/UserContext";

export default function CuentaPostulado() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useUser();

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <div className="cuenta-postulado-container">
      <h1>Bienvenido, {usuario?.nombre || "Postulado"}</h1>
      <p>
        Estás registrado como postulado. Tu cuenta está siendo revisada. En
        cuanto sea aprobada, podrás acceder a todas las funcionalidades.
      </p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
