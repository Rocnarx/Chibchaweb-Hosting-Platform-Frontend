import React from "react"; 
import { Navigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function RutaProtegida({ children, requiereVerificacion = false }) {
  const { usuario } = useUser();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (requiereVerificacion && !usuario.verificado) {
    return <Navigate to="/verificar" replace />;
  }

  return children;
}
