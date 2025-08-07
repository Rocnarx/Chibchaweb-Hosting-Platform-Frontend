import { useEffect, useState } from "react";
import "./AlertaFlotante.css";

function detectarTipo(mensaje) {
  if (!mensaje) return "default";
  if (mensaje.includes("✅")) return "success";
  if (mensaje.includes("❌")) return "error";
  if (mensaje.includes("⚠️")) return "warning";
  if (mensaje.includes("ℹ️")) return "info";
  return "default";
}

export default function AlertaFlotante({ mensaje }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mensaje) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const tipo = detectarTipo(mensaje);

  if (!mensaje && !visible) return null;

  return (
    <div className={`alerta-flotante alerta-${tipo} ${!mensaje ? "alerta-oculta" : ""}`}>
      {mensaje}
    </div>
  );
}
