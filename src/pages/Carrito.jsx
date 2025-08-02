import './Carrito.css';
import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Carrito() {
  const { usuario } = useUser();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState("");
  const [comision, setComision] = useState(0); 

  const cargarCarrito = async () => {
    if (!usuario || !usuario.idcuenta) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/carrito/dominios?idcuenta=${usuario.idcuenta}`,
        {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          }
        }
      );

      const datos = await res.json();

      if (!res.ok) {
        if (datos.detail && datos.detail.includes("No se encontraron dominios")) {
          setItems([]);
          return;
        }
        throw new Error("No se pudo obtener el carrito");
      }

      if (!Array.isArray(datos)) {
        throw new Error("Respuesta inesperada del servidor");
      }

      const dominios = datos.map(d => ({
        nombre: d.dominio,
        precio: d.precio
      }));

      setItems(dominios);
      setError("");
    } catch (err) {
      console.error("Error al cargar el carrito:", err);
      setError("No se pudo cargar el carrito.");
    } finally {
      setCargando(false);
    }
  };

  const cargarComision = async () => {
    if (!usuario || !usuario.idcuenta || usuario.tipocuenta?.toUpperCase() !== "DISTRIBUIDOR") return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/MiPlan?idcuenta=${usuario.idcuenta}`, {
        headers: {
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener el plan");

      const datos = await res.json();
      console.log("🔍 Plan del usuario:", datos);

      if (typeof datos.comision === "number") {
        setComision(datos.comision);
      }
    } catch (err) {
      console.error("Error al obtener la comisión:", err);
    }
  };

  useEffect(() => {
    cargarCarrito();
    cargarComision();
  }, [usuario]);

  const subtotal = items.reduce((acc, item) => acc + item.precio, 0);
  const impuestos = Math.round(subtotal * 0.19);
  const total = subtotal + impuestos;
  const descuento = Math.round((subtotal * comision) / 100);
  const totalConDescuento = total - descuento;

  const manejarPago = async () => {
    setPagando(true);

    try {
      console.log("🧾 Iniciando proceso de pago...");

      const dominiosAActualizar = items.map((item) => ({
        iddominio: item.nombre,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ActualizarOcupadoDominio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ dominios: dominiosAActualizar }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error actualizando dominios: ${errorText}`);
      }

      await cargarCarrito();
      alert("✅ Pago realizado y dominios actualizados correctamente.");
    } catch (err) {
      console.error("❌ Error durante el pago:", err);
      alert("❌ Ocurrió un error durante el pago.");
    } finally {
      setPagando(false);
    }
  };

  const eliminarDominio = async (iddominio) => {
    if (!usuario || !usuario.idcuenta) return;

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/EliminarDominioCarrito?idcuenta=${usuario.idcuenta}&iddominio=${iddominio}`,
        {
          method: "DELETE",
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          }
        }
      );

      if (!respuesta.ok) throw new Error("Error al eliminar dominio del carrito");

      setItems(prev => prev.filter(item => item.nombre !== iddominio));
      alert(`Se ha eliminado "${iddominio}" del carrito.`);
    } catch (err) {
      console.error("❌ Error eliminando dominio:", err);
      alert("No se pudo eliminar el dominio del carrito.");
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
                <button className="btn-eliminar" onClick={() => eliminarDominio(item.nombre)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
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

            {comision > 0 && (
              <div className="linea">
                <span>Descuento ({comision}%)</span>
                <span>– ${descuento.toLocaleString()} COP</span>
              </div>
            )}

            <hr />

            <div className="linea total">
              <span>Total</span>
              <span>${totalConDescuento.toLocaleString()} COP</span>
            </div >

            <button
              className="btn-pago"
              onClick={manejarPago}
              disabled={pagando}
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
