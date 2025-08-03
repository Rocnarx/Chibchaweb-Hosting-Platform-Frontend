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

      if (!res.ok) throw new Error("Error al obtener dominios");

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
      console.error("❌ Error al cargar dominios:", err.message || err);
      setError("❌ Error al cargar dominios");
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
                {dom.diasRestantes > 0
                  ? `Vence en: ${dom.diasRestantes} día(s)`
                  : "Dominio vencido"}
              </span>
            </div>
          ))}
        </div>
      )}

      {dominioSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2 style={{ fontSize: '26px', marginBottom: '16px', color: '#333' }}>
              Transferir dominio
            </h2>

            <div
              style={{
                backgroundColor: '#fdf3ec',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '20px',
                border: '1px solid #e2c8b0',
                wordBreak: 'break-all',
              }}
            >
              {dominioSeleccionado}
            </div>

            <div style={{ textAlign: 'left', width: '100%' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#555',
                }}
              >
                Transferir a:
              </label>

              <div style={{ position: 'relative' }}>
                <i
                  className="fa-solid fa-envelope"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888',
                  }}
                ></i>
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
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 38px',
                    border: errorTransferencia ? '1px solid #e57373' : '1px solid #ccc',
                    borderRadius: '10px',
                    fontSize: '16px',
                  }}
                />
              </div>

              {errorTransferencia && (
                <div
                  style={{
                    marginTop: '8px',
                    color: '#b94a48',
                    backgroundColor: '#fcebea',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errorTransferencia}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={manejarTransferencia}
                disabled={!!errorTransferencia || !correoDestino}
                style={{
                  backgroundColor: !!errorTransferencia || !correoDestino ? '#ccc' : '#cba27e',
                  cursor: !!errorTransferencia || !correoDestino ? 'not-allowed' : 'pointer',
                  padding: '10px 18px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fa-solid fa-paper-plane"></i>
                Transferir
              </button>

              <button
                onClick={() => {
                  setDominioSeleccionado(null);
                  setCorreoDestino("");
                  setErrorTransferencia("");
                }}
                style={{
                  backgroundColor: '#eee',
                  color: '#333',
                  padding: '10px 18px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
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
