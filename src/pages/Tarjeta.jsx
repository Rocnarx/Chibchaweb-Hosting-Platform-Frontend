import React, { useState } from "react";
import "./Tarjeta.css";
import { useUser } from "../Context/UserContext";

export default function Tarjeta() {
  const { usuario } = useUser();

  const [form, setForm] = useState({
    numero: "",
    vencimiento: "",
    cvc: "",
    guardar: false,
  });

  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      
      const numeroLimpio = form.numero.replace(/\D/g, ""); 
      if (numeroLimpio.length !== 10 || isNaN(numeroLimpio)) {
        throw new Error("Número de tarjeta inválido. Debe tener 10 dígitos numéricos.");
      }

      // Validar fecha vencimiento
      const [mes, anio] = form.vencimiento.split("/");
      if (!mes || !anio || mes.length !== 2 || anio.length !== 2) {
        throw new Error("Fecha de vencimiento inválida (usa el formato MM/AA)");
      }

      const tarjetaPayload = {
        idtipotarjeta: 1, 
        numerotarjeta: parseInt(numeroLimpio),
        ccv: parseInt(form.cvc),
        fechavto: `20${anio}-${mes}-01`,
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
      const idtarjeta = String(tarjetaData.idtarjeta ?? "11"); 

      const metodoPagoPayload = {
        idmetodopagocuenta: "1111111224",
        idtarjeta: idtarjeta,
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

      setMensaje(" Tarjeta y método de pago guardados correctamente.");
    } catch (error) {
      console.error(" Error al guardar tarjeta:", error);
      setMensaje(` ${error.message}`);
    }
  };

  return (
    <div className="tarjeta-container">
      <h2>Método de Pago</h2>
      <form onSubmit={manejarSubmit} className="tarjeta-formulario">
        <div className="tarjeta-titulo">
          <span className="icono-tarjeta">💳</span> Tarjeta
          <div className="iconos-marcas">
            <img src="/visa.png" alt="Visa" />
            <img src="/Mastercard.png" alt="MasterCard" />
          </div>
        </div>

        <label>Número de tarjeta</label>
        <input
          type="text"
          name="numero"
          maxLength={10}
          placeholder="1234567890"
          value={form.numero}
          onChange={manejarCambio}
          required
        />

        <div className="tarjeta-flex">
          <div>
            <label>Fecha de vencimiento</label>
            <input
              type="text"
              name="vencimiento"
              placeholder="MM/AA"
              value={form.vencimiento}
              onChange={manejarCambio}
              required
            />
          </div>
          <div>
            <label>CVC / CVV</label>
            <input
              type="text"
              name="cvc"
              placeholder="123"
              value={form.cvc}
              onChange={manejarCambio}
              required
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

        <button type="submit">Guardar tarjeta</button>
      </form>

      {mensaje && <p className="mensaje-estado">{mensaje}</p>}
    </div>
  );
}
