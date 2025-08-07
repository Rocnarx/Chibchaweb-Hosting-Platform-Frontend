import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from './Context/UserContext';

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
import PaqueteAdquirido from "./pages/PaqueteAdquirido";


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
import DistribuidoresAdmin from "./pages/DistribuidorAdmin";
import PlanesHosting from "./pages/PlanesHosting";
import PaquetesAdmin from "./pages/PaquetesAdmin";
import PostuladoDetalle from "./pages/PostuladoDetalle";
import PostuladosAdmin from "./pages/PostuladosAdmin";
import EmpleadosAdmin from "./pages/EmpleadosAdmin";
import EmpleadoDetalle from "./pages/EmpleadoDetalle";
import CoordinadoresAdmin from "./pages/CoordinadoresAdmin";
import VistaSoporteAdmin from "./pages/VistaSoporteAdmin";

// Componentes para coordinadores
import NavbarCoordinador from "./Components/NavbarCoordinador";
import FooterCoordinador from "./Components/FooterCoordinador";
import TicketsCoordinador from "./pages/TicketsCoordinador";
import AsignarTickets from "./pages/AsignarTickets";

// Página para POSTULADO
import CuentaPostulado from "./pages/CuentaPostulado";

// Ruta protegida
import RutaProtegida from "./Components/RutaProtegida";

import './styles.css';

function App() {
  const { usuario, cargandoUsuario } = useUser();

  const esAdmin = usuario?.tipocuenta === "ADMIN";
  const esCoordinador =
    ["COORDINADOR NIVEL 1", "COORDINADOR NIVEL 2", "COORDINADOR NIVEL 3"].includes(usuario?.tipocuenta);

  if (cargandoUsuario) {
    return <div className="pantalla-cargando">Cargando...</div>;
  }

  if (usuario?.tipocuenta === "POSTULADO") {
    return <CuentaPostulado />;
  }

  return (
    <div className={`app-layout ${esAdmin ? 'admin-layout' : ''}`}>
      {/* Navbar dinámica */}
      {usuario ? (
        esAdmin ? <AdminNavbar /> :
        esCoordinador ? <NavbarCoordinador /> :
        <Navbar />
      ) : <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<FormularioC />} />
          <Route path="/registroDistribuidor" element={<FormularioD />} />
          <Route path="/registroEmpleado" element={<FormularioE />} />
          <Route path="/verificar" element={<ConfirmarCuenta />} />
          <Route path="/planesHosting" element={<PlanesHosting />} />
          <Route path="/paquetes" element={<PaquetesAdmin />} />
          <Route path="/vista-soporte-empleado" element={<VistaSoporteEmpleado />} />
          <Route path="/vista-soporte-admin" element={<VistaSoporteAdmin />} />

          {/* Rutas protegidas comunes */}
          <Route path="/perfil" element={<RutaProtegida><Cuenta /></RutaProtegida>} />
          <Route path="/carrito" element={<RutaProtegida requiereVerificacion={true}><Carrito /></RutaProtegida>} />
          <Route path="/tarjeta" element={<RutaProtegida><Tarjeta /></RutaProtegida>} />
          <Route path="/metodos" element={<RutaProtegida><MetodosPago /></RutaProtegida>} />
          <Route path="/DominiosAdquiridos" element={<RutaProtegida><DominiosAdquiridos /></RutaProtegida>} />
          <Route path="/soporte" element={<RutaProtegida><Soporte /></RutaProtegida>} />
          <Route path="/comisiones" element={<RutaProtegida><Comisiones /></RutaProtegida>} />

          {/* Rutas solo para administrador */}
          {esAdmin && <Route path="/extensiones" element={<Extensiones />} />}
          {esAdmin && <Route path="/ClientesAdmin" element={<ClientesAdmin />} />}
          {esAdmin && <Route path="/DistribuidoresAdmin" element={<DistribuidoresAdmin />} />}
          {esAdmin && <Route path="/clientes/:correo" element={<ClienteDetalle />} />}
          {esAdmin && <Route path="/PostuladosAdmin" element={<PostuladosAdmin />} />}
          {esAdmin && <Route path="/EmpleadosAdmin" element={<EmpleadosAdmin />} />}
          {esAdmin && <Route path="/CoordinadoresAdmin" element={<CoordinadoresAdmin />} />}
          {esAdmin && <Route path="/postulado/:correo" element={<PostuladoDetalle />} />}
          {esAdmin && <Route path="/empleados/:correo" element={<EmpleadoDetalle />} />}

          {/* Rutas exclusivas para coordinadores */}
          {esCoordinador && <Route path="/tickets" element={<TicketsCoordinador />} />}
          {esCoordinador && <Route path="/asignar-tickets" element={<AsignarTickets />} />}

          {/* Rutas exclusivas para clientes */}
          {!esAdmin && !esCoordinador && <Route path="/dominios" element={<Dominios />} />}
          {!esAdmin && !esCoordinador && <Route path="/paquete-adquirido" element={<PaqueteAdquirido />} />}


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer dinámico */}
      {usuario ? (
        esAdmin ? <FooterAdmin /> :
        esCoordinador ? <FooterCoordinador /> :
        <Footer />
      ) : <Footer />}
    </div>
  );
}

export default App;
