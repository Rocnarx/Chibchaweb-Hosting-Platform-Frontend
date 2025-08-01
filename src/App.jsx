import Navbar from './Components/Navbar'
import Home from './pages/Home'
import Dominios from './pages/Dominios'
import Carrito from './pages/Carrito'
import Footer from './Components/Footer'
import FormularioC from './pages/FormularioRegistroCliente'
import FormularioD from './pages/FormularioRegistroDistribuidor'
import FormularioE from './pages/FormularioRegistroEmpleado'
import Login from './pages/Login'
import Cuenta from './pages/Cuenta'
import Tarjeta from './pages/Tarjeta'
import MetodosPago from './pages/MetodosPago'
import Extensiones from './pages/Extensiones';

import Comisiones from './pages/Comisiones';


import DominiosAdquiridos from './pages/DominiosAdquiridos';
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
        <Route path="/registroDistribuidor" element={<FormularioD />} />
        <Route path="/registroEmpleado" element={<FormularioE />} />
        <Route path="/tarjeta" element={<Tarjeta />} />
        <Route path="/metodos" element={<MetodosPago />} />
        <Route path="/comisiones" element={<Comisiones />} />
        <Route path="/extensiones" element={<Extensiones />} />
        <Route path="/DominiosAdquiridos" element={<DominiosAdquiridos />} />
        
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
