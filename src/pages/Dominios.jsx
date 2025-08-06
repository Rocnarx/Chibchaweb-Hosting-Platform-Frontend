import { useEffect, useState } from 'react';
import './Dominios.css';
import Loader from "../Components/Loader";
import { useLocation } from 'react-router-dom';
import { useUser } from "../Context/UserContext";
import { usePreciosExtensiones } from "../Context/ExtensionContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';
  const tipoInicial = queryParams.get('tipo') || 'normal';
  const { usuario } = useUser();

  const [input, setInput] = useState(dominioInicial);
  const [dominio, setDominio] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState(tipoInicial);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [principalDisponible, setPrincipalDisponible] = useState(false);
  const [mostrarPrincipal, setMostrarPrincipal] = useState(true);
  const [error, setError] = useState('');
  const [dominiosAgregados, setDominiosAgregados] = useState(new Set());

  const { precios } = usePreciosExtensiones();
  const EXTENSIONS = Object.keys(precios);

  useEffect(() => {
    if (dominioInicial) {
      setInput(dominioInicial);
      manejarBusqueda(dominioInicial, tipoInicial);
    }
  }, []);

  const obtenerDominiosEnCarrito = async () => {
    if (!usuario || !usuario.idcuenta) return new Set();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/carrito/dominios?idcuenta=${usuario.idcuenta}`, {
        headers: { 'Chibcha-api-key': import.meta.env.VITE_API_KEY },
      });
      if (!res.ok) return new Set();
      const datos = await res.json();
      return new Set(datos.map(d => d.dominio));
    } catch {
      return new Set();
    }
  };

  const manejarBusqueda = async (valorManual = null, tipo = 'normal') => {
    let nombre = (valorManual ?? input).trim().toLowerCase();
    if (nombre.endsWith('.')) nombre = nombre.slice(0, -1);

    if (!nombre) {
      setError('Por favor, escribe un nombre de dominio antes de buscar.');
      setBuscando(false);
      setBuscado(false);
      return;
    }

    setError('');
    setBuscando(true);
    setBuscado(false);
    setResultados([]);
    setPrincipalDisponible(false);
    setMostrarPrincipal(true);
    setDominiosAgregados(new Set());

    const dominiosEnCarrito = await obtenerDominiosEnCarrito();

    try {
      if (tipo === 'ia') {
        const resIA = await fetch(`${import.meta.env.VITE_API_URL}/generar-dominiosIA`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ descripcion: nombre })
        });

        if (!resIA.ok) {
          const errorData = await resIA.json();
          setError(errorData?.detail || 'Ocurrió un error al generar dominios.');
          setBuscando(false);
          return;
        }

        const dataIA = await resIA.json();

        // ❌ Filtrar cualquier elemento que no parezca un dominio válido .com
        const dominiosFiltrados = (dataIA.dominios_generados || []).filter(dom =>
          typeof dom === 'string' && dom.includes('.') && /^[a-zA-Z0-9\-]+\.[a-z]{2,}$/.test(dom)
        );

        // 🟤 Remueve duplicados y cosas como el mensaje introductorio de la IA
        const únicos = Array.from(new Set(dominiosFiltrados));

        // 🔸 Obtener dominios no repetidos y no presentes en el carrito
        const disponibles = únicos.filter(dom => !dominiosEnCarrito.has(dom));

        const conPrecios = disponibles.map((dom) => ({
          id: dom,
          nombre: dom,
          precio: precios[dom.split('.').pop()] ?? 10000,
        }));

        if (conPrecios.length > 0) {
          setDominio(conPrecios[0].nombre);
          setPrincipalDisponible(true);
          setMostrarPrincipal(true);
          setResultados(conPrecios.slice(1));
          setDominiosAgregados(new Set());
        } else {
          const dominioConExtension = nombre.includes('.') ? nombre : `${nombre}.com`;
          setDominio(dominioConExtension);
          setPrincipalDisponible(false);
          setMostrarPrincipal(false);
          setResultados([]);
        }

      } else {
        const tieneExtension = nombre.includes('.') && EXTENSIONS.some(ext => nombre.endsWith(`.${ext}`));
        if (nombre.includes('.') && !tieneExtension) {
          setError('La extensión del dominio no es válida.');
          setBuscando(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/DominiosDisponible`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            domain: nombre.includes('.') ? nombre.split('.')[0] : nombre
          })
        });

        const data = await response.json();

        const dominioPrincipal = tieneExtension ? nombre : `${nombre}.com`;
        const estadoPrincipal = data.alternativas.find(d => d.domain === dominioPrincipal);
        const estaDisponible = estadoPrincipal && estadoPrincipal.registered === false;

        setPrincipalDisponible(estaDisponible);
        setMostrarPrincipal(!dominiosEnCarrito.has(dominioPrincipal));

        const disponibles = data.alternativas.filter((d) =>
          d.registered === false &&
          !dominiosEnCarrito.has(d.domain)
        );

        const conPrecios = disponibles.map((dom) => ({
          id: dom.domain,
          nombre: dom.domain,
          precio: precios[dom.domain.split('.').pop()] ?? 10000,
        }));

        const dominioConExtension = nombre.includes('.') ? nombre : `${nombre}.com`;
        setDominio(dominioConExtension);
        setResultados(conPrecios);
      }
    } catch (error) {
      console.error("Error al consultar dominios:", error);
      setError('Ocurrió un error al consultar los dominios.');
    } finally {
      setBuscando(false);
      setBuscado(true);
    }
  };

  const agregarAlCarrito = async (dom) => {
    if (!usuario || !usuario.identificacion || !usuario.idcuenta) {
      alert("Debes iniciar sesión para agregar dominios al carrito.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/agregarDominio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          iddominio: dom.id,
          nombrepagina: dom.nombre,
          preciodominio: dom.precio,
          ocupado: false,
          identificacion: usuario.identificacion 
        })
      });

      if (!response.ok) throw new Error("Error al agregar dominio");

      await fetch(`${import.meta.env.VITE_API_URL}/dominios/agregar-a-carrito-existente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          iddominio: dom.id,
          idcuenta: usuario.idcuenta,
        })
      });

      setDominiosAgregados(prev => new Set(prev).add(dom.id));
      alert(`✅ Dominio ${dom.nombre} agregado al carrito.`);
    } catch (err) {
      alert("No se pudo agregar el dominio.");
    }
  };

  return (
    <main className={`dominios ${tipoBusqueda === 'ia' ? 'modo-ia' : ''}`}>
      {/* Filtro de búsqueda */}
      <div className="hero-toggle">
        <button
          className={tipoBusqueda === 'normal' ? 'activo' : ''}
          onClick={() => setTipoBusqueda('normal')}
        >
          Dominio normal
        </button>
        <button
          className={tipoBusqueda === 'ia' ? 'activo' : ''}
          onClick={() => setTipoBusqueda('ia')}
        >
          Dominio con IA
        </button>
      </div>

      {/* Buscador */}
    <div className="buscador-contenedor">
      <div className="buscador">
        <input
          type="text"
          placeholder={tipoBusqueda === 'ia' ? "Describe tu idea de negocio" : "chibchaweb"}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="boton-adquirir" onClick={() => manejarBusqueda(null, tipoBusqueda)}>
          Buscar Dominio
        </button>
      </div>
    </div>

      {buscando && <Loader mensaje="Consultando dominios disponibles" />}

      {error && <div className="alerta-error">{error}</div>}

      {buscado && !buscando && !error && (
        <>
          {mostrarPrincipal && (
            <div className="resultado">
              <div className="bloque resultado-dominio">
                <div className="info-dominio">
                  <strong>{dominio}</strong>
                  <div className="precio-dominio">
                    ${(
                      precios[dominio.split('.').pop()] ?? 10000
                    ).toLocaleString()} USD
                  </div>
                  <p>
                    {principalDisponible
                      ? 'Este dominio está disponible'
                      : 'Este dominio no está disponible'}
                  </p>
                </div>
                <button
                  className={principalDisponible ? 'btn-agregar' : 'boton-deshabilitado'}
                  disabled={
                    !principalDisponible || dominiosAgregados.has(dominio)
                  }
                  onClick={() =>
                    agregarAlCarrito({
                      id: dominio,
                      nombre: dominio,
                      precio: precios[dominio.split('.').pop()] ?? 10000,
                    })
                  }
                >
                  {dominiosAgregados.has(dominio)
                    ? "Agregado"
                    : "Agregar al carrito"}
                </button>
              </div>

              <div className="bloque hosting">
                <strong>¿Ya cuenta con servicio de Hosting para su sitio web?</strong>
                <p>ChibchaWeb ofrece este servicio a precios justos</p>
                <button className="btn-agregar" onClick={() => window.location.href = "/planesHosting"}>
                  Adquirir Hosting
                </button>
              </div>
            </div>
          )}

          <h3>Alternativas</h3>
          <div className="alternativas">
            {resultados.length === 0 ? (
              <div className="sin-resultados">
                No encontramos dominios disponibles en este momento.<br />
                Prueba con otro nombre o modifica tu búsqueda.
              </div>
            ) : (
              resultados.map((r, i) => (
                <div key={i} className="alternativa">
                  <span>{r.nombre}</span>
                  <div className="precio-y-boton">
                    <span className="precio">${r.precio.toLocaleString()} USD</span>
                    <button
                      className="boton-adquirir"
                      onClick={() => agregarAlCarrito(r)}
                      disabled={dominiosAgregados.has(r.id)}
                    >
                      {dominiosAgregados.has(r.id) ? "Agregado" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );

}

export default Dominios;
