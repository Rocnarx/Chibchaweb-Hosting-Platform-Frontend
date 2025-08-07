import { createContext, useContext, useEffect, useState } from "react";
import { setAlertaHandler, inicializarAlertaGlobal } from "../utils/alertaglobal";
import AlertaFlotante from "../Components/AlertaFlotante";

// Crear contexto
const AlertaContext = createContext();

// Proveedor global
export function AlertaProvider({ children }) {
  const [mensaje, setMensaje] = useState("");

  // Función principal que muestra el mensaje
  const mostrarAlerta = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  // Conectar con sistema global (window.alert)
  useEffect(() => {
    setAlertaHandler(mostrarAlerta);
    inicializarAlertaGlobal();
  }, []);

  return (
    <AlertaContext.Provider value={{ mostrarAlerta }}>
      {children}
      <AlertaFlotante mensaje={mensaje} />
    </AlertaContext.Provider>
  );
}

// Hook para usar manualmente en componentes si quieres
export function useAlerta() {
  return useContext(AlertaContext);
}
