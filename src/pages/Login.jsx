import React, { useState } from "react";
import "./Login.css";
import logo from "../Components/resources/logo.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext"; // Si estás usando contexto

export default function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false); // Nuevo estado para bloquear botón
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true); // Desactivar botón

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          identificacion: form.usuario,
          password: form.password,
        }),
      });

      if (res.ok) {
        const datos = await res.json();
        console.log("✅ Datos del backend:", datos);
        setUsuario(datos);
        setMensaje("✅ ¡Bienvenido!");
        navigate("/perfil");
      } else {
        const texto = await res.text();
        console.error("❌ Error del backend:", texto);
        setMensaje("❌ Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("❌ Error de red:", err);
      setMensaje("❌ Error de red al intentar iniciar sesión");
    } finally {
      setCargando(false); // Reactivar botón
    }
  };

  return (
    <div className="login-container">
      <button className="btn-back" onClick={() => navigate(-1)}>←</button>
      <div className="login-box">
        <img src={logo} alt="ChibchaWeb" className="logo-login" />
        <h2 className="titulo-login">Iniciar sesión</h2>

        <form onSubmit={manejarSubmit}>

          <input
            type="text"
            name="usuario"
            placeholder="Identificación"
            value={form.usuario}
            onChange={manejarCambio}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={manejarCambio}
            required
          />
          <button type="submit" disabled={cargando}> {/* DESABILITA BOTON DE INICIO PARA EMPEZAR LA CARGA */}
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="enlace">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          <p className="enlace-prueba">
          ¿Eres una empresa?<a href="/registroDistribuidor">¡Regístrate como distribuidor!</a>
          </p>
        </p>
      </div>
    </div>
  );
}
