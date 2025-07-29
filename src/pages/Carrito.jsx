import './Carrito.css';
import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';

function Carrito() {
  const { usuario } = useUser();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagando, setPagando] = useState(false); // Estado para bloquear botón de pagon
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCarrito = async () => {
      if (!usuario || !usuario.idcuenta) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/carrito/dominios?idcuenta=${usuario.idcuenta}`, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          }
        });

        if (!res.ok) throw new Error("No se pudo obtener el carrito");

        const datos = await res.json();

        const dominios = datos.map(d => ({
          nombre: d.dominio,
          precio: d.precio
        }));

        setItems(dominios);
      } catch (err) {
        console.error("Error al cargar el carrito:", err);
        setError("No se pudo cargar el carrito.");
      } finally {
        setCargando(false);
      }
    };

    cargarCarrito();
  }, [usuario]);

  const subtotal = items.reduce((acc, item) => acc + item.precio, 0);
  const impuestos = Math.round(subtotal * 0.19);
  const total = subtotal + impuestos;

  const manejarPago = async () => {
    setPagando(true);

    try {
      console.log("🧾 Iniciando proceso de pago...");
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      alert("✅ Pago realizado correctamente (simulado)");
    } catch (err) {
      console.error("❌ Error durante el pago:", err);
      alert("❌ Ocurrió un error durante el pago.");
    } finally {
      setPagando(false);
    }
  };

  return (
    <main className="carrito">
      <h1>Carrito <span className="cantidad-items">{items.length} items</span></h1>
      <div className="linea-separadora" />

      {cargando ? (
        <p>Cargando carrito...</p>
      ) : error ? (
        <p className="mensaje-error">{error}</p>
      ) : items.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío.</p>
      ) : (
        <div className="carrito-contenido">
          <div className="lista-dominios">
            {items.map((item, i) => (
              <div key={i} className="item-dominio">
                <span className="check">✔</span>
                <span className="nombre">{item.nombre}</span>
                <span className="precio">${item.precio.toLocaleString()} COP</span>
              </div>
            ))}
          </div>

          <div className="resumen-pago">
            <h2>Resumen de orden</h2>
            <div className="linea">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()} COP</span>
            </div>
            <div className="linea">
              <span>Impuestos</span>
              <span>${impuestos.toLocaleString()} COP</span>
            </div>
            <hr />
            <div className="linea total">
              <span>Total</span>
              <span>${total.toLocaleString()} COP</span>
            </div>
            <button
              className="btn-pago"
              onClick={manejarPago}
              disabled={pagando} // DESABILITAR BOTON, INICIO DE CARGA
            >
              {pagando ? "Procesando..." : "Realizar el pago →"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Carrito;
