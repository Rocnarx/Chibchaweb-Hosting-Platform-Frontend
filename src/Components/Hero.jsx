import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'


function Hero() {
  const [dominio, setDominio] = useState('')
  const navigate = useNavigate()

  const handleBuscar = () => {
    if (dominio.trim() !== '') {
      navigate(`/dominios?nombre=${encodeURIComponent(dominio.trim())}`)
    }
  }

  return (
    <section className="hero-section">
      <h1 className="hero-title">¡Potencia tu presencia online!</h1>
      <p className="hero-subtitle">Encuentra el nombre perfecto para tu sitio web</p>
      <div className="hero-search">
        <input
          type="text"
          placeholder="tusitio.com"
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
