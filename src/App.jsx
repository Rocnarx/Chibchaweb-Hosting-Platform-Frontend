import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dominios from './pages/Dominios'
import Carrito from './pages/Carrito'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dominios" element={<Dominios />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
