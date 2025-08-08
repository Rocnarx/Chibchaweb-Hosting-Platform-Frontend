import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const [data, setData] = useState(() => {
    // Hidratar desde localStorage (opcional)
    try {
      const raw = localStorage.getItem("stats_cache");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ts, setTs] = useState(() => data?.ts ? new Date(data.ts) : null);
  const inflight = useRef(false);

  const currency = (n) =>
    typeof n === "number" ? `$${n.toLocaleString("es-CO")}` : n === 0 ? "$0" : "-";
  const numberf = (n) => (typeof n === "number" ? n.toLocaleString("es-CO") : "-");

  const fetchAll = async () => {
    if (inflight.current) return;        // evita duplicados
    inflight.current = true;
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env.VITE_API_URL;
      const key = import.meta.env.VITE_API_KEY;
      const headers = { "Chibcha-api-key": key };

      const [r1, r2, r3, r4] = await Promise.all([
        fetch(`${base}/reporte/admin/comisiones-distribuidores`, { headers }),
        fetch(`${base}/reporte/admin/ventas`, { headers }),
        fetch(`${base}/reporte/admin/ingresos`, { headers }),
        fetch(`${base}/reporte/admin/usuarios`, { headers }),
      ]);
      if (!r1.ok || !r2.ok || !r3.ok || !r4.ok) {
        const status = [r1, r2, r3, r4].map((r) => r.status).join(", ");
        throw new Error(`Error al consultar endpoints (HTTP ${status})`);
      }
      const [comisiones, ventas, ingresos, usuarios] = await Promise.all([
        r1.json(), r2.json(), r3.json(), r4.json()
      ]);

      const payload = {
        comisiones, ventas, ingresos, usuarios,
        ts: new Date().toISOString(),
      };
      setData(payload);
      setTs(new Date(payload.ts));
      localStorage.setItem("stats_cache", JSON.stringify(payload)); // cache
    } catch (e) {
      setError(e?.message || "No se pudieron cargar las estadísticas.");
    } finally {
      inflight.current = false;
      setLoading(false);
    }
  };

  // TTL: refrescar si el cache tiene más de 5 min
  const preload = async () => {
    const ttlMs = 5 * 60 * 1000;
    const last = data?.ts ? new Date(data.ts).getTime() : 0;
    if (!last || Date.now() - last > ttlMs) {
      await fetchAll();
    }
  };

  const refresh = fetchAll; // alias público

  const value = {
    data, loading, error, ts, currency, numberf,
    preload, refresh,
    // acceso directo cómodo:
    comisiones: data?.comisiones || null,
    ventas: data?.ventas || null,
    ingresos: data?.ingresos || null,
    usuarios: data?.usuarios || null,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats debe usarse dentro de <StatsProvider>");
  return ctx;
}
