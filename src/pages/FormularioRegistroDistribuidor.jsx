import React, { useState } from "react";
import "./FormularioRegistroDistribuidor.css";
import logo from "../Components/resources/logo.png";

export default function FormularioRegistroDistribuidor() {
  const [form, setForm] = useState({
    nombrecuenta: "",
    identificacion: "",
    correo: "",
    telefono: "",
    direccion: "",
    password: "",
    idpais: "170",     // Colombia por defecto
    idtipocuenta: "2", // Distribuidor o tipo 4
    idplan: "0",       // Plan básico por defecto
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "❌ País no soportado.";
    }
    if (!form.password || form.password.length < 6) {
      return "❌ La contraseña debe tener al menos 6 caracteres.";
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

    setCargando(true);

    const datos = {
      nombrecuenta: form.nombrecuenta,
      identificacion: form.identificacion,
      correo: form.correo,
      telefono: form.telefono ? parseInt(form.telefono, 10) : undefined,
      direccion: form.direccion || "N/A",
      password: form.password,
      idpais: parseInt(form.idpais, 10),
      idtipocuenta: parseInt(form.idtipocuenta, 10),
      idplan: "0",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registrar2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const texto = await res.text();
        setMensaje(`❌ Error: ${texto}`);
        return;
      }

      setMensaje("✅ Distribuidor registrado con éxito.");
      setForm({
        nombrecuenta: "",
        identificacion: "",
        correo: "",
        telefono: "",
        direccion: "",
        password: "",
        idpais: "170",
        idtipocuenta: "4",
        idplan: "0",
      });
    } catch (err) {
      console.error("Error de red:", err);
      setMensaje("❌ Error de red al registrar el distribuidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-distribuidor"></div>

      <div className="registro-form">
        <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />

        <h3 className="subtitulo">
          Accede a nuestros planes de distribución y beneficios exclusivos
        </h3>
        <h1 className="titulo">
          Regístrate como distribuidor y comienza a generar ingresos hoy mismo
        </h1>

        <form onSubmit={manejarSubmit}>
          <div className="separador-formulario">Datos de la empresa</div>
          <input
            type="text"
            placeholder="Razón social"
            name="nombrecuenta"
            required
            value={form.nombrecuenta}
            onChange={manejarCambio}
          />
          <input
            type="text"
            placeholder="NIT"
            name="identificacion"
            required
            value={form.identificacion}
            onChange={manejarCambio}
          />

          <div className="separador-formulario">Datos de contacto</div>
          <input
            type="email"
            placeholder="Correo electrónico"
            name="correo"
            required
            value={form.correo}
            onChange={manejarCambio}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={manejarCambio}
          />
          <input
            type="text"
            placeholder="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={manejarCambio}
          />

          <div className="separador-formulario">Credenciales</div>
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            required
            value={form.password}
            onChange={manejarCambio}
          />

          <div className="separador-formulario">País</div>
          <select name="idpais" value={form.idpais} onChange={manejarCambio}>
            <option value="76">Brasil</option>
            <option value="170">Colombia</option>
            <option value="218">Ecuador</option>
            <option value="604">Perú</option>
            <option value="862">Venezuela</option>
          </select>

          <button type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {mensaje && <p className="mensaje-estado">{mensaje}</p>}

        <p className="login-link">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" onClick={e => { e.preventDefault(); window.location.href = "/login"; }}>
            Inicia sesión
          </a>
        </p>
      </div>

      <div className="registro-distribuidor"></div>
    </div>
  );
}
