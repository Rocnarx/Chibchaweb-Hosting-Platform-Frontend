import { createContext, useContext, useEffect, useState } from "react";

const ExtensionContext = createContext();

export function ExtensionProvider({ children }) {
  const [precios, setPrecios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const res = await fetch(`${API_URL}/precios-extensiones`, {
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": API_KEY,
          },
        });

        const text = await res.text();
        console.log("🔴 Respuesta del backend:", text);

        if (!res.ok) {
          const errorData = JSON.parse(text);
          throw new Error(errorData.detail || "Error desconocido");
        }

        const data = JSON.parse(text);
        setPrecios(data);
      } catch (err) {
        setError("❌ " + err.message);
        console.error("Error al cargar precios:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchPrecios();
  }, []);

  const actualizarPrecio = (ext, nuevoPrecio) => {
    setPrecios((prev) => ({
      ...prev,
      [ext]: Number(nuevoPrecio),
    }));
  };

  const guardarPrecios = async () => {
    try {
      const res = await fetch(`${API_URL}/precios-extensiones`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": API_KEY,
        },
        body: JSON.stringify(precios),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("🔴 Error al guardar:", text);
        throw new Error("Error al guardar precios");
      }

      alert("✅ Precios guardados correctamente.");
    } catch (err) {
      console.error("Error al guardar precios:", err);
      alert("❌ Error al guardar precios.");
    }
  };

  return (
    <ExtensionContext.Provider
      value={{ precios, actualizarPrecio, guardarPrecios, cargando, error }}
    >
      {children}
    </ExtensionContext.Provider>
  );
}

export function usePreciosExtensiones() {
  return useContext(ExtensionContext);
}
