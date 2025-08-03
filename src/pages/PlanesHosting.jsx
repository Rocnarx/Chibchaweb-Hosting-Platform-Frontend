import './PlanesHosting.css';
import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faDatabase,
  faHdd,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

function PlanesHosting() {
  const { usuario } = useUser();
  const [todosLosPlanes, setTodosLosPlanes] = useState([]);
  const [planesFiltrados, setPlanesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [animando, setAnimando] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(30); // mensual

  const cargarPlanes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Paquetes`, {
        headers: {
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        }
      });

      if (!res.ok) throw new Error("Error al obtener paquetes");

      const datos = await res.json();

      const planesTransformados = datos.map((p) => ({
        id: p.idpaquetehosting,
        precio: p.preciopaquete,
        periodicidad: Number(p.periodicidad),
        nombre: p.info?.nombrepaquetehosting || "Sin nombre",
        sitios: p.info?.cantidadsitios || 0,
        bases: p.info?.bd || 0,
        ssd: `${p.info?.gbenssd || 0}GB`,
        correos: p.info?.correos || 0,
        ssl: p.info?.certificadosslhttps || 0,
      }));

      setTodosLosPlanes(planesTransformados);
      filtrarPlanes(planesTransformados, 30); // por defecto mensual
    } catch (error) {
      console.error("❌ Error cargando paquetes:", error);
    } finally {
      setCargando(false);
    }
  };

  const filtrarPlanes = (planes, periodicidad) => {
    setAnimando(true);
    setTimeout(() => {
      const filtrados = planes.filter((plan) => plan.periodicidad === periodicidad);
      setPlanesFiltrados(filtrados);
      setPeriodoSeleccionado(periodicidad);
      setAnimando(false);
    }, 200);
  };

  const adquirirPaquete = async (idpaquetehosting) => {
    if (!usuario || !usuario.idcuenta) {
      alert("Debes iniciar sesión para adquirir un plan.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ComprarPaquete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          idcuenta: usuario.idcuenta,
          idpaquetehosting: idpaquetehosting,
          estado: 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.mensaje || "Error al adquirir el paquete");
      }

      alert(`✅ ${data.mensaje || "Paquete adquirido exitosamente."}`);
    } catch (err) {
      console.error("❌ Error al adquirir paquete:", err);
      alert("❌ No se pudo completar la compra del paquete.");
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  return (
    <main className="planes-hosting">
      <h1>Planes de Hosting</h1>

      <div className="planes-toggle">
        <button
          className={periodoSeleccionado === 30 ? 'activo' : ''}
          onClick={() => filtrarPlanes(todosLosPlanes, 30)}
        >
          Mensual
        </button>
        <button
          className={periodoSeleccionado === 180 ? 'activo' : ''}
          onClick={() => filtrarPlanes(todosLosPlanes, 180)}
        >
          Semestral
        </button>
        <button
          className={periodoSeleccionado === 365 ? 'activo' : ''}
          onClick={() => filtrarPlanes(todosLosPlanes, 365)}
        >
          Anual
        </button>
      </div>

      {cargando ? (
        <p>Cargando planes...</p>
      ) : planesFiltrados.length === 0 ? (
        <p>No hay planes disponibles para esta periodicidad.</p>
      ) : (
        <div className={`planes-listado ${animando ? 'oculto' : ''}`}>
          {planesFiltrados.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h2><span className="nombre-plan">{plan.nombre}</span></h2>
              <p className="precio">${plan.precio.toLocaleString()} COP</p>
              <ul>
                <li><FontAwesomeIcon icon={faServer} /> Sitios: {plan.sitios}</li>
                <li><FontAwesomeIcon icon={faDatabase} /> Bases de datos: {plan.bases}</li>
                <li><FontAwesomeIcon icon={faHdd} /> SSD: {plan.ssd}</li>
                <li><FontAwesomeIcon icon={faEnvelope} /> Correos: {plan.correos}</li>
                <li><FontAwesomeIcon icon={faLock} /> Certificados SSL: {plan.ssl}</li>
              </ul>
              <button
                className="btn-adquirir"
                onClick={() => adquirirPaquete(plan.id)}
              >
                Adquirir
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default PlanesHosting;
