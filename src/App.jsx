import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dominios from './pages/Dominios'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dominios" element={<Dominios />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
