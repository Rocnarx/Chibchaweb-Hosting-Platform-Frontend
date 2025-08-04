// src/Context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // ✅ Función para actualizar parcialmente el usuario (solo lo necesario)
  const actualizarUsuario = (nuevosDatos) => {
    setUsuario((prev) => ({ ...prev, ...nuevosDatos }));
  };

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const datosGuardados = localStorage.getItem("usuario");
    if (datosGuardados) {
      setUsuario(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar usuario actualizado en localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, actualizarUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
