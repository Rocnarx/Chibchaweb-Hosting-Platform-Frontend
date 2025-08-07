import { createContext, useContext, useEffect, useState } from "react";
import { setAlertaHandler, inicializarAlertaGlobal } from "../utils/alertaglobal";
import AlertaFlotante from "../Components/AlertaFlotante";

const AlertaContext = createContext();

export function AlertaProvider({ children }) {
  const [mensaje, setMensaje] = useState("");

  const mostrarAlerta = (texto) => {
    setMensaje(texto);
    // NO borrar aquí, se maneja en el componente
  };

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

export function useAlerta() {
  return useContext(AlertaContext);
}
