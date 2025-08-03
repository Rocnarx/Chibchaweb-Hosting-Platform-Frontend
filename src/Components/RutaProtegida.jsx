import React from "react"; 
import { Navigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function RutaProtegida({ children }) {
  const { usuario } = useUser();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario.verificado) {
    return <Navigate to="/verificar" replace />;
  }

  // Usuario válido y verificado
  return children;
}
