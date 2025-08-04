import { useEffect, useState } from "react";
import "./PaquetesAdmin.css";

export default function PaquetesAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [planes, setPlanes] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(30);
  const [editando, setEditando] = useState(null);
  const [tempValor, setTempValor] = useState("");
  const [guardando, setGuardando] = useState(null);
  const [cargando, setCargando] = useState(true);

  const campos = [
    { clave: "precio", label: "Precio (COP)" },
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

      const planos = datos.map((p) => ({
        id: p.idpaquetehosting,
        periodicidad: Number(p.periodicidad),
        nombre: p.info?.nombrepaquetehosting || "",
        precio: p.preciopaquete,
        sitios: p.info?.cantidadsitios || 0,
        bases: p.info?.bd || 0,
        ssd: p.info?.gbenssd || 0,
        correos: p.info?.correos || 0,
        ssl: p.info?.certificadosslhttps || 0,
      }));

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

  const guardarCambios = async (plan) => {
    setGuardando(plan.id);
    try {
      console.log("💾 Guardando:", plan);
      await new Promise((res) => setTimeout(res, 1000));
      alert(`✅ Cambios guardados para "${plan.nombre}"`);
    } catch (error) {
      alert("❌ Error al guardar");
    } finally {
      setGuardando(null);
    }
  };

  const planesFiltrados = planes.filter((p) => p.periodicidad === periodoSeleccionado);

  return (
    <div className="paquetesadmin-wrapper">
      <div className="paquetesadmin-contenedor">
        <h1>Editar Paquetes de Hosting</h1>
        <p>Haz clic en cualquier campo para editar</p>

        <div className="planes-toggle">
          <button
            className={periodoSeleccionado === 30 ? "activo" : ""}
            onClick={() => setPeriodoSeleccionado(30)}
          >
            Mensual
          </button>
          <button
            className={periodoSeleccionado === 180 ? "activo" : ""}
            onClick={() => setPeriodoSeleccionado(180)}
          >
            Semestral
          </button>
          <button
            className={periodoSeleccionado === 365 ? "activo" : ""}
            onClick={() => setPeriodoSeleccionado(365)}
          >
            Anual
          </button>
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
                          <button
                            onClick={() => {
                              editarCampo(plan.id, clave, tempValor);
                              setEditando(null);
                            }}
                          >
                            Ok
                          </button>
                          <button onClick={() => setEditando(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <span
                          className="clickeable"
                          onClick={() => {
                            setEditando(campoId);
                            setTempValor(valor);
                          }}
                        >
                          {clave === "precio" ? `$${valor.toLocaleString()}` : valor}
                        </span>
                      )}
                    </p>
                  );
                })}

                <p>
                  <strong>Periodicidad:</strong> {plan.periodicidad} días
                </p>

                <div className="boton-guardar-wrapper">
                  <button
                    className="boton-guardar"
                    onClick={() => guardarCambios(plan)}
                    disabled={guardando === plan.id}
                  >
                    {guardando === plan.id ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
