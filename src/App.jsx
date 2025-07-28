import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dominios from './pages/Dominios'
import Carrito from './pages/Carrito'
import Footer from './components/Footer'
import FormularioC from './pages/FormularioRegistroCliente'
import Login from './pages/Login'
import Cuenta from './pages/Cuenta'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './Context/UserContext'

function App() {
  const { usuario } = useUser();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dominios" element={<Dominios />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<FormularioC />} />
        <Route
          path="/perfil"
          element={usuario ? <Cuenta /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App
