import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Cuenta.css";
import "./CuentaDistribuidor.css"; // ✅ nuevos estilos separados
import { FiLogOut } from "react-icons/fi";

export default function Cuenta() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});

  // ✅ estado para sección distribuidor
  const [infoDistribuidor, setInfoDistribuidor] = useState(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState("");

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
      IDTIPOCUENTA:
        typeof usuario.tipocuenta === "number" ? usuario.tipocuenta : 1,
      IDPLAN:
        typeof usuario.plan === "number"
          ? usuario.plan
          : usuario.plan === "Sin plan"
          ? 0
          : 1,
      NOMBRECUENTA: usuario.nombrecuenta,
      CORREO: usuario.correo,
      TELEFONO: usuario.telefono || "",
      FECHAREGISTRO: usuario.fecharegistro,
      DIRECCION: usuario.direccion || "",
      IDPAIS: obtenerCodigoDePais(usuario.pais),
    };
    setFormData(datosIniciales);

    // ✅ Cargar datos de ahorro para DISTRIBUIDOR
    if (usuario.tipocuenta?.toUpperCase() === "DISTRIBUIDOR") {
      const load = async () => {
        try {
          setDistLoading(true);
          setDistError("");
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/ahorro-distribuidor?idcuenta=${usuario.idcuenta}`,
            {
              headers: {
                "Chibcha-api-key": import.meta.env.VITE_API_KEY,
              },
            }
          );
          if (!res.ok) throw new Error("No se pudo obtener la información.");
          const data = await res.json();
          setInfoDistribuidor(data);
        } catch (e) {
          setDistError(e.message || "Error desconocido");
        } finally {
          setDistLoading(false);
        }
      };
      load();
    } else {
      setInfoDistribuidor(null);
      setDistError("");
      setDistLoading(false);
    }
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
      [name]:
        name === "IDPAIS" || name === "IDPLAN" || name === "TELEFONO"
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
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${formData.IDCUENTA}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(formData),
        }
      );

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

  // ⚠️ Roles que NO pueden ver métodos de pago
  const tiposRestringidos = [
    "COORDINADOR NIVEL 1",
    "COORDINADOR NIVEL 2",
    "COORDINADOR NIVEL 3",
    "TECNICO NIVEL 1",
    "TECNICO NIVEL 2",
    "TECNICO NIVEL 3",
    "ADMIN",
  ];

  const puedeVerMetodosPago = !tiposRestringidos.includes(
    usuario.tipocuenta?.toUpperCase?.()
  );

  return (
    <div className="cuenta-container">
      <h2>Mi Perfil</h2>

      <div className="cuenta-info">
        {modoEdicion ? (
          <>
            <div className="cuenta-dato">
              <strong>Nombre:</strong>
              <input
                name="NOMBRECUENTA"
                value={formData.NOMBRECUENTA}
                onChange={handleInputChange}
              />
            </div>

            <div className="cuenta-dato">
              <strong>Correo:</strong>
              <input
                name="CORREO"
                value={formData.CORREO}
                onChange={handleInputChange}
              />
            </div>

            <div className="cuenta-dato">
              <strong>Teléfono:</strong>
              <input
                name="TELEFONO"
                value={formData.TELEFONO}
                onChange={handleInputChange}
              />
            </div>

            <div className="cuenta-dato">
              <strong>Dirección:</strong>
              <input
                name="DIRECCION"
                value={formData.DIRECCION}
                onChange={handleInputChange}
              />
            </div>

            <div className="cuenta-dato">
              <strong>País:</strong>
              <select name="IDPAIS" value={formData.IDPAIS} onChange={handleInputChange}>
                {Object.entries(paises).map(([codigo, nombre]) => (
                  <option key={codigo} value={codigo}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="cuenta-dato">
              <strong>Nombre:</strong> <span>{usuario.nombrecuenta}</span>
            </div>
            <div className="cuenta-dato">
              <strong>CC:</strong> <span>{usuario.identificacion}</span>
            </div>
            <div className="cuenta-dato">
              <strong>Correo:</strong> <span>{usuario.correo}</span>
            </div>
            <div className="cuenta-dato">
              <strong>Teléfono:</strong>{" "}
              <span>{usuario.telefono || "No registrado"}</span>
            </div>
            <div className="cuenta-dato">
              <strong>Dirección:</strong>{" "}
              <span>{usuario.direccion || "No registrada"}</span>
            </div>
            <div className="cuenta-dato">
              <strong>País:</strong>{" "}
              <span>{paises[usuario.pais] || usuario.pais}</span>
            </div>
          </>
        )}
      </div>

      {/* ===================== SECCIÓN DISTRIBUIDOR ===================== */}
      {usuario.tipocuenta?.toUpperCase() === "DISTRIBUIDOR" && (
        <section className="distribuidor-card">
          <div className="distribuidor-header">
            <h3>Descuentos aplicados</h3>
            {infoDistribuidor?.distribuidor?.plan && (
              <span className="badge">{infoDistribuidor.distribuidor.plan}</span>
            )}
          </div>

          {distLoading && (
            <div className="distribuidor-loading">Cargando información…</div>
          )}

          {distError && (
            <div className="distribuidor-error">
              No se pudo cargar la información: {distError}
            </div>
          )}

          {!distLoading && !distError && infoDistribuidor && (
            <>
              <div className="distribuidor-grid">
                <div className="grid-item">
                  <span className="label">Comisión</span>
                  <span className="value">
                    {infoDistribuidor.distribuidor.comision}%
                  </span>
                </div>
                <div className="grid-item">
                  <span className="label">Nombre</span>
                  <span className="value">{infoDistribuidor.distribuidor.nombre}</span>
                </div>

              </div>

              <div className="distribuidor-stats">
                <div className="stat">
                  <div className="stat-title">Total dominios</div>
                  <div className="stat-value">
                    {infoDistribuidor.total_dominios_comprados}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Total ahorrado</div>
                  <div className="stat-value currency">
                    $
                    {Number(infoDistribuidor.total_ahorrado || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="distribuidor-table-wrapper">
                <table className="distribuidor-table">
                  <thead>
                    <tr>
                      <th>Dominio</th>
                      <th>Precio original</th>
                      <th>Ahorro por comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoDistribuidor.dominios?.map((d, idx) => (
                      <tr key={idx}>
                        <td>{d.nombre_dominio}</td>
                        <td>${Number(d.precio_original).toLocaleString()}</td>
                        <td className="positivo">
                          ${Number(d.ahorro_por_comision).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {(!infoDistribuidor.dominios ||
                      infoDistribuidor.dominios.length === 0) && (
                      <tr>
                        <td colSpan="3" className="empty">
                          Aún no hay dominios registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
      {/* =============================================================== */}

      <div className="botones-accion">
        {modoEdicion ? (
          <>
            <button
              className="btn-metodo-pago"
              onClick={guardarCambios}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              className="btn-cerrar-sesion"
              onClick={() => setModoEdicion(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className="btn-metodo-pago" onClick={() => setModoEdicion(true)}>
              Editar perfil
            </button>

            {puedeVerMetodosPago && (
              <>
                <button className="btn-metodo-pago" onClick={() => navigate("/Tarjeta")}>
                  Agregar método de pago
                </button>
                <button className="btn-metodo-pago" onClick={() => navigate("/metodos")}>
                  Mis métodos
                </button>
              </>
            )}

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
