import { useEffect, useState } from 'react';
import './Dominios.css';
import { useLocation } from 'react-router-dom';

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';

  const [input, setInput] = useState(dominioInicial);
  const [dominio, setDominio] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [principalDisponible, setPrincipalDisponible] = useState(false);
  const [error, setError] = useState('');

  const precioDominio = 10000;
  const EXTENSIONS = ["com", "net", "org", "co", "io", "app", "info", "dev", "online", "store"];

  useEffect(() => {
    if (dominioInicial) {
      setInput(dominioInicial);
      manejarBusqueda(dominioInicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarBusqueda = async (valorManual = null) => {
    let nombre = (valorManual ?? input).trim().toLowerCase();


    
    // Si termina en punto (ej. "holi.") => quitarlo
    if (nombre.endsWith('.')) {
      nombre = nombre.slice(0, -1);
    }

    // ❗ Si está vacío, mostramos un mensaje y detenemos
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

    const tieneExtension = nombre.includes('.') && EXTENSIONS.some(ext => nombre.endsWith(`.${ext}`));

    if (nombre.includes('.') && !tieneExtension) {
      setError('La extensión del dominio no es válida.');
      setBuscando(false);
      return;
    }

    try {
      const response = await fetch(
        `https://fastapi-app-production-d0f4.up.railway.app/Dominios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain: nombre.includes('.') ? nombre.split('.')[0] : nombre }),
        }
      );

      const data = await response.json();

      const dominioPrincipal = tieneExtension ? nombre : `${nombre}.com`;
      const estadoPrincipal = data.alternativas.find(d => d.domain === dominioPrincipal);
      setPrincipalDisponible(estadoPrincipal && estadoPrincipal.registered === false);

      const disponibles = data.alternativas.filter((d) => d.registered === false);
      const conPrecios = disponibles.map((dom) => ({
        nombre: dom.domain,
        precio: precioDominio,
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

  return (
    <main className="dominios">
      <div className="buscador">
        <input
          type="text"
          placeholder="chibchaweb"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={() => manejarBusqueda()}>Buscar Dominio</button>
      </div>

      {buscando && (
        <div className="busqueda-especial">
          <div className="spinner" />
          <p className="texto-carga">
            Consultando... <br />
            <span>Buscando tu dominio perfecto </span>
          </p>
        </div>
      )}

      {error && (
        <div className="alerta-error">
          {error}
        </div>
      )}

      {buscado && !buscando && !error && (
        <>
          <div className="resultado">
            <div className="bloque resultado-dominio">
              <div className="info-dominio">
                <strong>{dominio.includes('.') ? dominio : `${dominio}.com`}</strong>
                <div className="precio-dominio">
                  {principalDisponible ? `$${precioDominio.toLocaleString()} COP` : '$'}
                </div>
                <p>
                  {principalDisponible
                    ? 'Este dominio está disponible'
                    : 'Este dominio no está disponible'}
                </p>
              </div>
              <button
                className={principalDisponible ? 'boton-adquirir' : 'boton-deshabilitado'}
                disabled={!principalDisponible}
              >
                Agregar al carrito
              </button>
            </div>

            <div className="bloque hosting">
              <strong>¿Ya cuenta con servicio de Hosting para su sitio web?</strong>
              <p>ChibchaWeb ofrece este servicio a precios justos</p>
              <button>Adquirir Hosting</button>
            </div>
          </div>

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
                    <button>Agregar al carrito</button>
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
