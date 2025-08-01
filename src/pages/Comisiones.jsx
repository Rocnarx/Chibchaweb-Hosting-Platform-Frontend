import React, { useState } from "react";
import "./Comisiones.css";

export default function Comisiones() {
  const [planes, setPlanes] = useState({
    basico: { dominios: 100, comision: 10 },
    premium: { dominios: 200, comision: 15 },
  });

  const [editando, setEditando] = useState(null);
  const [tempValor, setTempValor] = useState("");

  const editarCampo = (plan, campo, valor) => {
    setPlanes({
      ...planes,
      [plan]: {
        ...planes[plan],
        [campo]: Number(valor),
      },
    });
  };

  const planesRender = [
    { id: "basico", nombre: "Plan Básico" },
    { id: "premium", nombre: "Plan Premium" },
  ];

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
                <p>
                  <strong>Dominios:</strong>{" "}
                  {editando === `${id}-dominios` ? (
                    <div className="editor-campo">
                      Menos de{" "}
                      <input
                        type="number"
                        value={tempValor}
                        onChange={(e) => setTempValor(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editarCampo(id, "dominios", tempValor);
                          setEditando(null);
                        }}
                      >
                        Ok
                      </button>
                    </div>
                  ) : (
                    <span
                      className="clickeable"
                      onClick={() => {
                        setEditando(`${id}-dominios`);
                        setTempValor(plan.dominios);
                      }}
                    >
                      Menos de <strong>{plan.dominios}</strong>
                    </span>
                  )}
                </p>
                <p>
                  <strong>Comisión:</strong>{" "}
                  {editando === `${id}-comision` ? (
                    <div className="editor-campo">
                      <input
                        type="number"
                        value={tempValor}
                        onChange={(e) => setTempValor(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      %{" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editarCampo(id, "comision", tempValor);
                          setEditando(null);
                        }}
                      >
                        Ok
                      </button>
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
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
