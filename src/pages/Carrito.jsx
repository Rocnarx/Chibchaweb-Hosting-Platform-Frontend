import './Carrito.css';

function Carrito() {
  const items = [
    { dominio: 'chibchaweb.com', precio: 70000 },
    { dominio: 'chibchaweb.online', precio: 7000 },
    { dominio: 'chibchaweb.xyz', precio: 3000 },
    
  ];

  const subtotal = items.reduce((acc, item) => acc + item.precio, 0);
  const impuestos = Math.round(subtotal * 0.19);
  const total = subtotal + impuestos;

  return (
    <main className="carrito">
      <h1>Carrito <span className="cantidad-items">{items.length} items</span></h1>
      <div className="linea-separadora" />


      <div className="carrito-contenido">
        <div className="lista-dominios">
          {items.map((item, i) => (
            <div key={i} className="item-dominio">
              <span className="check">✔</span>
              <span className="nombre">{item.dominio}</span>
              <span className="precio">${item.precio.toLocaleString()} COP</span>
            </div>
          ))}
        </div>

        <div className="resumen-pago">
          <h2>Order summary</h2>
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
          <button className="btn-pago">
            Realizar el pago →
          </button>
        </div>
      </div>
    </main>
  );
}

export default Carrito;
