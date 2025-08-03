import React, { useState } from "react";
import "./FormularioRegistroCliente.css";
import logo from "../Components/resources/logo.png";
import { useNavigate } from "react-router-dom";

export default function FormularioRegistroEmpleado() {
  const [form, setForm] = useState({
    nombreCuenta: "",
    identificacion: "",
    direccion: "",
    correo: "",
    telefono: "",
    idCredencialCuenta: "",
    contrasenaCuenta: "",
    idpais: "170",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "❌ País no soportado.";
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
      identificacion: form.identificacion,
      nombrecuenta: form.nombreCuenta,
      correo: form.correo,
      telefono: form.telefono || "0",
      direccion: form.direccion || "N/A",
      idtipocuenta: "4", // Tipo empleado
      idpais: form.idpais,
      idplan: "0",
      password: form.contrasenaCuenta,
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

      const respuesta = await res.json();
      const idcuenta = respuesta.idcuenta;

      // Guardar en localStorage
      localStorage.setItem("idCuenta", idcuenta);
      localStorage.setItem("loginTemp", JSON.stringify({
        identificacion: datos.identificacion,
        password: datos.password,
      }));

      setMensaje("✅ Empleado registrado. Redirigiendo a verificación...");

      setForm({
        nombreCuenta: "",
        identificacion: "",
        direccion: "",
        correo: "",
        telefono: "",
        idCredencialCuenta: "",
        contrasenaCuenta: "",
        idpais: "170",
      });

      setTimeout(() => {
        navigate("/verificar");
      }, 1500);
    } catch (err) {
      console.error("Error de red:", err);
      setMensaje("❌ Error de red al registrar el empleado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"></div>

      <div className="registro-form">
        <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />
        <h3 className="subtitulo">Administra tu equipo desde aquí</h3>
        <h1 className="titulo">Registrar nuevo empleado</h1>

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

          <button type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {mensaje && <p className="mensaje-estado">{mensaje}</p>}

        <p className="login-link">
          ¿Ya eres parte del equipo?{" "}
          <a href="#" onClick={e => { e.preventDefault(); window.location.href = "/login"; }}>
            Inicia sesión
          </a>
        </p>
      </div>

      <div className="registro-imagen"></div>
    </div>
  );
}
