// src/pages/Extensiones.jsx
import React, { useState } from "react";
import { usePreciosExtensiones } from "../Context/ExtensionContext";
import "./Extensiones.css"; 
import Loader from "../Components/Loader";

export default function Extensiones() {
  const {
    precios,
    actualizarPrecio,
    guardarPrecios,
    cargando,
    error,
  } = usePreciosExtensiones();

  const [editando, setEditando] = useState(null);
  const [precioTemp, setPrecioTemp] = useState("");

  if (error) return <p>{error}</p>;

  return (
    <div className="extensiones-contenedor">
      <h1>Precios por Extensión</h1>
      <p>Haz clic en una extensión para editar su precio.</p>

      <div className="extensiones-grid">
        {Object.entries(precios).map(([ext, precio]) => (
          <div
            key={ext}
            className="ext-card"
            onClick={() => {
              setEditando(ext);
              setPrecioTemp(precio);
            }}
          >
            <span>.{ext}</span>

            {editando === ext ? (
              <div className="editor-precio">
                <input
                  type="number"
                  value={precioTemp}
                  onChange={(e) => setPrecioTemp(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actualizarPrecio(ext, precioTemp);
                    setEditando(null);
                  }}
                >
                  ✅
                </button>
              </div>
            ) : (
              <strong>${precio.toLocaleString()} COP</strong>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button className="boton-guardar-global" onClick={guardarPrecios}>
          Guardar todos los cambios
        </button>
      </div>
    </div>
  );
}
