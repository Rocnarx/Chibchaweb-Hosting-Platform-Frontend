import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import './DominiosAdquiridos.css';

function DominiosAdquiridos() {
  const { usuario } = useUser();
  const [dominios, setDominios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDominios = async () => {
      if (!usuario?.idcuenta) return;

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

    cargarDominios();
  }, [usuario]);

  return (
    <main className="mis-dominios">
      <h1>
        Mis Dominios <span className="cantidad-items">{dominios.length} items</span>
      </h1>
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
            <div key={index} className="dominio-item">
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
    </main>
  );
}

export default DominiosAdquiridos;
