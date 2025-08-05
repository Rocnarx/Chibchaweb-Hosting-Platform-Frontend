import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DistribuidorAdmin.css";

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuentas-por-tipo?idtipo=2`, {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los distribuidores");

        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los distribuidores.");
      }
    };

    obtenerClientes();
  }, []);

  const irADetalle = (correo) => {
    navigate(`/clientes/${correo}`);
  };

  return (
    <div className="clientes-admin-container">
      <h2>Distribuidores</h2>

      {error && <p className="error">❌ {error}</p>}

      <div className="tarjetas-clientes">
        {clientes.map((cliente) => (
          <div
            key={cliente.idcuenta}
            className={`tarjeta-cliente tipo-${cliente.idtipocuenta}`}
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
