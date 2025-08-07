import React, { useState, useEffect } from "react";
import { usePreciosExtensiones } from "../Context/ExtensionContext";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import "./Extensiones.css";
import "../styles.css";

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

  const { usuario } = useUser();
  const navigate = useNavigate();

  // 🔐 Redirigir si no es admin
  useEffect(() => {
    if (usuario && usuario.tipocuenta !== "ADMIN") {
      navigate("/");
    }
  }, [usuario, navigate]);


  if (cargando) return <Loader mensaje="Cargando precios de extensiones" />;
  if (error) return <p className="alerta-error">{error}</p>;

  return (
    <div className="extensiones-wrapper">
      <div className="extensiones-contenedor">
        <h1>Precios por Extensión</h1>
        <p>Haz clic en una extensión para modificar su precio</p>

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
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permitir solo números, punto decimal y máximo un punto
                      if (/^\d*\.?\d*$/.test(value)) {
                        setPrecioTemp(value);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actualizarPrecio(ext, precioTemp);
                      setEditando(null);
                    }}
                  >
                    Ok
                  </button>
                </div>
              ) : (
                <strong>${precio.toLocaleString()} USD</strong>
              )}
            </div>
          ))}
        </div>

        <div className="boton-guardar-wrapper">
          <button className="boton-guardar-global" onClick={guardarPrecios}>
            Guardar todos los cambios
          </button>
        </div>
      </div>
    </div>
  );
}
