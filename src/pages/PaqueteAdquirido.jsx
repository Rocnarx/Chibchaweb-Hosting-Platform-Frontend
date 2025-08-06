import { useEffect, useState } from "react";
import "./PaqueteAdquirido.css";

export default function PaqueteAdquirido() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const idfacturapaquete = 15;
  const descripciones = ["WEB", "CORREO", "GBENSSD", "SSL"];

  const [items, setItems] = useState({});
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombreitem: "", tamano: "" });
  const [guardando, setGuardando] = useState(false);

const cargarItems = async () => {
  try {
    const res = await fetch(`${API_URL}/ItemsFactura?idfacturapaquete=${idfacturapaquete}`, {
      headers: { "Chibcha-api-key": API_KEY },
    });

    const data = await res.json();

    // Agrupar por DESCRIPCION
    const agrupados = data.reduce((acc, item) => {
      const tipo = item.DESCRIPCION.toUpperCase(); // WEB, CORREO, SSL, etc.
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(item);
      return acc;
    }, {});

    setItems(agrupados);
  } catch (error) {
    console.error("Error al cargar items del paquete:", error);
  } finally {
    setCargando(false);
  }
};


  useEffect(() => {
    cargarItems();
  }, []);

  const formatoNombreGrupo = {
    "WEB": "Sitios Web",
    "CORREO": "Cuentas de Correo",
    "GBENSSD": "Nube SSD",
    "SSL": "Certificados SSL"
  };

  const iniciarEdicion = (item) => {
    setEditando(item.IDREGITEMPAQUETE);
    setForm({
      nombreitem: item.NOMBREITEM,
      tamano: item.TAMANO === "NA" ? "" : item.TAMANO,
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm({ nombreitem: "", tamano: "" });
  };

  const guardarCambios = async (id) => {
    setGuardando(true);
    try {
      const body = {
        idregitempaquete: id,
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

      setEditando(null);
      setForm({ nombreitem: "", tamano: "" });
      await cargarItems();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("❌ Error al guardar cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="paquete-wrapper">
      <div className="paquete-contenedor">
        <h1>Contenido del Paquete</h1>
        <p className="paquete-descripcion">Aquí puedes ver y editar los servicios activos de tu paquete adquirido.</p>

        {cargando ? (
          <p className="cargando">Cargando contenido...</p>
        ) : (
          <div className="secciones">
            {descripciones.map((clave) => {
              const grupo = items[clave];
              if (!Array.isArray(grupo) || grupo.length === 0) return null;

              return (
                <div className="seccion-amigable" key={clave}>
                  <h2>{formatoNombreGrupo[clave]}</h2>
                  <ul className="lista-items">
                    {grupo.map((item) => {
                      const enEdicion = editando === item.IDREGITEMPAQUETE;
                      return (
                        <li key={item.IDREGITEMPAQUETE}>
                          {enEdicion ? (
                            <div style={{ width: "100%" }}>
                              <input
                                className="input-editar"
                                type="text"
                                value={form.nombreitem}
                                onChange={(e) =>
                                  setForm({ ...form, nombreitem: e.target.value })
                                }
                                placeholder="Nombre del ítem"
                              />
                              {item.TAMANO !== "NA" && (
                                <input
                                  className="input-editar"
                                  type="text"
                                  value={form.tamano}
                                  onChange={(e) =>
                                    setForm({ ...form, tamano: e.target.value })
                                  }
                                  placeholder="Tamaño"
                                />
                              )}
                              <div className="acciones-edicion">
                                <button
                                  className="btn-guardar"
                                  onClick={() => guardarCambios(item.IDREGITEMPAQUETE)}
                                  disabled={guardando}
                                >
                                  {guardando ? "Guardando..." : "Guardar"}
                                </button>
                                <button className="btn-cancelar" onClick={cancelarEdicion}>
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="item-nombre">{item.NOMBREITEM}</span>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                {item.TAMANO && item.TAMANO !== "NA" && (
                                  <span className="item-tamano">{item.TAMANO}</span>
                                )}
                                <button
                                  className="btn-editar"
                                  onClick={() => iniciarEdicion(item)}
                                >
                                  Editar
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
