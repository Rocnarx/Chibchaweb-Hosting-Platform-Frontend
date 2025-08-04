import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

// Componentes comunes
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";

// Componentes para clientes
import Home from "./pages/Home";
import Dominios from "./pages/Dominios";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import FormularioC from "./pages/FormularioRegistroCliente";
import Cuenta from "./pages/Cuenta";
import Tarjeta from "./pages/Tarjeta";
import MetodosPago from "./pages/MetodosPago";

// Componentes compartidos
import FormularioD from "./pages/FormularioRegistroDistribuidor";
import FormularioE from "./pages/FormularioRegistroEmpleado";
import Soporte from "./pages/Soporte";
import Comisiones from "./pages/Comisiones";
import VistaSoporteEmpleado from "./pages/VistaSoporteEmpleado";
import DominiosAdquiridos from "./pages/DominiosAdquiridos";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";

// Componentes para administrador
import AdminNavbar from "./Components/NavbarAdmin";
import Extensiones from "./pages/Extensiones";
import FooterAdmin from "./Components/FooterAdmin";
import ClientesAdmin from "./pages/ClientesAdmin";
import ClienteDetalle from "./pages/ClienteDetalle";
import DistribuidoresAdmin from "./pages/DistribuidorAdmin"; // ← Nuevo
import PlanesHosting from './pages/PlanesHosting';

import RutaProtegida from './Components/RutaProtegida';

function App() {
  const { usuario } = useUser();
  const esAdmin = usuario?.tipocuenta === "ADMIN";

  return (
    <>
      {/* Navbar dinámico */}
      {usuario ? (esAdmin ? <AdminNavbar /> : <Navbar />) : <Navbar />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<FormularioC />} />
        <Route path="/registroDistribuidor" element={<FormularioD />} />
        <Route path="/registroEmpleado" element={<FormularioE />} />
        <Route path="/verificar" element={<ConfirmarCuenta />} />
        <Route path="/planesHosting" element={<PlanesHosting />} />

        {/* Rutas protegidas comunes */}
        <Route path="/perfil" element={<RutaProtegida><Cuenta /></RutaProtegida>} />
        <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
        <Route path="/tarjeta" element={<RutaProtegida><Tarjeta /></RutaProtegida>} />
        <Route path="/metodos" element={<RutaProtegida><MetodosPago /></RutaProtegida>} />
        <Route path="/DominiosAdquiridos" element={<RutaProtegida><DominiosAdquiridos /></RutaProtegida>} />
        <Route path="/soporte" element={<RutaProtegida><Soporte /></RutaProtegida>} />
        <Route path="/panel-soporte" element={<RutaProtegida><VistaSoporteEmpleado /></RutaProtegida>} />
        <Route path="/comisiones" element={<RutaProtegida><Comisiones /></RutaProtegida>} />

        {/* Rutas solo para administrador */}
        {esAdmin && <Route path="/extensiones" element={<Extensiones />} />}
        {esAdmin && <Route path="/ClientesAdmin" element={<ClientesAdmin />} />}
        {esAdmin && <Route path="/DistribuidoresAdmin" element={<DistribuidoresAdmin />} />} {/* Nueva ruta */}
        {esAdmin && <Route path="/clientes/:correo" element={<ClienteDetalle />} />}

        {/* Rutas exclusivas para clientes */}
        {!esAdmin && <Route path="/dominios" element={<Dominios />} />}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer dinámico */}
      {usuario ? (esAdmin ? <FooterAdmin /> : <Footer />) : <Footer />}
    </>
  );
}

export default App;
