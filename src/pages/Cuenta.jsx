import React from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Cuenta.css";

export default function Cuenta() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    setUsuario(null); 
    localStorage.removeItem("usuario"); 
    navigate("/login"); 
  };

  return (
    <div className="cuenta-container">
      <h2>Datos de la Cuenta</h2>
      <div className="cuenta-dato"><strong>Nombre:</strong> {usuario.nombrecuenta}</div>
      <div className="cuenta-dato"><strong>CC:</strong> {usuario.identificacion}</div>
      <div className="cuenta-dato"><strong>Correo:</strong> {usuario.correo}</div>
      <div className="cuenta-dato"><strong>Teléfono:</strong> {usuario.telefono}</div>
      <div className="cuenta-dato"><strong>Dirección:</strong> {usuario.direccion}</div>
      <div className="cuenta-dato"><strong>País:</strong> {usuario.pais}</div>
      
        <div className="botones-accion">
  <button
    className="btn-metodo-pago"
    onClick={() => navigate("/Tarjeta")}
  >
    ➕ Agregar método de pago
  </button>

  <button
    className="btn-metodo-pago"
    onClick={() => navigate("/metodos")}
  >
    ➕ Agregar método de pago
  </button>

  <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
    Cerrar sesión
  </button>
</div>



    </div>
  );
}
