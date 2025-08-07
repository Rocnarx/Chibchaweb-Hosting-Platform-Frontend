// src/Context/AlertaContext.jsx
import { createContext, useContext, useState } from "react";
import AlertaFlotante from "../Components/AlertaFlotante";

const AlertaContext = createContext();

export function AlertaProvider({ children }) {
  const [mensaje, setMensaje] = useState("");

  const mostrarAlerta = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

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
