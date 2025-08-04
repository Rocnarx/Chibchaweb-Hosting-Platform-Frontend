import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClienteDetalle.css";

export default function ClienteDetalle() {
  const { correo } = useParams();
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cuenta_por_correo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ correo }),
        });

        if (!res.ok) throw new Error("No se pudo obtener el cliente");

        const data = await res.json();
        setCliente(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del cliente.");
      }
    };

    obtenerCliente();
  }, [correo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!modoEdicion) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${cliente.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar cambios");

      setMensaje("Cambios guardados correctamente.");
      setModoEdicion(false);
      setCliente(formData);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar los cambios.");
    }
  };

  const handleCancelar = () => {
    setFormData(cliente);
    setModoEdicion(false);
    setMensaje("");
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${cliente.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ ...formData, IDTIPOCUENTA: 6 }),
      });

      if (!res.ok) throw new Error("Error al eliminar la cuenta");

      navigate("/ClientesAdmin");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la cuenta.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!cliente) return <p className="cargando">Cargando información...</p>;

  return (
    <div className="cliente-detalle-container">
      <h2>Detalle del Cliente</h2>

      <div className="cliente-form">
        <label>ID Usuario:
          <input type="text" name="IDCUENTA" value={formData.IDCUENTA} disabled />
        </label>

        <label>Nombre:
          <input type="text" name="NOMBRECUENTA" value={formData.NOMBRECUENTA} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Correo:
          <input type="email" name="CORREO" value={formData.CORREO} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Teléfono:
          <input type="text" name="TELEFONO" value={formData.TELEFONO} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Dirección:
          <input type="text" name="DIRECCION" value={formData.DIRECCION} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>País:
          <select name="IDPAIS" value={formData.IDPAIS} onChange={handleChange} disabled={!modoEdicion}>
            <option value={76}>Brasil</option>
            <option value={170}>Colombia</option>
            <option value={218}>Ecuador</option>
            <option value={604}>Perú</option>
            <option value={862}>Venezuela</option>
          </select>
        </label>

        <label>Tipo de cuenta:
          <input type="number" name="IDTIPOCUENTA" value={formData.IDTIPOCUENTA} disabled />
        </label>

        <label>ID del plan:
          <input type="number" name="IDPLAN" value={formData.IDPLAN} onChange={handleChange} disabled={!modoEdicion} />
        </label>
      </div>

      <div className="botones">
        {!modoEdicion ? (
          <button className="btn btn-editar" onClick={() => setModoEdicion(true)}>
            ✎ Editar
          </button>
        ) : (
          <>
            <button className="btn btn-guardar" onClick={handleGuardar}>
              💾 Guardar
            </button>
            <button className="btn btn-volver" onClick={handleCancelar}>
              ✖ Cancelar
            </button>
          </>
        )}
        <button className="btn btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <button className="btn btn-eliminar" onClick={handleEliminar}>
          🗑 Eliminar cuenta
        </button>
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
