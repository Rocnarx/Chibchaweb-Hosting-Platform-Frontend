import "../Components/AlertaFlotante.css";

export default function AlertaFlotante({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div className="alerta-flotante">
      {mensaje}
    </div>
  );
}

