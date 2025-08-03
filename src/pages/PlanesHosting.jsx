import './PlanesHosting.css';
import { useEffect, useState } from 'react';

function PlanesHosting() {
  const [todosLosPlanes, setTodosLosPlanes] = useState([]);
  const [planesFiltrados, setPlanesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(30); // 30 = mensual por defecto

const cargarPlanes = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/Paquetes`, {
      headers: {
        'Chibcha-api-key': import.meta.env.VITE_API_KEY
      }
    });

    if (!res.ok) throw new Error("Error al obtener paquetes");

    const datos = await res.json();

    console.log("📦 Paquetes recibidos desde el backend:", datos); // 👈 Aquí está el log

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
    filtrarPlanes(planesTransformados, 30);
  } catch (error) {
    console.error("❌ Error cargando paquetes:", error);
  } finally {
    setCargando(false);
  }
};


  const filtrarPlanes = (planes, periodicidad) => {
    const filtrados = planes.filter((plan) => plan.periodicidad === periodicidad);
    setPlanesFiltrados(filtrados);
    setPeriodoSeleccionado(periodicidad);
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
        <div className="planes-listado">
          {planesFiltrados.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h2>{plan.nombre}</h2>
              <p className="precio">${plan.precio.toLocaleString()} COP</p>
              <ul>
                <li>Cantidad de sitios: {plan.sitios}</li>
                <li>Bases de datos: {plan.bases}</li>
                <li>SSD: {plan.ssd}</li>
                <li>Correos: {plan.correos}</li>
                <li>Certificados SSL HTTPS: {plan.ssl}</li>
              </ul>
              <button className="btn-adquirir">Adquirir</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default PlanesHosting;
