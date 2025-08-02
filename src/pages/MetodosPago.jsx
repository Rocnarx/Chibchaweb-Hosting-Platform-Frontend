import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import "./MetodosPago.css";

export default function MetodosPago() {
  const { usuario } = useUser();
  const [metodos, setMetodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerMetodos = async () => {
      if (!usuario?.identificacion) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/metodosPagoUsuario?identificacion=${usuario.identificacion}`, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los métodos de pago");

        const data = await res.json();
        setMetodos(data.metodos_pago || []);
      } catch (err) {
        console.error(" Error:", err);
        setError("No se pudieron cargar los métodos de pago.");
      } finally {
        setCargando(false);
      }
    };

    obtenerMetodos();
  }, [usuario]);

  return (
    <div className="metodos-container">
      <h2>Selecciona un método de pago</h2>

      {cargando ? (
        <p>Cargando métodos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : metodos.length === 0 ? (
        <p>No tienes métodos de pago registrados.</p>
      ) : (
        <div className="tarjetas-grid">
          {metodos.map((m, index) => (
            <div
              key={index}
              className={`tarjeta ${seleccionado === index ? "seleccionada" : ""}`}
              onClick={() => setSeleccionado(index)}
            >
              <div className="marca">
                {m.tipotarjeta === 1 ? "MasterCard" : "Visa"}
              </div>
              <div className="numero">
                **** **** {String(m.numerotarjeta).slice(-4)}
              </div>
              <div className="id-usuario">
                ID: {m.identificacion}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
