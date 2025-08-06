import { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import "./PaqueteAdquirido.css";

export default function PaqueteAdquirido() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const { usuario } = useUser();

  const [idfactura, setIdFactura] = useState(null);
  const [items, setItems] = useState({});
  const [planInfo, setPlanInfo] = useState(null);
  const [editandoItem, setEditandoItem] = useState(null);
  const [form, setForm] = useState({ nombreitem: "", tamano: "" });
  const [mensaje, setMensaje] = useState("");
  const [sinPaquete, setSinPaquete] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [usuarioListo, setUsuarioListo] = useState(false);

  const formatoNombreGrupo = {
    WEB: "Sitios Web",
    CORREO: "Cuentas de Correo",
    GBENSSD: "Nube SSD",
    SSL: "Certificados SSL"
  };

    useEffect(() => {
    if (!usuario) return; // ⬅️ espera a que se cargue el contexto

    const iniciar = async () => {
        if (!usuario.idcuenta) {
        console.warn("⚠️ No hay idcuenta");
        setSinPaquete(true);
        return;
        }

        try {
        const resPlan = await fetch(`${API_URL}/MiPaquete?idcuenta=${usuario.idcuenta}`, {
            headers: { "Chibcha-api-key": API_KEY },
        });
        const dataPlan = await resPlan.json();

        if (!dataPlan || !dataPlan.idfacturapaquete || Number(dataPlan.estado) !== 1) {
            setSinPaquete(true);
            return;
        }

        setPlanInfo(dataPlan);
        setIdFactura(dataPlan.idfacturapaquete);
        cargarItems(dataPlan.idfacturapaquete);
        } catch (error) {
        console.error("❌ Error al obtener paquete:", error);
        setSinPaquete(true);
        }
    };

    iniciar();
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
      setItems(agrupados);
    } catch (err) {
      console.error("❌ Error al cargar items:", err);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (item) => {
    setEditandoItem(item);
    setForm({
      nombreitem: item.NOMBREITEM,
      tamano: item.TAMANO === "NA" ? "" : item.TAMANO,
    });
  };

  const guardarCambios = async () => {
    try {
      const body = {
        idregitempaquete: editandoItem.IDREGITEMPAQUETE,
        nombreitem: form.nombreitem,
        tamano: form.tamano === "" ? "NA" : String(form.tamano),
      };

      const res = await fetch(`${API_URL}/EditarItemFactura`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al editar");

      setEditandoItem(null);
      setForm({ nombreitem: "", tamano: "" });
      await cargarItems(idfactura);
      setMensaje("✅ Cambios guardados correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("❌ Error guardando:", err);
    }
  };

  if (sinPaquete) {
    return (
      <div className="paquete-wrapper">
        <div className="paquete-contenedor mensaje-sin-paquete">
          <div className="icono-triste">📭</div>
          <h2>No tienes un paquete activo</h2>
          <p>Adquiere uno para ver y administrar tus servicios.</p>
        </div>
      </div>
    );
  }

  const diasRestantes = planInfo?.fchvencimiento
    ? Math.ceil((new Date(planInfo.fchvencimiento) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

const obtenerLimiteTamano = (tipo) => {
  const tipoKey = tipo.toUpperCase();
  if (!planInfo?.info) return undefined;

  switch (tipoKey) {
    case "GBENSSD":
      return planInfo.info.gbenssd;
    default:
      return undefined;
  }
};

  return (
    <div className="paquete-wrapper">
      <div className="paquete-contenedor">
        <h1>Plan {planInfo?.info?.nombrepaquetehosting || ""}</h1>
        {diasRestantes !== null && (
          <p className="paquete-descripcion">
            Te quedan <strong>{diasRestantes} días</strong> de tu plan actual.
          </p>
        )}

        {cargando ? (
          <p>Cargando contenido...</p>
        ) : (
          <div className="secciones">
            {Object.entries(items).map(([clave, grupo]) => (
              <div className="seccion-amigable" key={clave}>
                <div className="titulo-seccion-conteo">
                <h2>{formatoNombreGrupo[clave] || clave}</h2>
                <span className="cantidad-items">({grupo.length})</span>
                </div>

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
                  type="number"
                  max={obtenerLimiteTamano(editandoItem.DESCRIPCION)}
                  value={form.tamano}
                  onChange={(e) => {
                    const valor = e.target.value;
                    const num = Number(valor);
                    const limite = obtenerLimiteTamano(editandoItem.DESCRIPCION);

                    if (limite !== undefined && num > limite) {
                        setForm({ ...form, tamano: String(limite) });
                    } else {
                        setForm({ ...form, tamano: valor });
                    }
                    }}

                />
                <small>
                  Máximo permitido: {obtenerLimiteTamano(editandoItem.DESCRIPCION)} GB
                </small>
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
