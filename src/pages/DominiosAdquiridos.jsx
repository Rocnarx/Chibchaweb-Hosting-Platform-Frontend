import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import './DominiosAdquiridos.css';

function DominiosAdquiridos() {
  const { usuario } = useUser();
  const [dominios, setDominios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [dominioSeleccionado, setDominioSeleccionado] = useState(null);
  const [correoDestino, setCorreoDestino] = useState("");
  const [errorTransferencia, setErrorTransferencia] = useState("");

  const cargarDominios = async () => {
    if (!usuario?.idcuenta) return;
    setCargando(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dominios/vigencia?idcuenta=${encodeURIComponent(String(usuario.idcuenta))}`,
        {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (res.status === 404) {
        const texto = await res.text();
        const json = JSON.parse(texto);
        if (json?.detail?.includes("No se encontraron dominios")) {
          setDominios([]);
          setError("");
          return;
        } else {
          throw new Error(`(404) ${texto}`);
        }
      }
      if (!res.ok) {
        const texto = await res.text();
        throw new Error(`(${res.status}) ${texto}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setDominios(
          data.map((d) => ({
            nombre: d.nombre_dominio,
            diasRestantes: d.dias_restantes,
          }))
        );
      } else {
        setDominios([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar dominios:", err);
      if (err instanceof Error) {
        setError("❌ Error al cargar dominios: " + err.message);
      } else {
        setError("❌ Error al cargar dominios");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDominios();
  }, [usuario]);

  const manejarTransferencia = async () => {
    if (!correoDestino || errorTransferencia) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/TransferenciaDominio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          iddominio: dominioSeleccionado,
          idcuenta_origen: usuario.idcuenta,
          correo_destino: correoDestino,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.detail === "Cuenta de destino no encontrada") {
          setErrorTransferencia("El correo no está asociado a ninguna cuenta.");
        } else {
          setErrorTransferencia("Ocurrió un error al transferir el dominio.");
        }
        return;
      }
      alert(`✅ Dominio "${dominioSeleccionado}" transferido a ${correoDestino}`);
      setCorreoDestino("");
      setDominioSeleccionado(null);
      setErrorTransferencia("");
      cargarDominios();
    } catch (error) {
      console.error("❌ Error al transferir:", error);
      setErrorTransferencia("Error inesperado al transferir el dominio.");
    }
  };

  return (
    <main className="mis-dominios">
      <div className="cabecera-dominios">
        <h1 className="titulo-dominios">
          <i className="fa-solid fa-globe icono"></i>
          Mis Dominios
          <span className="badge-items">{dominios.length}</span>
        </h1>
        <p className="subtexto-dominios">Seleccione un dominio si desea transferirlo</p>
      </div>

      <div className="linea-separadora" />

      {cargando ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : dominios.length === 0 ? (
        <p>No tienes dominios registrados.</p>
      ) : (
        <div className="lista-dominios">
          {dominios.map((dom, index) => (
            <div
              key={index}
              className="dominio-item"
              onClick={() => {
                setDominioSeleccionado(dom.nombre);
                setCorreoDestino("");
                setErrorTransferencia("");
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="nombre">{dom.nombre}</span>
              <span className="vence">
                {dom.diasRestantes > 0 ? `Vence en: ${dom.diasRestantes} día(s)` : "Dominio vencido"}
              </span>
            </div>
          ))}
        </div>
      )}

      {dominioSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2>Transferir dominio</h2>
            <div className="dominio-transferencia">{dominioSeleccionado}</div>
            <div className="grupo-input">
              <label>Transferir a:</label>
              <div className="input-con-icono">
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correoDestino}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setCorreoDestino(valor);
                    if (!valor) {
                      setErrorTransferencia("Ingresa un correo electrónico.");
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                      setErrorTransferencia("Revisa que el correo esté bien escrito.");
                    } else {
                      setErrorTransferencia("");
                    }
                  }}
                  className={errorTransferencia ? "input-error" : ""}
                />
              </div>
              {errorTransferencia && (
                <div className="error-box">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errorTransferencia}</span>
                </div>
              )}
            </div>
            <div className="grupo-botones">
              <button
                onClick={manejarTransferencia}
                disabled={!!errorTransferencia || !correoDestino}
              >
                <i className="fa-solid fa-paper-plane"></i>
                Transferir
              </button>
              <button
                className="cancelar"
                onClick={() => {
                  setDominioSeleccionado(null);
                  setCorreoDestino("");
                  setErrorTransferencia("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DominiosAdquiridos;
