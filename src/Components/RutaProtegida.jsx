import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function RutaProtegida({ children }) {
  const { usuario } = useUser();

  if (!usuario) {
    // No ha iniciado sesión
    return <Navigate to="/login" replace />;
  }

  if (!usuario.verificado) {
    // No ha verificado su cuenta
    return <Navigate to="/verificar" replace />;
  }

  // Usuario válido y verificado
  return children;
}
