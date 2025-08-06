import { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import "./PaqueteAdquirido.css";

export default function PaqueteAdquirido() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const { usuario } = useUser();
  const [idfactura, setIdFactura] = useState(null);
  const [items, setItems] = useState({});
  const [cargando, setCargando] = useState(true);
  const [editandoItem, setEditandoItem] = useState(null);
  const [form, setForm] = useState({ nombreitem: "", tamano: "" });
  const [mensaje, setMensaje] = useState("");
  const [sinPaquete, setSinPaquete] = useState(false);

  const formatoNombreGrupo = {
    "WEB": "Sitios Web",
    "CORREO": "Cuentas de Correo",
    "GBENSSD": "Nube SSD",
    "SSL": "Certificados SSL"
  };

  useEffect(() => {
    if (!usuario) return;
    if (!usuario.idcuenta) {
      setSinPaquete(true);
      return;
    }

    const obtenerFacturaActiva = async () => {
      try {
        const res = await fetch(`${API_URL}/facturas-por-cuenta?idcuenta=${usuario.idcuenta}`, {
          headers: { "Chibcha-api-key": API_KEY },
        });
        const data = await res.json();
        console.log("📦 Respuesta completa de /facturas-por-cuenta:", data);

        const facturas = Array.isArray(data) ? data : data.facturas;
        if (!Array.isArray(facturas)) {
          console.warn("❌ Estructura inesperada:", data);
          setSinPaquete(true);
          return;
        }

        console.log("📋 Lista de facturas encontradas:", facturas);

        const activas = facturas.filter(f => Number(f.estado) === 1);
        console.log("✅ Facturas activas filtradas:", activas);

        if (activas.length === 0) {
          console.log("🚫 No hay facturas activas.");
          setSinPaquete(true);
          return;
        }

        const facturaActiva = activas.reduce((a, b) =>
          a.idfacturapaquete > b.idfacturapaquete ? a : b
        );

        console.log("🎯 Usando idfacturapaquete activo:", facturaActiva.idfacturapaquete);
        setIdFactura(facturaActiva.idfacturapaquete);
        cargarItems(facturaActiva.idfacturapaquete);
      } catch (error) {
        console.error("❌ Error al obtener facturas:", error);
        setSinPaquete(true);
      }
    };

    obtenerFacturaActiva();
  }, [usuario]);

  const cargarItems = async (idfacturapaquete) => {
    try {
      const res = await fetch(`${API_URL}/ItemsFactura?idfacturapaquete=${idfacturapaquete}`, {
        headers: { "Chibcha-api-key": API_KEY },
      });

      const data = await res.json();

      const agrupados = data.reduce((acc, item) => {
        const tipo = item.DESCRIPCION.toUpperCase();
        if (!acc[tipo]) acc[tipo] = [];
        acc[tipo].push(item);
        return acc;
      }, {});

      console.log("🧩 Items agrupados por tipo:", agrupados);
      setItems(agrupados);
    } catch (error) {
      console.error("Error al cargar items del paquete:", error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (item) => {
    setEditandoItem(item);
    setForm({
      nombreitem: item.NOMBREITEM,
      tamano: item.TAMANO === "NA" ? "" : item.TAMANO
    });
  };

  const guardarCambios = async () => {
    try {
      const body = {
        idregitempaquete: editandoItem.IDREGITEMPAQUETE,
        nombreitem: form.nombreitem,
        tamano: form.tamano || "NA"
      };

      const res = await fetch(`${API_URL}/EditarItemFactura`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al editar el item");

      setEditandoItem(null);
      setForm({ nombreitem: "", tamano: "" });
      await cargarItems(idfactura);

      setMensaje("✅ ¡Cambios guardados correctamente!");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("❌ Error al guardar cambios.");
    }
  };

  if (sinPaquete) {
    return (
      <div className="paquete-wrapper">
        <div className="paquete-contenedor mensaje-sin-paquete">
          <div className="icono-triste">😕</div>
          <h1>Sin paquete activo</h1>
          <p>
            Actualmente no tienes un plan de hosting activo.<br />
            Si realizaste un pago recientemente, espera unos minutos y vuelve a intentarlo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="paquete-wrapper">
      <div className="paquete-contenedor">
        <h1>Contenido del Paquete</h1>
        <p className="paquete-descripcion">Aquí puedes ver y editar los servicios activos de tu paquete adquirido.</p>

        {cargando ? (
          <p className="cargando">Cargando contenido...</p>
        ) : !Object.keys(items).length ? (
          <div className="mensaje-sin-paquete">
            <div className="icono-triste">📭</div>
            <h2>No se encontraron servicios en tu paquete</h2>
            <p>
              Aunque tienes una factura activa, este paquete no tiene elementos asignados aún.<br />
              Si crees que esto es un error, contacta a soporte.
            </p>
          </div>
        ) : (
          <div className="secciones">
            {Object.entries(items).map(([clave, grupo]) => (
              <div className="seccion-amigable" key={clave}>
                <h2>{formatoNombreGrupo[clave] || clave}</h2>
                <ul className="lista-items">
                  {grupo.map((item) => (
                    <li key={item.IDREGITEMPAQUETE}>
                      <span className="item-nombre">{item.NOMBREITEM}</span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {item.TAMANO && item.TAMANO !== "NA" && (
                          <span className="item-tamano">{item.TAMANO}</span>
                        )}
                        <button className="btn-editar" onClick={() => iniciarEdicion(item)}>
                          Editar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editandoItem && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <button className="cerrar-modal" onClick={() => setEditandoItem(null)}>✕</button>
            <h2>Editar ítem</h2>

            <label>Nombre del ítem</label>
            <input
              className="input-editar"
              type="text"
              value={form.nombreitem}
              onChange={(e) => setForm({ ...form, nombreitem: e.target.value })}
            />

            {editandoItem.TAMANO !== "NA" && (
              <>
                <label>Tamaño</label>
                <input
                  className="input-editar"
                  type="text"
                  value={form.tamano}
                  onChange={(e) => setForm({ ...form, tamano: e.target.value })}
                />
              </>
            )}

            <div className="acciones-edicion">
              <button className="btn-guardar" onClick={guardarCambios}>Guardar</button>
              <button className="btn-cancelar" onClick={() => setEditandoItem(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mensaje && <div className="mensaje-flotante">{mensaje}</div>}
    </div>
  );
}
