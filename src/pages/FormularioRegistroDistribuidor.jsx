import React, { useState } from "react";
import "./FormularioRegistroDistribuidor.css";
import logo from "../Components/resources/logo.png";
import { useNavigate } from "react-router-dom";

export default function FormularioRegistroDistribuidor() {
  const [form, setForm] = useState({
    razonSocial: "",
    nit: "",
    correo: "",
    telefono: "",
    direccion: "",
    idCredencialCuenta: "",
    contrasenaCuenta: "",
    contrasenaRepetida: "",
    idpais: "170",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if ((name === "telefono" || name === "nit") && /[^\d]/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    if (form.contrasenaCuenta !== form.contrasenaRepetida) {
      return "Las contraseñas no coinciden.";
    }

    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "País no soportado.";
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
      razonsocial: form.razonSocial,
      nit: form.nit,
      correo: form.correo,
      telefono: form.telefono || "0",
      direccion: form.direccion || "N/A",
      idcredencialcuenta: form.idCredencialCuenta,
      password: form.contrasenaCuenta,
      idtipocuenta: "2",
      idpais: form.idpais,
      idplan: "0",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registrarDistribuidor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const texto = await res.text();
        setMensaje(`Error: ${texto}`);
        return;
      }

      const respuesta = await res.json();
      const idcuenta = respuesta.idcuenta;

      // Guardar en localStorage para ConfirmarCuenta.jsx
      localStorage.setItem("idCuenta", idcuenta);
      localStorage.setItem("loginTemp", JSON.stringify({
        identificacion: form.nit,
        password: form.contrasenaCuenta,
      }));

      setMensaje("✅ Distribuidor registrado. Redirigiendo a verificación...");

      setForm({
        razonSocial: "",
        nit: "",
        correo: "",
        telefono: "",
        direccion: "",
        idCredencialCuenta: "",
        contrasenaCuenta: "",
        contrasenaRepetida: "",
        idpais: "170",
      });

      setTimeout(() => navigate("/verificar"), 1500);
    } catch (err) {
      console.error("Error de red:", err);
      setMensaje("Error de red al registrar distribuidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"></div>
      <div className="form-wrapper">
        <div className="registro-form">
          <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />
          <h3 className="subtitulo">Accede a nuestros planes de distribución y beneficios exclusivos</h3>
          <h1 className="titulo">Regístrate como distribuidor y comienza a generar ingresos hoy mismo</h1>

          <form onSubmit={manejarSubmit} className="form-dos-columnas">
            {/* Columna izquierda */}
            <div className="columna-formulario">
              <div className="separador-formulario">Datos de la empresa</div>
              <input
                type="text"
                placeholder="Razón social"
                name="razonSocial"
                required
                value={form.razonSocial}
                onChange={manejarCambio}
              />
              <input
                type="text"
                placeholder="NIT de la empresa"
                name="nit"
                required
                value={form.nit}
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
            </div>

            {/* Columna derecha */}
            <div className="columna-formulario">
              <div className="separador-formulario">Credenciales</div>
              <input
                type="text"
                placeholder="Nombre de usuario"
                name="idCredencialCuenta"
                value={form.idCredencialCuenta}
                onChange={manejarCambio}
              />
              <input
                type="password"
                placeholder="Contraseña"
                name="contrasenaCuenta"
                required
                value={form.contrasenaCuenta}
                onChange={manejarCambio}
              />
              <input
                type="password"
                placeholder="Repetir contraseña"
                name="contrasenaRepetida"
                required
                value={form.contrasenaRepetida}
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
            </div>
          </form>

          {mensaje && <p className="mensaje-estado">{mensaje}</p>}

          <p className="login-link">
            ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
          </p>
        </div>
      </div>
      <div className="registro-imagen"></div>
    </div>
  );
}
