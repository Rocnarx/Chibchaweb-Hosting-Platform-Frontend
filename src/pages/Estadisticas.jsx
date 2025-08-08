import React, { useMemo } from "react";
import "./Estadisticas.css";
import { useStats } from "../Context/StatsContext";

export default function Estadisticas() {
  const {
    comisiones,
    ventas,
    ingresos,
    usuarios,
    loading,
    error,
    ts,
    refresh,
  } = useStats();

  const currency = (n) =>
    typeof n === "number" ? `$${n.toLocaleString("es-CO")}` : n === 0 ? "$0" : "-";
  const numberf = (n) => (typeof n === "number" ? n.toLocaleString("es-CO") : "-");

  const porcentajeCompran = useMemo(() => {
    if (!usuarios) return null;
    const { total_clientes_registrados: total, total_clientes_con_compras: con } = usuarios;
    if (!total || total === 0) return 0;
    return Math.round((con / total) * 100);
  }, [usuarios]);

  // ===== Cálculos para Resumen de ventas =====
  const domCli = ventas?.dominios_a_clientes ?? 0;
  const domDist = ventas?.dominios_a_distribuidores ?? 0;
  const totalDom = ventas?.total_dominios_vendidos ?? 0;
  const packs = ventas?.paquetes_vendidos ?? 0;

  const pctCli = totalDom ? Math.round((domCli / totalDom) * 100) : 0;
  const pctDist = totalDom ? Math.round((domDist / totalDom) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Estadísticas</h2>
        <div className="header-actions">
          {ts && <span className="last-update">Actualizado: {new Date(ts).toLocaleString("es-CO")}</span>}
          <button className="btn-refresh" onClick={refresh} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {error && <div className="stats-error">⚠️ {error}</div>}

      {/* ======== GRID PRINCIPAL DE KPIs ======== */}
      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-title">Ingresos (Total general)</div>
          <div className="kpi-value">{currency(ingresos?.total_general)}</div>
          <div className="kpi-sub">
            Último mes: <strong>{currency(ingresos?.total_ultimo_mes)}</strong>
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-title">Comisiones distribuidores</div>
          <div className="kpi-value">{currency(comisiones?.comisiones_distribuidores)}</div>
          <div className="kpi-sub">Acumulado</div>
        </article>

        <article className="kpi-card">
          <div className="kpi-title">Dominios vendidos</div>
          <div className="kpi-value">{numberf(ventas?.total_dominios_vendidos)}</div>
          <div className="kpi-sub">
            Clientes: <strong>{numberf(ventas?.dominios_a_clientes)}</strong> ·{" "}
            Dist: <strong>{numberf(ventas?.dominios_a_distribuidores)}</strong>
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-title">Paquetes vendidos</div>
          <div className="kpi-value">{numberf(ventas?.paquetes_vendidos)}</div>
          <div className="kpi-sub">Total histórico</div>
        </article>
      </section>

      {/* ======== DETALLE DE INGRESOS ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Desglose de ingresos</h3>
        </div>
        <div className="panel-grid">
          <div className="panel-item">
            <span className="label">Por dominios a clientes</span>
            <span className="value">{currency(ingresos?.por_dominios_clientes)}</span>
          </div>
          <div className="panel-item">
            <span className="label">Por dominios a distribuidores</span>
            <span className="value">{currency(ingresos?.por_dominios_distribuidores)}</span>
          </div>
          <div className="panel-item">
            <span className="label">Por venta de paquetes</span>
            <span className="value">{currency(ingresos?.por_venta_paquetes)}</span>
          </div>
        </div>
      </section>

      {/* ======== USUARIOS / DISTRIBUIDORES ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Usuarios</h3>
        </div>
        <div className="panel-grid">
          <div className="panel-item">
            <span className="label">Clientes registrados</span>
            <span className="value">{numberf(usuarios?.total_clientes_registrados)}</span>
          </div>
          <div className="panel-item">
            <span className="label">Clientes con compras</span>
            <span className="value">
              {numberf(usuarios?.total_clientes_con_compras)}
              {typeof porcentajeCompran === "number" && (
                <span className="chip">{porcentajeCompran}%</span>
              )}
            </span>
          </div>
          <div className="panel-item">
            <span className="label">Distribuidor que más compró</span>
            <span className="value">{usuarios?.distribuidor_mas_compro || "-"}</span>
          </div>
          <div className="panel-item">
            <span className="label">Distribuidor que menos compró</span>
            <span className="value">{usuarios?.distribuidor_menos_compro || "-"}</span>
          </div>
        </div>
      </section>

      {/* ======== RESUMEN DE VENTAS (nuevo diseño) ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Resumen de ventas</h3>
        </div>

        <div className="resumen-ventas-grid">
          {/* Dominios a clientes */}
          <article className="resumen-card">
            <div className="resumen-card-header">
              <span className="resumen-icon">👤</span>
              <h4>Dominios a clientes</h4>
            </div>
            <div className="resumen-value">{numberf(domCli)}</div>
            <div className="resumen-sub">Participación</div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${pctCli}%` }} />
            </div>
            <div className="bar-legend">
              <span>{pctCli}%</span>
              <span>de {numberf(totalDom)} dominios</span>
            </div>
          </article>

          {/* Dominios a distribuidores */}
          <article className="resumen-card">
            <div className="resumen-card-header">
              <span className="resumen-icon">🏷️</span>
              <h4>Dominios a distribuidores</h4>
            </div>
            <div className="resumen-value">{numberf(domDist)}</div>
            <div className="resumen-sub">Participación</div>
            <div className="bar">
              <div className="bar-fill alt" style={{ width: `${pctDist}%` }} />
            </div>
            <div className="bar-legend">
              <span>{pctDist}%</span>
              <span>de {numberf(totalDom)} dominios</span>
            </div>
          </article>

          {/* Total dominios */}
          <article className="resumen-card highlight">
            <div className="resumen-card-header">
              <span className="resumen-icon">🌐</span>
              <h4>Total dominios vendidos</h4>
            </div>
            <div className="resumen-value big">{numberf(totalDom)}</div>
            <div className="pill-row">
              <span className="pill">Clientes: {numberf(domCli)}</span>
              <span className="pill">Distribuidores: {numberf(domDist)}</span>
            </div>
          </article>

          {/* Paquetes */}
          <article className="resumen-card">
            <div className="resumen-card-header">
              <span className="resumen-icon">📦</span>
              <h4>Paquetes vendidos</h4>
            </div>
            <div className="resumen-value">{numberf(packs)}</div>
            <div className="resumen-sub">Total histórico</div>
          </article>
        </div>
      </section>
    </div>
  );
}
