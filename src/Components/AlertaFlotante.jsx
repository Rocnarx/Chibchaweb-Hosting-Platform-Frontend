import { useEffect, useRef, useState } from "react";
import "../Components/AlertaFlotante.css";

export default function AlertaFlotante({ mensaje }) {
  const [visible, setVisible] = useState(false);
  const refAlerta = useRef(null);

  useEffect(() => {
    if (mensaje) {
      // Reinicia clase para forzar animación
      setVisible(false); // Oculta primero
      requestAnimationFrame(() => {
        setVisible(true); // Luego vuelve a mostrarlo
      });

      const timeout = setTimeout(() => {
        setVisible(false);
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  if (!mensaje) return null;

  return (
    <div
      ref={refAlerta}
      className={`alerta-flotante ${visible ? "visible" : ""}`}
    >
      {mensaje}
    </div>
  );
}
