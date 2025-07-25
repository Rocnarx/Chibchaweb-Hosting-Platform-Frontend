import React, { useState } from "react";
import "./Hero.css";

function Hero() {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <section className="hero-section">
      <h1 className="hero-title">¡Potencia tu presencia online!</h1>
      <p className="hero-subtitle">Encuentra el nombre perfecto para tu sitio web</p>
      <div className="hero-search">
        <div className="input-container">
          <input
            type="text"
            placeholder="tupagina.com"
            className="hero-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button className="clear-button" onClick={handleClear}>
              &times;
            </button>
          )}
        </div>
        <button className="hero-button">Buscar dominio</button>
      </div>
    </section>
  );
}

export default Hero;
