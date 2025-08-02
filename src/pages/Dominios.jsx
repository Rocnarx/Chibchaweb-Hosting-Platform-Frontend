import { useEffect, useState } from 'react';
import './Dominios.css';
import Loader from "../Components/Loader";
import { useLocation } from 'react-router-dom';
import { useUser } from "../Context/UserContext";
import { usePreciosExtensiones } from "../Context/ExtensionContext";

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';
  const { usuario } = useUser();

  const [input, setInput] = useState(dominioInicial);
  const [dominio, setDominio] = useState('');
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
      manejarBusqueda(dominioInicial);
    }
  }, []);

  const obtenerDominiosEnCarrito = async () => {
    if (!usuario || !usuario.idcuenta) return new Set();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/carrito/dominios?idcuenta=${usuario.idcuenta}`,
        {
          headers: {
            'Chibcha-api-key': import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (!res.ok) return new Set();

      const datos = await res.json();
      if (!Array.isArray(datos)) return new Set();

      const dominios = datos.map(d => d.dominio);
      return new Set(dominios);
    } catch (err) {
      console.error("Error al obtener dominios del carrito:", err);
      return new Set();
    }
  };

  const manejarBusqueda = async (valorManual = null) => {
    let nombre = (valorManual ?? input).trim().toLowerCase();

    if (nombre.endsWith('.')) {
      nombre = nombre.slice(0, -1);
    }

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

    const tieneExtension = nombre.includes('.') && EXTENSIONS.some(ext => nombre.endsWith(`.${ext}`));

    if (nombre.includes('.') && !tieneExtension) {
      setError('La extensión del dominio no es válida.');
      setBuscando(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/DominiosDisponible`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            domain: nombre.includes('.') ? nombre.split('.')[0] : nombre
          })
        }
      );

      const data = await response.json();

      const dominioPrincipal = tieneExtension ? nombre : `${nombre}.com`;
      const estadoPrincipal = data.alternativas.find(d => d.domain === dominioPrincipal);
      const estaDisponible = estadoPrincipal && estadoPrincipal.registered === false;

      setPrincipalDisponible(estaDisponible);

      const dominiosEnCarrito = await obtenerDominiosEnCarrito();

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

      setDominio(nombre);
      setResultados(conPrecios);
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

      if (!response.ok) {
        console.error("Error al agregar dominio:", await response.text());
        alert("No se pudo agregar el dominio.");
        return;
      }

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
      console.error("Error de red:", err);
      alert("Error al conectar con la API.");
    }
  };

  return (
    <main className="dominios">
      <div className="buscador">
        <input
          type="text"
          placeholder="chibchaweb"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="boton-adquirir" onClick={() => manejarBusqueda()}>Buscar Dominio</button>
      </div>

      {buscando && <Loader mensaje="Consultando dominios disponibles" />}

      {error && (
        <div className="alerta-error">
          {error}
        </div>
      )}

      {buscado && !buscando && !error && (
        <>
          {mostrarPrincipal && (
            <div className="resultado">
              <div className="bloque resultado-dominio">
                <div className="info-dominio">
                  <strong>{dominio.includes('.') ? dominio : `${dominio}.com`}</strong>
                  <div className="precio-dominio">
                    {principalDisponible
                      ? `$${(
                          precios[(dominio.includes('.') ? dominio.split('.').pop() : "com")] ?? 10000
                        ).toLocaleString()} COP`
                      : '$'}
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
                    !principalDisponible ||
                    dominiosAgregados.has(dominio.includes('.') ? dominio : `${dominio}.com`)
                  }
                  onClick={() =>
                    agregarAlCarrito({
                      id: dominio.includes('.') ? dominio : `${dominio}.com`,
                      nombre: dominio.includes('.') ? dominio : `${dominio}.com`,
                      precio:
                        precios[(dominio.includes('.') ? dominio.split('.').pop() : "com")] ?? 10000,
                    })
                  }
                >
                  {dominiosAgregados.has(dominio.includes('.') ? dominio : `${dominio}.com`)
                    ? "Agregado"
                    : "Agregar al carrito"}
                </button>
              </div>

              <div className="bloque hosting">
                <strong>¿Ya cuenta con servicio de Hosting para su sitio web?</strong>
                <p>ChibchaWeb ofrece este servicio a precios justos</p>
                <button className="btn-agregar">Adquirir Hosting</button>
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
                    <span className="precio">${r.precio.toLocaleString()} COP</span>
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
