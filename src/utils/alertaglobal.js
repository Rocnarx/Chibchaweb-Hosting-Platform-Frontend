// src/utils/alertaGlobal.js

let handler = null;

export const setAlertaHandler = (fn) => {
  handler = fn;
};

export const alertaGlobal = (mensaje) => {
  if (handler) {
    handler(mensaje);
  } else {
    console.warn("⚠️ alertaGlobal no está listo todavía.");
  }
};

export const inicializarAlertaGlobal = () => {
  window.alert = alertaGlobal;
};
