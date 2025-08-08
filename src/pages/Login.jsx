import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../Components/resources/logo.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useStats } from "../Context/StatsContext";
import { BiArrowBack } from "react-icons/bi";

export default function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { setUsuario } = useUser();
  const { preload } = useStats();

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

      const usuarioFinal = { ...datos, verificado };
      setUsuario(usuarioFinal);

      // ✅ Prefetch solo si es ADMIN
      if (usuarioFinal.tipocuenta?.toUpperCase() === "ADMIN") {
        preload().catch(() => {});
      }

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

  // Modales para recuperación de contraseña
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [mostrarModalToken, setMostrarModalToken] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");

  const solicitarRecuperacion = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/solicitar-recuperacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ correo: correoRecuperacion }),
      });

      if (res.ok) {
        setMostrarModalCorreo(false);
        setMostrarModalToken(true);
      } else {
        const error = await res.text();
        alert("❌ Error al solicitar recuperación: " + error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error al solicitar recuperación.");
    }
  };

  const restablecerContrasena = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/restablecer-contrasena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          correo: correoRecuperacion,
          token: token,
          nueva_contrasena: nuevaContrasena,
        }),
      });

      if (res.ok) {
        alert("✅ Contraseña restablecida correctamente.");
        setMostrarModalToken(false);
        setCorreoRecuperacion("");
        setToken("");
        setNuevaContrasena("");
      } else {
        const error = await res.text();
        alert("❌ Error al restablecer la contraseña: " + error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error al restablecer la contraseña.");
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

        <p className="recuperar-link" onClick={() => setMostrarModalCorreo(true)}>
          ¿Olvidaste tu contraseña?
        </p>

        <p className="enlace">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          <br />
          ¿Eres una empresa? <a href="/registroDistribuidor">¡Regístrate como distribuidor!</a>
        </p>
      </div>

      {mostrarModalCorreo && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Recuperar contraseña</h2>
            <input
              type="email"
              placeholder="Correo"
              value={correoRecuperacion}
              onChange={(e) => setCorreoRecuperacion(e.target.value)}
            />
            <button onClick={solicitarRecuperacion}>Siguiente</button>
            <button className="cancel-button" onClick={() => setMostrarModalCorreo(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarModalToken && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Restablecer contraseña</h2>
            <input
              type="text"
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
            />
            <button onClick={restablecerContrasena}>Cambiar contraseña</button>
            <button className="cancel-button" onClick={() => setMostrarModalToken(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
