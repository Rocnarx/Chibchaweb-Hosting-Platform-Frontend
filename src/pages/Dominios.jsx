import { useState } from 'react';
import './Dominios.css';
import { useLocation } from 'react-router-dom';

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';

  const [input, setInput] = useState(dominioInicial);
  const [dominio, setDominio] = useState(dominioInicial);
  const [buscado, setBuscado] = useState(dominioInicial !== '');
  const [resultados, setResultados] = useState([]);
  const [principalDisponible, setPrincipalDisponible] = useState(false);

  const precioDominio = 10000;

  const manejarBusqueda = async () => {
    if (!input.trim()) return;

    setBuscado(false);
    try {
      const response = await fetch(
        `https://fastapi-app-production-d0f4.up.railway.app/Dominios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain: input.trim().toLowerCase() }),
        }
      );

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      const nombreBuscado = input.trim().toLowerCase();
      const dominioPrincipal = `${nombreBuscado}.com`;

      const estadoPrincipal = data.alternativas.find(d => d.domain === dominioPrincipal);
      setPrincipalDisponible(estadoPrincipal && estadoPrincipal.registered === false);

      const disponibles = data.alternativas.filter((d) => d.registered === false);
      const conPrecios = disponibles.map((dom) => ({
        nombre: dom.domain,
        precio: precioDominio,
      }));

      setDominio(nombreBuscado);
      setResultados(conPrecios);
      setBuscado(true);
    } catch (error) {
      console.error("Error al consultar dominios:", error);
      setResultados([]);
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
        <button onClick={manejarBusqueda}>Buscar Dominio</button>
      </div>

      {buscado && (
        <>
          <div className="resultado">
            <div className="bloque resultado-dominio">
              <div className="info-dominio">
                <strong>{dominio}.com</strong>
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
              <strong>
                ¿Ya cuenta con servicio de Hosting para su sitio web?
              </strong>
              <p>ChibchaWeb ofrece este servicio a precios justos</p>
              <button>Adquirir Hosting</button>
            </div>
          </div>

          <h3>Alternativas</h3>

          <div className="alternativas">
            {resultados.map((r, i) => (
              <div key={i} className="alternativa">
                <span>{r.nombre}</span>
                <div className="precio-y-boton">
                  <span className="precio">${r.precio.toLocaleString()} COP</span>
                  <button>Agregar al carrito</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Dominios;
