import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

// Componentes comunes
import Footer from "./Components/Footer";

// Componentes para clientes
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Dominios from "./pages/Dominios";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import FormularioC from "./pages/FormularioRegistroCliente";
import Cuenta from "./pages/Cuenta";
import Tarjeta from "./pages/Tarjeta";
import MetodosPago from "./pages/MetodosPago";

// Componentes para distribuidores y otros
import FormularioD from "./pages/FormularioRegistroDistribuidor";
import FormularioE from "./pages/FormularioRegistroEmpleado";
import Soporte from "./pages/Soporte";
import Comisiones from "./pages/Comisiones";
import VistaSoporteEmpleado from "./pages/VistaSoporteEmpleado";
import DominiosAdquiridos from "./pages/DominiosAdquiridos";

// Componentes para administrador
import AdminNavbar from "./Components/NavbarAdmin";
import Extensiones from "./pages/Extensiones";
import FooterAdmin from "./Components/FooterAdmin";
import ClientesAdmin from "./pages/ClientesAdmin";
import ClienteDetalle from "./pages/ClienteDetalle";
import PlanesHosting from './pages/PlanesHosting';

function App() {
  const { usuario } = useUser();
  const esAdmin = usuario?.tipocuenta === "ADMIN";

  return (
    <>
      {/* Navbar según el tipo de cuenta */}
      {usuario ? (esAdmin ? <AdminNavbar /> : <Navbar />) : <Navbar />}

      <Routes>
        {/* Rutas accesibles para todos */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<FormularioC />} />
        <Route path="/registroDistribuidor" element={<FormularioD />} />
        <Route path="/registroEmpleado" element={<FormularioE />} />
        <Route path="/planesHosting" element={<PlanesHosting />} />

        {/* Rutas exclusivas para clientes (no admin) */}
        {!esAdmin && (
          <>
            <Route path="/dominios" element={<Dominios />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/tarjeta" element={<Tarjeta />} />
            <Route path="/metodos" element={<MetodosPago />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/comisiones" element={<Comisiones />} />
            <Route path="/panel-soporte" element={<VistaSoporteEmpleado />} />
            <Route path="/DominiosAdquiridos" element={<DominiosAdquiridos />} />
          </>
        )}

        {/* Ruta protegida (clientes o admin logueados) */}
        <Route
          path="/perfil"
          element={usuario ? <Cuenta /> : <Navigate to="/login" />}
        />

        {/* Rutas exclusivas para administrador */}
        {esAdmin && <Route path="/extensiones" element={<Extensiones />} />}
        {esAdmin && <Route path="/ClientesAdmin" element={<ClientesAdmin />} />}
        {esAdmin && <Route path="/clientes/:correo" element={<ClienteDetalle />} />}

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer según el tipo de cuenta */}
      {usuario ? (esAdmin ? <FooterAdmin /> : <Footer />) : <Footer />}
    </>
  );
}

export default App;
