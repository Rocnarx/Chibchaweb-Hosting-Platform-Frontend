import React from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Cuenta.css";
import { FiLogOut } from "react-icons/fi";
export default function Cuenta() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const paises = {
    76: "BRASIL",
    170: "COLOMBIA",
    218: "ECUADOR",
    604: "PERÚ",
    862: "VENEZUELA",
  };

  return (
    <div className="cuenta-container">
      <h2>Mi Perfil</h2>

      <div className="cuenta-info">
        <div className="cuenta-dato">
          <strong>Nombre:</strong> <span>{usuario.nombrecuenta}</span>
        </div>
        <div className="cuenta-dato">
          <strong>CC:</strong> <span>{usuario.identificacion}</span>
        </div>
        <div className="cuenta-dato">
          <strong>Correo:</strong> <span>{usuario.correo}</span>
        </div>
        <div className="cuenta-dato">
          <strong>Teléfono:</strong> <span>{usuario.telefono}</span>
        </div>
        <div className="cuenta-dato">
          <strong>Dirección:</strong> <span>{usuario.direccion}</span>
        </div>
        <div className="cuenta-dato">
          <strong>País:</strong> <span>{paises[usuario.pais] || ` ${usuario.pais}`}</span>
        </div>
      </div>

      <div className="botones-accion">
        <button className="btn-metodo-pago" onClick={() => navigate("/Tarjeta")}>
          Agregar método de pago
        </button>

        <button className="btn-metodo-pago" onClick={() => navigate("/metodos")}>
          Mis métodos
        </button>

        <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
  <FiLogOut style={{ marginRight: "8px" }} />
  Cerrar sesión
</button>
      </div>
    </div>
  );
}
