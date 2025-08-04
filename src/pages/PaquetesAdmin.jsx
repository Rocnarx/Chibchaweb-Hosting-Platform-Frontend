import { useEffect, useState } from "react";
import "./PaquetesAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PaquetesAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [planes, setPlanes] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(30);
  const [editando, setEditando] = useState(null);
  const [tempValor, setTempValor] = useState("");
  const [guardando, setGuardando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nuevo, setNuevo] = useState(false);
  const [nuevasPeriodicidades, setNuevasPeriodicidades] = useState([30, 180, 365]);
  const [nuevoPaquete, setNuevoPaquete] = useState({
    nombre: "",
    precio: 0,
    sitios: 0,
    bases: 0,
    ssd: 0,
    correos: 0,
    ssl: 0
  });

  const campos = [
    { clave: "precio", label: "Precio (USD)" },
    { clave: "sitios", label: "Sitios" },
    { clave: "bases", label: "Bases de datos" },
    { clave: "ssd", label: "SSD (GB)" },
    { clave: "correos", label: "Correos" },
    { clave: "ssl", label: "Certificados SSL" },
  ];

const cargarPlanes = async () => {
  try {
    const res = await fetch(`${API_URL}/Paquetes`, {
      headers: { "Chibcha-api-key": API_KEY },
    });
    const datos = await res.json();

    // Enriquecer cada paquete con su idinfo llamando GET /InfoDePaqueteHosting
    const planos = await Promise.all(datos.map(async (p) => {
      let idinfo = null;
      try {
        const resInfo = await fetch(`${API_URL}/InfoDePaqueteHosting?idpaquetehosting=${p.idpaquetehosting}`, {
          headers: { "Chibcha-api-key": API_KEY },
        });
        const info = await resInfo.json();
        idinfo = info?.idinfopaquetehosting;
      } catch (err) {
        console.warn("❌ Error obteniendo idinfo para paquete", p.idpaquetehosting);
      }

      return {
        id: p.idpaquetehosting,
        idinfo: idinfo,
        periodicidad: p.periodicidad,
        nombre: p.info?.nombrepaquetehosting || "",
        precio: p.preciopaquete,
        sitios: p.info?.cantidadsitios || 0,
        bases: p.info?.bd || 0,
        ssd: p.info?.gbenssd || 0,
        correos: p.info?.correos || 0,
        ssl: p.info?.certificadosslhttps || 0,
      };
    }));

    console.log("📦 Planes con idinfo:", planos);
    setPlanes(planos);
  } catch (error) {
    console.error("Error cargando paquetes:", error);
  } finally {
    setCargando(false);
  }
};


  useEffect(() => {
    cargarPlanes();
  }, []);

  const editarCampo = (id, campo, valor) => {
    setPlanes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [campo]: campo === "nombre" ? valor : Number(valor) } : p
      )
    );
  };

  const guardarCambios = async (planEditado) => {
    setGuardando(planEditado.id);
    try {
      const resInfo = await fetch(`${API_URL}/InfoDePaqueteHosting?idpaquetehosting=${planEditado.id}`, {
        headers: { "Chibcha-api-key": API_KEY },
      });
      const info = await resInfo.json();
      const idinfo = info?.idinfopaquetehosting;
      if (!idinfo) throw new Error("idinfopaquetehosting no encontrado");

      const planesRelacionados = planes.filter(p => p.idinfo === idinfo);

      for (const p of planesRelacionados) {
        const body = {
          idpaquetehosting: Number(p.id),
          idinfopaquetehosting: Number(idinfo),
          preciopaquete: Number(p.id === planEditado.id ? planEditado.precio : p.precio),
          periodicidad: String(p.periodicidad),
          cantidadsitios: Number(planEditado.sitios),
          nombrepaquetehosting: planEditado.nombre,
          bd: Number(planEditado.bases),
          gbenssd: Number(planEditado.ssd),
          correos: Number(planEditado.correos),
          certificadosslhttps: Number(planEditado.ssl),
        };

        const res = await fetch(`${API_URL}/ModificarPaquete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": API_KEY,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`Error al guardar en plan con ID ${p.id}`);
      }

      alert(`✅ Cambios guardados para "${planEditado.nombre}" para la periodicidad ${periodoSeleccionado === 30 ? "mensual" : periodoSeleccionado === 180 ? "semestral" : "anual"}`);
      cargarPlanes();
    } catch (error) {
      alert("❌ Error al guardar cambios");
      console.error(error);
    } finally {
      setGuardando(null);
    }
  };

const eliminarPaquete = async (idinfo, periodicidad) => {
  const texto = periodicidad === "30" ? "mensual" :
                periodicidad === "180" ? "semestral" : "anual";

  if (!window.confirm(`¿Seguro que deseas eliminar la versión ${texto} de este paquete?`)) return;

  const body = { idinfopaquetehosting: idinfo };
  console.log("🗑️ Enviando DELETE con:", body);

  try {
    const res = await fetch(`${API_URL}/EliminarPaquete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Chibcha-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Error del servidor: ${res.status} - ${msg}`);
    }

    alert(`✅ Se eliminó correctamente la versión ${texto}`);
    cargarPlanes();
  } catch (error) {
    alert("❌ Error al eliminar el paquete");
    console.error(error);
  }
};



  const planesFiltrados = planes.filter((p) => Number(p.periodicidad) === periodoSeleccionado);
  const camposCompletos = nuevoPaquete.nombre.trim() !== "" &&
    campos.every(({ clave }) => String(nuevoPaquete[clave]).trim() !== "");

  return (
    <div className="paquetesadmin-wrapper">
      <div className="paquetesadmin-contenedor">
        <h1>Editar Paquetes de Hosting</h1>
        <p>Haz clic en el campo que deseas editar</p>

        <div className="planes-toggle">
          {[30, 180, 365].map((p) => (
            <button
              key={p}
              className={periodoSeleccionado === p ? "activo" : ""}
              onClick={() => setPeriodoSeleccionado(p)}
            >
              {p === 30 ? "Mensual" : p === 180 ? "Semestral" : "Anual"}
            </button>
          ))}
        </div>

        <div className="planes-grid">
          {cargando ? <p>Cargando...</p> :
            planesFiltrados.map((plan) => (
              <div key={plan.id} className="plan-edit-card">
                <h2>
                <input
                    type="text"
                    value={plan.nombre}
                    onChange={(e) => editarCampo(plan.id, "nombre", e.target.value)}
                    className="titulo-plan"
                />
                </h2>
                <hr className="linea-separadora-plan" />


                {campos.map(({ clave, label }) => {
                  const campoId = `${plan.id}-${clave}`;
                  const valor = plan[clave];

                  return (
                    <p key={campoId}>
                      <strong>{label}:</strong>{" "}
                      {editando === campoId ? (
                        <div className="editor-campo">
                          <input
                            type="number"
                            value={tempValor}
                            onChange={(e) => setTempValor(e.target.value)}
                          />
                          <button onClick={() => {
                            editarCampo(plan.id, clave, tempValor);
                            setEditando(null);
                          }}>Ok</button>
                          <button onClick={() => setEditando(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <span className="clickeable" onClick={() => {
                          setEditando(campoId);
                          setTempValor(valor);
                        }}>
                          {clave === "precio" ? `$${valor.toLocaleString()}` : valor}
                        </span>
                      )}
                    </p>
                  );
                })}

                <div className="boton-guardar-wrapper boton-acciones">
                <button
                    className="boton-guardar"
                    onClick={() => guardarCambios(plan)}
                    disabled={guardando === plan.id}
                >
                    {guardando === plan.id ? "Guardando..." : "Guardar cambios"}
                </button>

                <button
                className="btn-eliminar"
                title="Eliminar paquete"
                onClick={() => eliminarPaquete(plan.idinfo, plan.periodicidad)}
                >
                <FontAwesomeIcon icon={faTrash} />
                </button>
                </div>

              </div>
            ))}
        </div>

        {nuevo && (
          <div className="modal-overlay">
            <div className="modal-contenido alternativas">
              <button className="cerrar-modal" onClick={() => setNuevo(false)}>✕</button>
              <h2>Nuevo paquete</h2>
              <div className="grupo-input">
                <label>Nombre del plan</label>
                <input
                  type="text"
                  value={nuevoPaquete.nombre}
                  onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, nombre: e.target.value })}
                />
              </div>
              {campos.map(({ clave, label }) => (
                <div className="grupo-input" key={clave}>
                  <label>{label}</label>
                  <input
                    type="number"
                    value={nuevoPaquete[clave]}
                    onChange={(e) => setNuevoPaquete({
                      ...nuevoPaquete,
                      [clave]: e.target.value
                    })}
                  />
                </div>
              ))}

              <div className="grupo-input">
                <label>Periodicidades a crear</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[30, 180, 365].map((p) => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input
                        type="checkbox"
                        checked={nuevasPeriodicidades.includes(p)}
                        onChange={() => {
                          setNuevasPeriodicidades((prev) =>
                            prev.includes(p)
                              ? prev.filter((v) => v !== p)
                              : [...prev, p]
                          );
                        }}
                      />
                      {p === 30 ? "Mensual" : p === 180 ? "Semestral" : "Anual"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grupo-botones">
                <button
                  className="btn-confirmar"
                  disabled={!camposCompletos}
                  title={!camposCompletos ? "Completa todos los campos" : ""}
                  onClick={async () => {
                    try {
                      if (nuevasPeriodicidades.length === 0) {
                        alert("⚠️ Debes seleccionar al menos una periodicidad");
                        return;
                      }

                      for (const periodo of nuevasPeriodicidades) {
                        const body = {
                          cantidadsitios: Number(nuevoPaquete.sitios),
                          nombrepaquetehosting: nuevoPaquete.nombre.trim(),
                          bd: Number(nuevoPaquete.bases),
                          gbenssd: Number(nuevoPaquete.ssd),
                          correos: Number(nuevoPaquete.correos),
                          certificadosslhttps: Number(nuevoPaquete.ssl),
                          preciopaquete: Number(nuevoPaquete.precio),
                          periodicidad: String(periodo)
                        };

                        const res = await fetch(`${API_URL}/CrearPaquete`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Chibcha-api-key": API_KEY,
                          },
                          body: JSON.stringify(body),
                        });

                        if (!res.ok) throw new Error(`Error al crear el paquete con periodicidad ${periodo}`);
                      }

                      alert("✅ Paquete creado correctamente");
                      setNuevo(false);
                      setNuevoPaquete({
                        nombre: "",
                        precio: 0,
                        sitios: 0,
                        bases: 0,
                        ssd: 0,
                        correos: 0,
                        ssl: 0
                      });
                      setNuevasPeriodicidades([30, 180, 365]);
                      cargarPlanes();
                    } catch (error) {
                      alert("❌ Error al crear el paquete");
                      console.error(error);
                    }
                  }}
                >
                  Guardar
                </button>
                <button className="cancelar" onClick={() => setNuevo(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <button className="boton-nuevo" onClick={() => setNuevo(true)}>
          + Nuevo paquete
        </button>
      </div>
    </div>
  );
}
