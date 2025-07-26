import { useState } from 'react';
import './Dominios.css';
import { useLocation } from 'react-router-dom'


function Dominios() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const dominioBuscado = queryParams.get('nombre') || ''
  const [dominio, setDominio] = useState(dominioBuscado)
  const [buscado, setBuscado] = useState(dominioBuscado !== '')

  const resultados = [
    { nombre: 'chibchaweb.com', precio: 70000 },
    { nombre: 'chibchaweb.co', precio: 7000 },
    { nombre: 'chibchaweb.net', precio: 3000 },
    { nombre: 'chibchaweb.org', precio: 10000 },
  ];

  const manejarBusqueda = () => {
    setBuscado(true);
  };

  return (
    <main className="dominios">
      <div className="buscador">
        <input
          type="text"
          placeholder="ChibchaWeb.com.co"
          value={dominio}
          onChange={e => setDominio(e.target.value)}
        />
        <button onClick={manejarBusqueda}>Buscar Dominio</button>
      </div>

      {buscado && (
        <>
          <div className="resultado">
            <div className="bloque no-disponible">
              <strong>{dominio || 'chibchaweb.com.co'}</strong>
              <p>Este dominio no está disponible</p>
              <button disabled>Adquirir Dominio</button>
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
