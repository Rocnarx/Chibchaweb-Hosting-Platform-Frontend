    import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiClipboard, FiUserCheck } from "react-icons/fi";
import { useUser } from "../Context/UserContext";
import "./NavbarCoordinador.css";

export default function NavbarCoordinador() {
  const { cerrarSesion } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <nav className="navbar-coordinador">
      <div className="nav-logo">
        <Link to="/" className="logo-text">ChibchaWeb</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/tickets">
            <FiClipboard /> Tickets
          </Link>
        </li>
        <li>
          <Link to="/asignar-tickets">
            <FiUserCheck /> Asignar
          </Link>
        </li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut /> Cerrar sesión
      </button>
    </nav>
  );
}
