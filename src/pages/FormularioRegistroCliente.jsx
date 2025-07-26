import React from "react";
import "./FormularioRegistroCliente.css";
import logo from "../Components/resources/logo.png"; 
export default function FormularioRegistro() {
  return (
    
    <div className="registro-container">
      {/* Columna izquierda*/}
      <div className="registro-imagen"></div>

     {/* Columna centro*/}
      <div className="registro-form">
        <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />

        <h3 className="subtitulo">Accede a nuestros planes de hosting</h3>
        <h1 className="titulo">
          Crea tu cuenta y empieza a construir tu presencia en la web
        </h1>

        <form>
          <div className="separador-formulario">Datos personales</div>
          <input type="text" placeholder="Nombre completo" name="nombreCuenta" required />
          <input type="text" placeholder="Identificación" name="identificacion" required />
          <input type="text" placeholder="Dirección (opcional)" name="direccion" />
          <div className="separador-formulario">Datos de contacto</div>
          <input type="email" placeholder="Correo electrónico" name="correo" required />
          <input type="tel" placeholder="Teléfono (opcional)" name="telefono" />
          <div className="separador-formulario">Credenciales</div>
          <input type="text" placeholder="Nombre de usuario" name="idCredencialCuenta" />
          <input type="password" placeholder="Contraseña" name="contrasenaCuenta" required />

          <button type="submit">Registrarse</button>
        </form>

        <p className="login-link">
          ¿Ya tienes una cuentaaaaa? <a href="#">Inicia sesión</a>
        </p>
      </div>

      {/* Columna derecha*/}
      <div className="registro-imagen"></div>
    </div>
  );
}
