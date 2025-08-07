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
    contrasenaCuenta: "",
    repetirContrasena: "",
    idpais: "170",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "telefono" && /[^ -9]/.test(value)) return;
    if (name === "identificacion" && /[^0-9-]/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    if (!/^[0-9]{6,10}$/.test(form.identificacion)) {
      return "La identificación debe tener entre 6 y 10 dígitos.";
    }
    if (form.contrasenaCuenta !== form.repetirContrasena) {
      return "❌ Las contraseñas no coinciden.";
    }
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
      idtipocuenta: "5",
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
        contrasenaCuenta: "",
        repetirContrasena: "",
        idpais: "170",
      });

      setTimeout(() => navigate("/verificar"), 1500);
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
      <div className="form-wrapper">
        <div className="registro-form">
          <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />
          <h3 className="subtitulo">Administra tu equipo desde aquí</h3>
          <h1 className="titulo">Registrar nuevo empleado</h1>

          <form onSubmit={manejarSubmit} className="form-dos-columnas">
            {/* Columna izquierda */}
            <div className="columna-formulario">
              <div className="separador-formulario">Datos personales</div>
              <input type="text" placeholder="Nombre completo" name="nombreCuenta" required value={form.nombreCuenta} onChange={manejarCambio} />
              <input type="text" placeholder="Identificación" name="identificacion" required maxLength={10} value={form.identificacion} onChange={manejarCambio} />
              <input type="text" placeholder="Dirección (opcional)" name="direccion" value={form.direccion} onChange={manejarCambio} />

              <div className="separador-formulario">Datos de contacto</div>
              <input type="email" placeholder="Correo electrónico" name="correo" required value={form.correo} onChange={manejarCambio} />
              <input type="tel" placeholder="Teléfono (opcional)" name="telefono" value={form.telefono} onChange={manejarCambio} />
            </div>

            {/* Columna derecha */}
            <div className="columna-formulario">
              <div className="separador-formulario">Credenciales</div>
              <input type="password" placeholder="Contraseña" name="contrasenaCuenta" required value={form.contrasenaCuenta} onChange={manejarCambio} />
              <input type="password" placeholder="Repetir contraseña" name="repetirContrasena" required value={form.repetirContrasena} onChange={manejarCambio} />

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
            ¿Ya eres parte del equipo? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </div>
      <div className="registro-imagen"></div>
    </div>
  );
}
