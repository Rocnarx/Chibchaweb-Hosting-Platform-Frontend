import { useState } from 'react';
import './Dominios.css';
import { useLocation } from 'react-router-dom';

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';

  const [input, setInput] = useState(dominioInicial);   // Lo que escribe el usuario
  const [dominio, setDominio] = useState(dominioInicial); // Lo que se ha buscado
  const [buscado, setBuscado] = useState(dominioInicial !== '');

  const resultados = [
    { nombre: 'chibchaweb.com', precio: 70000 },
    { nombre: 'chibchaweb.co', precio: 7000 },
    { nombre: 'chibchaweb.net', precio: 3000 },
    { nombre: 'chibchaweb.org', precio: 10000 },
  ];

  const manejarBusqueda = () => {
    setDominio(input.trim());
    setBuscado(true);
  };

  const dominioDisponible = dominio.toLowerCase() === 'chibchaweb.co';
  const precioDominio = 10000;

  return (
    <main className="dominios">
      <div className="buscador">
        <input
          type="text"
          placeholder="chibchaweb.com.co"
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
                <strong>{dominio || 'chibchaweb.com.co'}</strong>
                <div className="precio-dominio">
                  {dominioDisponible ? `$${precioDominio.toLocaleString()} COP` : '$'}
                </div>
                <p>
                  {dominioDisponible
                    ? 'Este dominio está disponible'
                    : 'Este dominio no está disponible'}
                </p>
              </div>
              <button
                className={dominioDisponible ? 'boton-adquirir' : 'boton-deshabilitado'}
                disabled={!dominioDisponible}
              >
                Adquirir Dominio
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
                <span>${r.precio.toLocaleString()} COP</span>
                <button>Adquirir Dominio</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Dominios;
