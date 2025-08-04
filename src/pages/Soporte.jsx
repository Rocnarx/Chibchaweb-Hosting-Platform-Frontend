import './Soporte.css';
import { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

function Soporte() {
  const { usuario } = useUser();

  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [asuntoInvalido, setAsuntoInvalido] = useState(false);
  const [descripcionInvalida, setDescripcionInvalida] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [cargandoTickets, setCargandoTickets] = useState(true);
  const [errorTickets, setErrorTickets] = useState('');
  const [ticketActivo, setTicketActivo] = useState(null);
  const [respuestas, setRespuestas] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const asuntoValido = asunto.trim() !== '';
    const descripcionValida = descripcion.trim() !== '';

    setAsuntoInvalido(!asuntoValido);
    setDescripcionInvalida(!descripcionValida);

    if (!asuntoValido || !descripcionValida) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!usuario || !usuario.idcuenta) {
      setError('No se pudo obtener tu cuenta. Intenta iniciar sesión nuevamente.');
      return;
    }

    setError('');
    setEnviando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/CrearTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          IDCLIENTE: usuario.idcuenta,
          DESCRICTICKET: `${asunto}: ${descripcion}`
        })
      });

      if (!response.ok) throw new Error('Error al enviar el ticket');

      alert('✅ Ticket enviado correctamente.');
      setAsunto('');
      setDescripcion('');
      setAsuntoInvalido(false);
      setDescripcionInvalida(false);
      await cargarTickets();
    } catch (err) {
      console.error('❌ Error al enviar ticket:', err);
      setError('Hubo un problema al enviar el ticket.');
    } finally {
      setEnviando(false);
    }
  };

  const cargarTickets = async () => {
    if (!usuario || !usuario.idcuenta) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/consultarTicketporIDCUENTA?idcuenta=${usuario.idcuenta}`, {
        headers: {
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        }
      });

      const datos = await res.json();

      if (!res.ok || !datos.tickets) throw new Error("No se pudieron obtener los tickets");

      setTickets(datos.tickets);
      setErrorTickets('');
    } catch (err) {
      console.error("❌ Error al obtener tickets:", err);
      setErrorTickets('No se pudieron cargar tus tickets.');
    } finally {
      setCargandoTickets(false);
    }
  };

  const abrirTicket = async (ticket) => {
    const yaAbierto = ticketActivo?.id_ticket === ticket.id_ticket;
    setTicketActivo(yaAbierto ? null : ticket);
    setRespuestas([]);

    if (!yaAbierto) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ticket/${ticket.id_ticket}`, {
          headers: {
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          }
        });

        const data = await res.json();
        setRespuestas(data.respuestas || []);
      } catch (err) {
        console.error("❌ Error al obtener respuestas del ticket:", err);
      }
    }
  };

  useEffect(() => {
    cargarTickets();
  }, [usuario]);

  return (
    <main className="soporte-container">
      <div className="soporte-formulario">
        <h2>
          <FontAwesomeIcon icon={faHeadset} /> Centro de Soporte Técnico
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <label htmlFor="asunto">Asunto</label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ej: Error al registrar dominio"
            className={asuntoInvalido ? 'input-error' : ''}
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe tu problema..."
            rows="4"
            className={descripcionInvalida ? 'input-error' : ''}
          />

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Ticket'}
          </button>
        </form>
      </div>

      <div className="soporte-tickets">
        <h3>📋 Mis Tickets</h3>

        <div className="lista-tickets">
          {cargandoTickets ? (
            <p>Cargando tickets...</p>
          ) : errorTickets ? (
            <p className="form-error">{errorTickets}</p>
          ) : tickets.length === 0 ? (
            <p>No has enviado ningún ticket aún.</p>
          ) : (
            tickets.map((t) => {
              const abierto = ticketActivo?.id_ticket === t.id_ticket;
              return (
                <div
                  key={t.id_ticket}
                  className={`ticket ${abierto ? 'abierto' : ''}`}
                  onClick={() => abrirTicket(t)}
                >
                  <span className="ticket-id">#{t.codigo}</span>
                  <span className="ticket-desc">{t.descripcion}</span>
                  <span className={`ticket-status ${t.estado === 2 ? 'resuelto' : 'en-proceso'}`}>
                    {t.estado === 2 ? 'Resuelto' : 'En proceso'}
                  </span>

                  {abierto && (
                    <div className="ticket-detalle">
                      <p><strong>Fecha:</strong> {t.fecha_creacion}</p>
                      <p><strong>Descripción:</strong> {t.descripcion}</p>
                      <p><strong>Respuestas del equipo:</strong></p>
                      {respuestas.length > 0 ? (
                        respuestas.map((r) => (
                          <div key={r.id_respuesta} className="ticket-respuesta">
                            <p>{r.contenido}</p>
                            <small><em>📅 {r.fecha}</em></small>
                          </div>
                        ))
                      ) : (
                        <p><em>No hay respuestas aún.</em></p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default Soporte;
