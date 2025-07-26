
import React from "react";
import "./FormularioRegistroDistribuidor.css";
import logo from "../Components/resources/logo.png"; 

export default function FormularioRegistro() {
  return (
    
    <div className="registro-container">
      {/* Columna izquierda*/}
      <div className="registro-distribuidor"></div>

     {/* Columna centro*/}
      <div className="registro-form">
        <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />

        <h3 className="subtitulo">Accede a nuestros planes de distribución y beneficios exclusivos</h3>
        <h1 className="titulo">
          Regístrate como distribuidor y comienza a generar ingresos hoy mismo
        </h1>

        <form>
          <div className="separador-formulario">Datos de la empresa</div>

          <input type="text" placeholder="Razón social" name="razonSocial" required />
          <input type="text" placeholder="Nit de la empresa" name="nit" required />
          <div className="separador-formulario">Datos de contacto</div>
          <input type="email" placeholder="Correo electrónico" name="correo" required />
          <input type="tel" placeholder="Teléfono" name="telefono" />
          <input type="text" placeholder="Dirección" name="direccion" />
          <div className="separador-formulario">Credenciales</div>
          <input type="text" placeholder="Nombre de usuario" name="idCredencialCuenta" />
          <input type="password" placeholder="Contraseña" name="contrasenaCuenta" required />
          <input type="password" placeholder="Repetir contraseña" name="contrasena" required />

          <button type="subm  it">Registrarse</button>
        </form>

        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
        </p>
      </div>

      {/* Columna derecha*/}
      <div className="registro-distribuidor"></div>
    </div>
  );
}
