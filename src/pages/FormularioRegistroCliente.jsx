import React, { useState } from "react";
import "./FormularioRegistroCliente.css";
import logo from "../Components/resources/logo.png";

export default function FormularioRegistro() {
  const [form, setForm] = useState({
    nombreCuenta: "",
    identificacion: "",
    direccion: "",
    correo: "",
    telefono: "",
    idCredencialCuenta: "",
    contrasenaCuenta: "",
    idpais: "170", // Colombia por defecto
  });

  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "País no soportado";
    }
    return null;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const error = validar();
    if (error) {
      setMensaje(error);
      return;
    }

    const datos = {
      identificacion: form.identificacion,
      nombrecuenta: form.nombreCuenta,
      correo: form.correo,
      telefono: form.telefono ? parseInt(form.telefono) : undefined,
      direccion: form.direccion,
      idtipocuenta: 1,     // fijo como cliente
      idpais: parseInt(form.idpais),
      idplan: "0",           // fijo como plan intermedio
      password: form.contrasenaCuenta
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        setMensaje("✅ ¡Cuenta registrada con éxito!");
        setForm({
          nombreCuenta: "",
          identificacion: "",
          direccion: "",
          correo: "",
          telefono: "",
          idCredencialCuenta: "",
          contrasenaCuenta: "",
          idpais: "170"
        });
      } else {
        const texto = await res.text();
        setMensaje(`❌ Error: ${texto}`);
      }
    } catch (err) {
      console.error("Error de red:", err);
      setMensaje("❌ Error de red al registrar la cuenta.");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"></div>

      <div className="registro-form">
        <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />
        <h3 className="subtitulo">Accede a nuestros planes de hosting</h3>
        <h1 className="titulo">Crea tu cuenta y empieza a construir tu presencia en la web</h1>

        <form onSubmit={manejarSubmit}>
          <div className="separador-formulario">Datos personales</div>
          <input type="text" placeholder="Nombre completo" name="nombreCuenta" required value={form.nombreCuenta} onChange={manejarCambio} />
          <input type="text" placeholder="Identificación" name="identificacion" required value={form.identificacion} onChange={manejarCambio} />
          <input type="text" placeholder="Dirección (opcional)" name="direccion" value={form.direccion} onChange={manejarCambio} />

          <div className="separador-formulario">Datos de contacto</div>
          <input type="email" placeholder="Correo electrónico" name="correo" required value={form.correo} onChange={manejarCambio} />
          <input type="tel" placeholder="Teléfono (opcional)" name="telefono" value={form.telefono} onChange={manejarCambio} />

          <div className="separador-formulario">Credenciales</div>
          <input type="text" placeholder="Nombre de usuario" name="idCredencialCuenta" value={form.idCredencialCuenta} onChange={manejarCambio} />
          <input type="password" placeholder="Contraseña" name="contrasenaCuenta" required value={form.contrasenaCuenta} onChange={manejarCambio} />

          <div className="separador-formulario">País</div>
          <select name="idpais" value={form.idpais} onChange={manejarCambio}>
            <option value="76">Brasil</option>
            <option value="170">Colombia</option>
            <option value="218">Ecuador</option>
            <option value="604">Perú</option>
            <option value="862">Venezuela</option>
          </select>

          <button type="submit">Registrarse</button>
        </form>

        {mensaje && <p className="mensaje-estado">{mensaje}</p>}

        <p className="login-link">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" onClick={e => { e.preventDefault(); window.location.href = "/login"; }}>
            Inicia sesión
          </a>
        </p>
      </div>

      <div className="registro-imagen"></div>
    </div>
  );
}
