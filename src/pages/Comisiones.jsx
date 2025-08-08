import React, { useState, useEffect } from "react";
import "./Comisiones.css";

export default function Comisiones() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [planes, setPlanes] = useState({
    basico: null,
    premium: null,
  });

  const [editando, setEditando] = useState(null);
  const [tempValor, setTempValor] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // 🔄 Cargar planes
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/Planes?idplan=1`, {
          headers: { "Chibcha-api-key": API_KEY },
        }),
        fetch(`${API_URL}/Planes?idplan=2`, {
          headers: { "Chibcha-api-key": API_KEY },
        }),
      ]);

      if (!res1.ok || !res2.ok) throw new Error("Respuesta inválida");

      const datos1 = await res1.json();
      const datos2 = await res2.json();

      console.log("Datos plan 1:", datos1);
      console.log("Datos plan 2:", datos2);

      setPlanes({
        basico: {
          dominios: datos1.limitedominios,
          comision: datos1.comision,
        },
        premium: {
          dominios: datos2.limitedominios,
          comision: datos2.comision,
        },
      });
    } catch (error) {
      console.error("Error cargando planes:", error);
      alert("No se pudo cargar la información de los planes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const editarCampo = (plan, campo, valor) => {
    setPlanes((prev) => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [campo]: Number(valor),
      },
    }));
  };

  const guardarCambios = async () => {
    try {
      const respuestas = await Promise.all([
        fetch(`${API_URL}/modificar-comision`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": API_KEY,
          },
          body: JSON.stringify({
            idplan: "1",
            comision: planes.basico.comision,
            limitedominios: planes.basico.dominios,
          }),
        }),
        fetch(`${API_URL}/modificar-comision`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": API_KEY,
          },
          body: JSON.stringify({
            idplan: "2",
            comision: planes.premium.comision,
            limitedominios: planes.premium.dominios,
          }),
        }),
      ]);

      if (respuestas.every((res) => res.ok)) {
        setGuardado(true);
        setEditando(null);
        await cargarDatos(); // 🔄 actualizar datos
        setTimeout(() => setGuardado(false), 2000);
      } else {
        alert("Error al guardar en el servidor.");
      }
    } catch (error) {
      console.error("Error al guardar comisiones:", error);
      alert("Error al guardar los cambios.");
    }
  };

  const planesRender = [
    { id: "basico", nombre: "Plan Básico" },
    { id: "premium", nombre: "Plan Premium" },
  ];

  if (cargando || !planes.basico || !planes.premium) {
    return (
      <div className="comisiones-wrapper">
        <div className="comisiones-contenedor">
          <h1>Comisiones Distribuidores</h1>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comisiones-wrapper">
      <div className="comisiones-contenedor">
        <h1>Comisiones Distribuidores</h1>
        <p>Haz clic en un valor para editarlo</p>

        <div className="comisiones-grid">
          {planesRender.map(({ id, nombre }) => {
            const plan = planes[id];
            return (
              <div key={id} className="comision-card">
                <h2>{nombre}</h2>
                <hr />

                {/* DOMINIOS */}
                <div>
                  <strong>Dominios:</strong>{" "}
                  {editando === `${id}-dominios` ? (
                    <div className="editor-campo">
                      Menos de{" "}
                      <input
                        type="number"
                        value={tempValor ?? ""}
                        onChange={(e) => setTempValor(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          editarCampo(id, "dominios", tempValor);
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
                        setEditando(`${id}-dominios`);
                        setTempValor(plan.dominios);
                      }}
                    >
                      Más de <strong>{plan.dominios}</strong>
                    </span>
                  )}
                </div>

                {/* COMISIÓN */}
                <div>
                  <strong>Comisión:</strong>{" "}
                  {editando === `${id}-comision` ? (
                    <div className="editor-campo">
                      <input
                        type="number"
                        value={tempValor ?? ""}
                        onChange={(e) => setTempValor(e.target.value)}
                      />
                      %{" "}
                      <button
                        onClick={() => {
                          editarCampo(id, "comision", tempValor);
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
                        setEditando(`${id}-comision`);
                        setTempValor(plan.comision);
                      }}
                    >
                      <strong>{plan.comision}</strong>%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="boton-guardar-wrapper">
          <button className="boton-guardar-global" onClick={guardarCambios}>
            Guardar todos los cambios
          </button>
          {guardado && <p className="mensaje-guardado">¡Cambios guardados!</p>}
        </div>
      </div>
    </div>
  );
}
