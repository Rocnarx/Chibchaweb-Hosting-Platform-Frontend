import React, { useEffect, useState } from "react";
import "./ConfirmarCuenta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function ConfirmarCuenta() {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  useEffect(() => {
    const tokenURL = searchParams.get("token");
    const idcuentaURL = searchParams.get("idcuenta");

    if (tokenURL && idcuentaURL) {
      confirmarCuenta(tokenURL, idcuentaURL);
    }
  }, [searchParams]);

  const confirmarCuenta = async (token, idcuenta) => {
    setCargando(true);
    setMensaje("");
    setEstado(null);

    try {
      const url = `${import.meta.env.VITE_API_URL}/confirmar-registro?token=${token}&idcuenta=${idcuenta}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
      });

      const data = await res.text();

      if (res.ok) {
        setMensaje("✅ Cuenta confirmada. Iniciando sesión...");
        setEstado("success");

        const stored = localStorage.getItem("usuario");
        if (stored) {
          const usuarioActual = JSON.parse(stored);
          usuarioActual.verificado = true;
          localStorage.setItem("usuario", JSON.stringify(usuarioActual));
          setUsuario(usuarioActual);
        }


        setTimeout(() => {
          loginAutomatico();
        }, 1500);
      } else {
        setMensaje(` Error: ${data}`);
        setEstado("error");
      }
    } catch (err) {
      console.error(err);
      setMensaje(" Error al conectar con el servidor.");
      setEstado("error");
    } finally {
      setCargando(false);
    }
  };

  const loginAutomatico = async () => {
    const credenciales = JSON.parse(localStorage.getItem("loginTemp") || "{}");

    if (!credenciales.identificacion || !credenciales.password) {
      setMensaje("Cuenta verificada. Inicia sesión manualmente.");
      setEstado("warning");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          identificacion: credenciales.identificacion,
          password: credenciales.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(data));
        setUsuario(data);
        localStorage.removeItem("loginTemp");
        navigate("/perfil");
      } else {
        setMensaje("Cuenta verificada. Inicia sesión manualmente.");
        setEstado("warning");
        navigate("/login");
      }
    } catch (err) {
      console.error("Login automático falló:", err);
      setMensaje("Error al intentar iniciar sesión. Hazlo manualmente.");
      setEstado("error");
      navigate("/login");
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const idcuenta = localStorage.getItem("idCuenta")?.trim();

    if (!idcuenta || idcuenta.includes("{")) {
      setMensaje(" ID de cuenta inválido. Intenta registrarte de nuevo.");
      setEstado("warning");
      return;
    }

    confirmarCuenta(codigo, idcuenta);
  };

  const renderIcon = () => {
    if (estado === "success") return <FontAwesomeIcon icon={faCheckCircle} color="#28a745" />;
    if (estado === "error") return <FontAwesomeIcon icon={faExclamationTriangle} color="#dc3545" />;
    if (estado === "warning") return <FontAwesomeIcon icon={faExclamationTriangle} color="#ffc107" />;
    return null;
  };

  return (
    <div className="verificacion-wrapper">
      <div className="verificacion-card">
        <h2>Verificar tu cuenta</h2>
        <p>Ingresa el código que recibiste por correo para activar tu cuenta:</p>

        <form onSubmit={manejarSubmit}>
          <input
            type="text"
            placeholder="Código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Verificando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "8px" }} />
                Confirmar
              </>
            )}
          </button>
        </form>

        {mensaje && (
          <p className={`mensaje-estado ${estado}`}>
            {renderIcon()} <span>{mensaje}</span>
          </p>
        )}

        <div className="volver-login">
          <p className="texto-pregunta">¿Ya estás registrado?</p>
          <button className="boton-login" onClick={() => navigate("/login")}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
