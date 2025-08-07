import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Cuenta.css";
import { FiLogOut } from "react-icons/fi";

export default function Cuenta() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});

  const paises = {
    76: "BRASIL",
    170: "COLOMBIA",
    218: "ECUADOR",
    604: "PERÚ",
    862: "VENEZUELA",
  };

  const obtenerCodigoDePais = (nombre) => {
    const mapa = {
      BRASIL: 76,
      COLOMBIA: 170,
      ECUADOR: 218,
      PERÚ: 604,
      VENEZUELA: 862,
    };
    return typeof nombre === "number" ? nombre : mapa[nombre?.toUpperCase()] ?? 170;
  };

  useEffect(() => {
    const datosIniciales = {
      IDCUENTA: usuario.idcuenta,
      IDTIPOCUENTA: typeof usuario.tipocuenta === "number" ? usuario.tipocuenta : 1,
      IDPLAN: typeof usuario.plan === "number" ? usuario.plan : usuario.plan === "Sin plan" ? 0 : 1,
      NOMBRECUENTA: usuario.nombrecuenta,
      CORREO: usuario.correo,
      TELEFONO: usuario.telefono || "",
      FECHAREGISTRO: usuario.fecharegistro,
      DIRECCION: usuario.direccion || "",
      IDPAIS: obtenerCodigoDePais(usuario.pais),
    };
    setFormData(datosIniciales);
  }, [usuario]);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "IDPAIS" || name === "IDPLAN" || name === "TELEFONO"
        ? parseInt(value)
        : value,
    }));
  };

  const guardarCambios = async () => {
    if (!formData.NOMBRECUENTA.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.CORREO)) {
      alert("El correo electrónico no es válido.");
      return;
    }

    setGuardando(true);
    console.log("📤 Enviando al backend:", JSON.stringify(formData, null, 2));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${formData.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      console.log("📥 Código de respuesta:", res.status);

      if (!res.ok) throw new Error("No se pudo guardar.");

      const nuevoUsuario = {
        ...usuario,
        nombrecuenta: formData.NOMBRECUENTA,
        correo: formData.CORREO,
        telefono: formData.TELEFONO,
        direccion: formData.DIRECCION,
        pais: formData.IDPAIS,
        tipocuenta: formData.IDTIPOCUENTA,
        plan: formData.IDPLAN,
      };

      setUsuario(nuevoUsuario);
      localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
      setModoEdicion(false);
      alert("Perfil actualizado con éxito.");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("Hubo un error al actualizar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="cuenta-container">
      <h2>Mi Perfil</h2>

      <div className="cuenta-info">
        {modoEdicion ? (
          <>
            <div className="cuenta-dato">
              <strong>Nombre:</strong>
              <input name="NOMBRECUENTA" value={formData.NOMBRECUENTA} onChange={handleInputChange} />
            </div>

            <div className="cuenta-dato">
              <strong>Correo:</strong>
              <input name="CORREO" value={formData.CORREO} onChange={handleInputChange} />
            </div>

            <div className="cuenta-dato">
              <strong>Teléfono:</strong>
              <input name="TELEFONO" value={formData.TELEFONO} onChange={handleInputChange} />
            </div>

            <div className="cuenta-dato">
              <strong>Dirección:</strong>
              <input name="DIRECCION" value={formData.DIRECCION} onChange={handleInputChange} />
            </div>

            <div className="cuenta-dato">
              <strong>País:</strong>
              <select name="IDPAIS" value={formData.IDPAIS} onChange={handleInputChange}>
                {Object.entries(paises).map(([codigo, nombre]) => (
                  <option key={codigo} value={codigo}>{nombre}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="cuenta-dato"><strong>Nombre:</strong> <span>{usuario.nombrecuenta}</span></div>
            <div className="cuenta-dato"><strong>CC:</strong> <span>{usuario.identificacion}</span></div>
            <div className="cuenta-dato"><strong>Correo:</strong> <span>{usuario.correo}</span></div>
            <div className="cuenta-dato"><strong>Teléfono:</strong> <span>{usuario.telefono || "No registrado"}</span></div>
            <div className="cuenta-dato"><strong>Dirección:</strong> <span>{usuario.direccion || "No registrada"}</span></div>
            <div className="cuenta-dato"><strong>País:</strong> <span>{paises[usuario.pais] || usuario.pais}</span></div>
          </>
        )}
      </div>

      <div className="botones-accion">
        {modoEdicion ? (
          <>
            <button className="btn-metodo-pago" onClick={guardarCambios} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
            <button className="btn-cerrar-sesion" onClick={() => setModoEdicion(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn-metodo-pago" onClick={() => setModoEdicion(true)}>Editar perfil</button>
            <button className="btn-metodo-pago" onClick={() => navigate("/Tarjeta")}>Agregar método de pago</button>
            <button className="btn-metodo-pago" onClick={() => navigate("/metodos")}>Mis métodos</button>
            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
              <FiLogOut style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
