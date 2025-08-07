import { Navigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

function RutaProtegida({ children, requiereVerificacion }) {
  const { usuario, cargandoUsuario } = useUser();

  if (cargandoUsuario) {
    return <div>Cargando...</div>; // o un spinner bonito
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (requiereVerificacion && !usuario.verificado) {
    return <Navigate to="/verificar" />;
  }

  return children;
}

export default RutaProtegida;
