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

// Componentes para administrador
import AdminNavbar from "./Components/NavbarAdmin";
import Extensiones from "./pages/Extensiones";
import FooterAdmin from "./Components/FooterAdmin";
import ClientesAdmin from "./pages/ClientesAdmin";
import ClienteDetalle from "./pages/ClienteDetalle";
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

        {/* Rutas exclusivas para clientes */}
        {!esAdmin && (
          <>
            <Route path="/dominios" element={<Dominios />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/tarjeta" element={<Tarjeta />} />
            <Route path="/metodos" element={<MetodosPago />} />
          </>
        )}

        {/* Ruta protegida (clientes o admin logueados) */}
        <Route
          path="/perfil"
          element={usuario ? <Cuenta /> : <Navigate to="/login" />}
        />

        {/* Rutas exclusivas para administrador */}
        {esAdmin && (
          <Route path="/extensiones" element={<Extensiones />} />
        )}
        {esAdmin && (
          <Route path="/ClientesAdmin" element={<ClientesAdmin />} />
        )}
        {esAdmin && (
          <Route path="/clientes/:correo" element={<ClienteDetalle />} />

        )}

        {/* Ruta por defecto si no se encuentra */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer general (puedes cambiarlo si quieres otro para admin) */}
      {usuario ? (esAdmin ? <FooterAdmin /> : <Footer />) : (<Footer />)}

    </>
  );
}

export default App;
