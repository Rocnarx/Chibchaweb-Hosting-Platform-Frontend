import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiX,
  FiTrash2,
  FiRefreshCcw,
} from "react-icons/fi";
import "./ClienteDetalle.css";

export default function ClienteDetalle() {
  const { correo } = useParams();
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");
  const [alerta, setAlerta] = useState(null);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const navigate = useNavigate();

  const tiposCuenta = {
    1: "CLIENTE",
    2: "DISTRIBUIDOR",
    3: "ADMIN",
    4: "EMPLEADO",
    5: "POSTULADO",
    6: "ELIMINADA",
    7: "INHABILITADO",
  };

  const mostrarAlerta = (mensaje, tipo = "info") => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };

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
    if (!modoEdicion) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      mostrarAlerta("Cambios guardados correctamente.", "success");
      setModoEdicion(false);
      setCliente(formData);
    } catch (err) {
      console.error(err);
      mostrarAlerta("No se pudo guardar los cambios.", "error");
    }
  };

  const handleCancelar = () => {
    setFormData(cliente);
    setModoEdicion(false);
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

      // Mostrar tarjeta emergente
      setMostrarTarjeta(true);
    } catch (err) {
      console.error(err);
      mostrarAlerta("No se pudo eliminar la cuenta", "error");
    }
  };

  const handleRestaurar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${cliente.IDCUENTA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ ...formData, IDTIPOCUENTA: 1 }),
      });

      if (!res.ok) throw new Error("Error al restaurar la cuenta");

      mostrarAlerta("Cuenta restaurada exitosamente.", "success");
      setFormData({ ...formData, IDTIPOCUENTA: 1 });
    } catch (err) {
      console.error(err);
      mostrarAlerta("No se pudo restaurar la cuenta.", "error");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!cliente) return <p className="cargando">Cargando información...</p>;

  return (
    <div className="cliente-detalle-container">
      {alerta && (
        <div className={`alerta alerta-${alerta.tipo}`}>
          {alerta.mensaje}
        </div>
      )}

      {mostrarTarjeta && (
        <div className="tarjeta-overlay">
          <div className="tarjeta-modal">
            <h3>Empleado eliminado correctamente</h3>
            <button onClick={() => {
              setMostrarTarjeta(false);
              navigate("/ClientesAdmin");
            }}>
              OK
            </button>
          </div>
        </div>
      )}

      <button
        className="btn-volver-arriba"
        onClick={() => navigate(-1)}
        title="Volver"
      >
        <FiArrowLeft />
      </button>

      <h2>Detalleee del Cliente</h2>

      <div className="cliente-form">
        {/* Campos */}
        <label>ID Usuario:
          <input type="text" name="IDCUENTA" value={formData.IDCUENTA || ""} disabled />
        </label>

        <label>Nombre:
          <input type="text" name="NOMBRECUENTA" value={formData.NOMBRECUENTA || ""} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Correo:
          <input type="email" name="CORREO" value={formData.CORREO || ""} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Teléfono:
          <input type="text" name="TELEFONO" value={formData.TELEFONO || ""} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>Dirección:
          <input type="text" name="DIRECCION" value={formData.DIRECCION || ""} onChange={handleChange} disabled={!modoEdicion} />
        </label>

        <label>País:
          <select name="IDPAIS" value={formData.IDPAIS || ""} onChange={handleChange} disabled={!modoEdicion}>
            <option value={76}>Brasil</option>
            <option value={170}>Colombia</option>
            <option value={218}>Ecuador</option>
            <option value={604}>Perú</option>
            <option value={862}>Venezuela</option>
          </select>
        </label>

        <label>Tipo de cuenta:
          <input type="text" value={tiposCuenta[formData.IDTIPOCUENTA] || "DESCONOCIDO"} disabled />
        </label>

        <label>ID del plan:
          <input type="number" name="IDPLAN" value={formData.IDPLAN || ""} onChange={handleChange} disabled={!modoEdicion} />
        </label>
      </div>

      <div className="botones">
        {!modoEdicion ? (
          <button className="btn btn-editar" onClick={() => setModoEdicion(true)}>
            <FiEdit /> Editar
          </button>
        ) : (
          <div className="grupo-edicion">
            <button className="btn btn-guardar" onClick={handleGuardar}>
              <FiSave /> Guardar
            </button>
            <button className="btn btn-volver cancelar-derecha" onClick={handleCancelar}>
              <FiX /> Cancelar
            </button>
          </div>
        )}

        {formData.IDTIPOCUENTA === 6 ? (
          <button className="btn btn-guardar" onClick={handleRestaurar}>
            <FiRefreshCcw /> Restaurar cuenta
          </button>
        ) : (
          <button className="btn btn-eliminar" onClick={handleEliminar}>
            <FiTrash2 /> Eliminar cuenta
          </button>
        )}
      </div>
    </div>
  );
}
