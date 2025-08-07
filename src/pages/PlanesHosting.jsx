import './PlanesHosting.css';
import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";

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
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(30);
  const [animando, setAnimando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [comprando, setComprando] = useState(null);
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [verificandoRedireccion, setVerificandoRedireccion] = useState(true);
  const [redirigiendo, setRedirigiendo] = useState(false);
  const [esperandoRedireccion, setEsperandoRedireccion] = useState(true);
  

  const navigate = useNavigate();
  useEffect(() => {
  const iniciar = async () => {
    const planes = await cargarPlanes();
    setTodosLosPlanes(planes);
    filtrarPlanes(planes, 30);
    setCargando(false);
  };

  iniciar();
}, []);


  const cargarPlanes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Paquetes`, {
        headers: {
          'Chibcha-api-key': import.meta.env.VITE_API_KEY,
        },
      });

      const datos = await res.json();

      const planes = datos.map((p) => ({
        id: p.idpaquetehosting,
        precio: p.preciopaquete,
        periodicidad: Number(p.periodicidad.match(/\d+/)?.[0] || 30),
        nombre: p.info?.nombrepaquetehosting || "Sin nombre",
        sitios: p.info?.cantidadsitios || 0,
        bases: p.info?.bd || 0,
        ssd: `${p.info?.gbenssd || 0}GB`,
        correos: p.info?.correos || 0,
        ssl: p.info?.certificadosslhttps || 0,
      }));

      return planes;
    } catch (err) {
      console.error("❌ Error al obtener paquetes:", err);
      return [];
    }
  };

  const cargarMiPaquete = async () => {
    if (!usuario?.idcuenta) return null;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/MiPaquete?idcuenta=${usuario.idcuenta}`, {
        headers: {
          'Chibcha-api-key': import.meta.env.VITE_API_KEY,
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      setPaqueteActual(data);

      // 🟠 Si el usuario ya tiene un plan activo, redirigir con animación
      const vigente = data?.idfacturapaquete &&
                      Number(data.estado) === 1 &&
                      new Date(data.fchvencimiento) >= new Date();

      if (vigente) {
        setRedirigiendo(true);
        setTimeout(() => {
          navigate("/paquete-adquirido");
        }, 1000); // espera 1 segundo para mostrar la animación
        return null; // detenemos aquí
      }

      const periodicidad = parseInt(data.periodicidad.match(/\d+/)?.[0] || "30");
      setEsperandoRedireccion(false); // ← al final de la función, siempre
      return periodicidad;
    } catch (err) {
      console.error("❌ Error al obtener MiPaquete:", err);
      return null;
    }
  };

  const filtrarPlanes = (planes, periodicidad) => {
    setAnimando(true);
    setTimeout(() => {
      const filtrados = planes.filter((p) => p.periodicidad === periodicidad);
      setPlanesFiltrados(filtrados);
      setPeriodoSeleccionado(periodicidad);
      setAnimando(false);
    }, 200);
  };

const verificarMetodoPago = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/metodosPagoUsuario?identificacion=${usuario.identificacion}`, {
      headers: {
        'Chibcha-api-key': import.meta.env.VITE_API_KEY,
      },
    });

    if (!res.ok) {
      console.error("Error al obtener métodos de pago:", res.status);
      return false;
    }

    const data = await res.json();
    return Array.isArray(data.metodos_pago) && data.metodos_pago.length > 0;
  } catch (error) {
    console.error("❌ Error al verificar métodos de pago:", error);
    return false;
  }
};

  const adquirirPaquete = async (idpaquetehosting) => {
    if (!usuario || !usuario.idcuenta || !usuario.identificacion) {
      alert(" ❌ Debes iniciar sesión para adquirir un plan.");
      return;
    }

    const tieneMetodoPago = await verificarMetodoPago();
    if (!tieneMetodoPago) {
      alert("Debes agregar un método de pago antes de poder adquirir un plan.");
      return;
    }

    setComprando(idpaquetehosting);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ComprarPaquete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          idcuenta: usuario.idcuenta,
          idpaquetehosting,
          estado: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.mensaje || 'Error al adquirir el paquete');

      alert(`✅ ${data.mensaje || "Paquete adquirido exitosamente."}`);
      const nuevaPeriodicidad = await cargarMiPaquete();
      filtrarPlanes(todosLosPlanes, nuevaPeriodicidad || 30);
    } catch (err) {
      console.error("❌ Error al adquirir paquete:", err);
      alert("❌ No se pudo completar la compra del paquete.");
    } finally {
      setComprando(null);
    }
  };



useEffect(() => {
  if (!usuario || !usuario.idcuenta) {
    setVerificandoRedireccion(false); // necesario para desbloquear vista
    return;
  }

  const verificarRedireccion = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/MiPaquete?idcuenta=${usuario.idcuenta}`, {
        headers: { "Chibcha-api-key": import.meta.env.VITE_API_KEY },
      });

      if (!res.ok) throw new Error("Sin paquete");

      const data = await res.json();
      const vigente =
        data?.idfacturapaquete &&
        Number(data.estado) === 1 &&
        new Date(data.fchvencimiento) >= new Date();

      if (vigente) {
        setRedirigiendo(true);
        setTimeout(() => navigate("/paquete-adquirido", { replace: true }), 100);
        return;
      }
    } catch (err) {
      console.warn("No se redirige automáticamente:", err);
    } finally {
      setVerificandoRedireccion(false);
    }
  };

  verificarRedireccion();
}, [usuario]);

if (redirigiendo) {
  return (
    <div className="pantalla-cargando">
      <div className="loader" />
      <p>Redirigiendo a tu paquete adquirido...</p>
    </div>
  );
}

if (verificandoRedireccion) return null;




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
          {planesFiltrados.map((plan) => {
            const mismoPlan = plan.id === paqueteActual?.idpaquetehosting;

            const fechaVencimiento = paqueteActual?.fchvencimiento
              ? new Date(paqueteActual.fchvencimiento)
              : null;

            const hoy = new Date();
            const planVigente = fechaVencimiento && hoy <= fechaVencimiento;
            const tienePlanActivo = paqueteActual?.idfacturapaquete && planVigente && Number(paqueteActual?.estado) === 1;

            const desactivado = Boolean(
              tienePlanActivo &&
              paqueteActual?.idpaquetehosting !== plan.id
            );

            return (
              <div
                key={plan.id}
                className={`plan-card ${desactivado ? 'desactivado' : ''} ${mismoPlan && tienePlanActivo ? 'activo' : ''}`}
              >
                <h2><span className="nombre-plan">{plan.nombre}</span></h2>

                {mismoPlan && tienePlanActivo && fechaVencimiento && (
                  <p className="plan-activo">
                    Suscrito hasta el {fechaVencimiento.toLocaleDateString()}
                  </p>
                )}

                <p className="precio">${plan.precio.toLocaleString()} USD</p>
                <ul>
                  <li><FontAwesomeIcon icon={faServer} /> Sitios: {plan.sitios}</li>
                  <li><FontAwesomeIcon icon={faDatabase} /> Bases de datos: {plan.bases}</li>
                  <li><FontAwesomeIcon icon={faHdd} /> SSD: {plan.ssd}</li>
                  <li><FontAwesomeIcon icon={faEnvelope} /> Correos: {plan.correos}</li>
                  <li><FontAwesomeIcon icon={faLock} /> Certificados SSL: {plan.ssl}</li>
                </ul>

              {mismoPlan && tienePlanActivo ? (
                <button
                  className="btn-adquirido"
                  onClick={() => navigate("/paquete-adquirido")}
                >
                  Ver paquete
                </button>
              ) : (
                <button
                  className="btn-adquirir"
                  disabled={desactivado || comprando === plan.id}
                  onClick={() => adquirirPaquete(plan.id)}
                >
                  {comprando === plan.id ? "Procesando..." : "Adquirir"}
                </button>
              )}

              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default PlanesHosting;
