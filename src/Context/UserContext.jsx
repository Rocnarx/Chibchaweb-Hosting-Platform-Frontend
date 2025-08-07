// src/Context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true); // 🆕 estado de carga

  // ✅ Función para actualizar parcialmente el usuario
  const actualizarUsuario = (nuevosDatos) => {
    setUsuario((prev) => ({ ...prev, ...nuevosDatos }));
  };

  // ✅ Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const datosGuardados = localStorage.getItem("usuario");
    if (datosGuardados) {
      setUsuario(JSON.parse(datosGuardados));
    }
    setCargandoUsuario(false); // ✅ Indica que ya terminó de cargar
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
    <UserContext.Provider
      value={{
        usuario,
        setUsuario,
        actualizarUsuario,
        cerrarSesion,
        cargandoUsuario, // 🆕 exportamos cargandoUsuario
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
