import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientesAdmin.css";

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=1`,
          {
            headers: {
              "Chibcha-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener los clientes");

        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los clientes.");
      }
    };

    obtenerClientes();
  }, []);

  const irADetalle = (correo) => {
  navigate(`/clientes/${correo}`);
};


  // Filtrado por nombre o correo
  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombrecuenta} ${cliente.correo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-admin-container">
      <h2>Clientes Registrados</h2>

      {error && <p className="error">❌ {error}</p>}

      <input
        type="text"
        className="buscador-clientes"
        placeholder="🔍 Buscar por nombre o correo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="tarjetas-clientes">
        {clientesFiltrados.map((cliente) => (
          <div
            key={cliente.idcuenta}
            className="tarjeta-cliente"
            onClick={() => irADetalle(cliente.correo)}

          >
            <h3>{cliente.nombrecuenta}</h3>
            <p>{cliente.correo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
