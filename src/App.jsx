import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Dominios from './pages/Dominios';
import Carrito from './pages/Carrito';
import Footer from './Components/Footer';
import FormularioC from './pages/FormularioRegistroCliente';
import FormularioD from './pages/FormularioRegistroDistribuidor';
import FormularioE from './pages/FormularioRegistroEmpleado';
import Login from './pages/Login';
import Cuenta from './pages/Cuenta';
import Tarjeta from './pages/Tarjeta';
import Soporte from './pages/Soporte';
import MetodosPago from './pages/MetodosPago';
import Extensiones from './pages/Extensiones';
import Comisiones from './pages/Comisiones';
import VistaSoporteEmpleado from './pages/VistaSoporteEmpleado';
import DominiosAdquiridos from './pages/DominiosAdquiridos';
import ConfirmarCuenta from './pages/ConfirmarCuenta';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUser } from './Context/UserContext';
import RutaProtegida from './Components/RutaProtegida';

function App() {
  const { usuario } = useUser();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dominios" element={<Dominios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<FormularioC />} />
        <Route path="/registroDistribuidor" element={<FormularioD />} />
        <Route path="/registroEmpleado" element={<FormularioE />} />
        <Route path="/extensiones" element={<Extensiones />} />
        <Route path="/verificar" element={<ConfirmarCuenta />} />
        {/* RUTAS PROTEGIDAS */}
        <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
        <Route path="/tarjeta" element={<RutaProtegida><Tarjeta /></RutaProtegida>} />
        <Route path="/metodos" element={<RutaProtegida><MetodosPago /></RutaProtegida>} />
        <Route path="/DominiosAdquiridos" element={<RutaProtegida><DominiosAdquiridos /></RutaProtegida>} />
        <Route path="/perfil" element={<RutaProtegida><Cuenta /></RutaProtegida>} />
        <Route path="/soporte" element={<RutaProtegida><Soporte /></RutaProtegida>} />
        <Route path="/panel-soporte" element={<RutaProtegida><VistaSoporteEmpleado /></RutaProtegida>} />
        <Route path="/comisiones" element={<Comisiones />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
