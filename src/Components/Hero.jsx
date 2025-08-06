import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const [dominio, setDominio] = useState('')
  const [tipoDominio, setTipoDominio] = useState('normal') // ← para saber si es IA
  const navigate = useNavigate()

  const handleBuscar = () => {
    if (dominio.trim() !== '') {
      navigate(`/dominios?nombre=${encodeURIComponent(dominio.trim())}&tipo=${tipoDominio}`)
    }
  }

  return (
    <section className={`hero-section ${tipoDominio === 'ia' ? 'modo-ia' : ''}`}>
      <h1 className="hero-title">¡Potencia tu presencia online!</h1>
      <p className="hero-subtitle">Encuentra el nombre perfecto para tu sitio web</p>

      {/* Selector de tipo de dominio */}
      <div className="hero-toggle">
        <button
          className={tipoDominio === 'normal' ? 'activo' : ''}
          onClick={() => setTipoDominio('normal')}
        >
          Dominio específico
        </button>
        <button
          className={tipoDominio === 'ia' ? 'activo' : ''}
          onClick={() => setTipoDominio('ia')}
        >
          Generar Dominio con IA
        </button>
      </div>

      {/* Input + botón */}
      <div className="hero-search">
        <input
          type="text"
          placeholder={tipoDominio === 'ia' ? "Describe tu idea..." : "tusitio.com"}
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="hero-input"
        />
        <button className="hero-button" onClick={handleBuscar}>
          Buscar dominio
        </button>
      </div>
    </section>
  )
}

export default Hero
