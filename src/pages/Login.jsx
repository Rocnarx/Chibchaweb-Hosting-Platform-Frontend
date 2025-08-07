import React, { useState } from "react";
import "./Login.css";
import logo from "../Components/resources/logo.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { BiArrowBack } from "react-icons/bi"; 
import { useEffect } from "react";

export default function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      navigate("/perfil", { replace: true });
    }
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

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

      if (!res.ok) {
        const texto = await res.text();
        console.error("❌ Error del backend:", texto);
        setMensaje("❌ Usuario o contraseña incorrectos");
        return;
      }

      const datos = await res.json();
      console.log("✅ Datos del backend:", datos);

      // Verifica si está confirmado
      const verificacionRes = await fetch(
        `${import.meta.env.VITE_API_URL}/estoy-verificado?idcuenta=${datos.idcuenta}`,
        {
          method: "GET",
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      const verificacionJson = await verificacionRes.json();
      const verificado = verificacionJson.verificado === true;

      setUsuario({ ...datos, verificado });

      if (verificado) {
        setMensaje("✅ ¡Bienvenido!");
        navigate("/perfil");
      } else {
        setMensaje("⚠️ Tu cuenta aún no ha sido verificada. Revisa tu correo.");
        navigate("/verificar");
      }

    } catch (err) {
      console.error("❌ Error de red:", err);
      setMensaje("❌ Error de red al intentar iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
  <BiArrowBack size={20} />
  Volver
</button>
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
          <button type="submit" disabled={cargando}>
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="enlace">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          <p className="enlace-prueba">
            ¿Eres una empresa? <a href="/registroDistribuidor">¡Regístrate como distribuidor!</a>
          </p>
        </p>
      </div>
    </div>
  );
}
