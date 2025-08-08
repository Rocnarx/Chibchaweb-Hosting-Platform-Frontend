import React, { useState } from "react";
import "./Tarjeta.css";
import { useUser } from "../Context/UserContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
registerLocale("es", es);

export default function Tarjeta() {
  const { usuario } = useUser();

  const [form, setForm] = useState({
    numero: "",
    vencimiento: null,
    cvc: "",
    guardar: false,
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoTarjeta, setTipoTarjeta] = useState("");
  const [cargando, setCargando] = useState(false);

  const detectarTipoTarjeta = (numero) => {
    if (/^4/.test(numero)) return "Visa";
    if (/^5/.test(numero) || /^2/.test(numero)) return "Mastercard";
    if (/^34/.test(numero) || /^37/.test(numero)) return "American Express";
    if (/^6/.test(numero)) return "Discover";
    return "";
  };

  const obtenerMaxDigitos = () => {
    switch (tipoTarjeta) {
      case "Visa":
      case "Mastercard":
      case "Discover":
        return 16;
      case "American Express":
        return 15;
      default:
        return 16;
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "numero") {
      const limpio = value.replace(/\D/g, "");
      const tipo = detectarTipoTarjeta(limpio);
      setTipoTarjeta(tipo);
      setForm({ ...form, numero: limpio.slice(0, obtenerMaxDigitos()) });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const numeroLimpio = form.numero.replace(/\D/g, "");
      if (
        isNaN(numeroLimpio) ||
        numeroLimpio.length !== obtenerMaxDigitos()
      ) {
        throw new Error(`Número inválido para una tarjeta ${tipoTarjeta}`);
      }

      if (!form.vencimiento) {
        throw new Error("Selecciona una fecha de vencimiento válida.");
      }

      const mes = String(form.vencimiento.getMonth() + 1).padStart(2, "0");
      const anio = form.vencimiento.getFullYear();

      const tarjetaPayload = {
        idtipotarjeta: 1,
        numerotarjeta: parseInt(numeroLimpio),
        ccv: parseInt(form.cvc),
        fechavto: `${anio}-${mes}-01`,
      };

      const resTarjeta = await fetch(`${import.meta.env.VITE_API_URL}/tarjeta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(tarjetaPayload),
      });

      if (!resTarjeta.ok) {
        const errorData = await resTarjeta.json();
        throw new Error(errorData.detail || "Error al registrar la tarjeta");
      }

      const tarjetaData = await resTarjeta.json();

      const metodoPagoPayload = {
        idtarjeta: String(tarjetaData.idtarjeta),
        idcuenta: String(usuario.idcuenta),
        idtipometodopago: 1,
        activometodopagocuenta: form.guardar,
      };

      const resMetodo = await fetch(`${import.meta.env.VITE_API_URL}/metodopago`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(metodoPagoPayload),
      });

      if (!resMetodo.ok) {
        const errorMetodo = await resMetodo.json();
        throw new Error(errorMetodo.detail || "Error al asociar el método de pago");
      }

      setMensaje("✅ Tarjeta y método de pago guardados correctamente.");
    } catch (error) {
      console.error("Error:", error);
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const obtenerLogoTarjeta = () => {
    switch (tipoTarjeta) {
      case "Visa":
        return "/visa.png";
      case "Mastercard":
        return "/Mastercard.png";
      case "American Express":
        return "/amex.png";
      case "Discover":
        return "/discover.png";
      default:
        return null;
    }
  };

  return (
    <div className="tarjeta-container">
      <h2>Método de Pago</h2>
      <form onSubmit={manejarSubmit} className="tarjeta-formulario">
        <div className="tarjeta-titulo">
          <span className="icono-tarjeta">💳</span> Tarjeta ({tipoTarjeta || "Desconocida"})
          <div className="iconos-marcas">
            {obtenerLogoTarjeta() ? (
              <img src={obtenerLogoTarjeta()} alt={tipoTarjeta} />
            ) : (
              <>
                <img src="/visa.png" alt="Visa" />
                <img src="/Mastercard.png" alt="MasterCard" />
                <img src="/diner.png" alt="Diners" />
              </>
            )}
          </div>
        </div>

        <label>Número de tarjeta</label>
        <input
          type="text"
          name="numero"
          placeholder="123456..."
          value={form.numero}
          onChange={manejarCambio}
          required
        />

        <div className="tarjeta-flex">
          <div>
            <label>Fecha de vencimiento</label>
            <DatePicker
              selected={form.vencimiento}
              onChange={(date) => setForm({ ...form, vencimiento: date })}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              locale="es"
              placeholderText="MM/AAAA"
              className="date-picker"
              minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
              required
            />
          </div>
          <div>
            <label>CVC / CVV</label>
            <input
              type="text"
              name="cvc"
              maxLength={4}
              inputMode="numeric"
              pattern="\d*"
              placeholder="123"
              value={form.cvc}
              onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea dígito
              setForm({ ...form, cvc: soloNumeros });
            }}
            />
          </div>
        </div>

        <label className="guardar-check">
          <input
            type="checkbox"
            name="guardar"
            checked={form.guardar}
            onChange={manejarCambio}
          />
          Guardar este método de pago de forma segura.
          <br />
          <span className="descripcion">
            Tus siguientes compras serán más rápidas, fáciles y cómodas.
          </span>
        </label>

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar tarjeta"}
        </button>
      </form>

      {mensaje && <p className="mensaje-estado">{mensaje}</p>}
    </div>
  );
}
