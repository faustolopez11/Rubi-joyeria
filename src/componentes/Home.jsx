import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faWarehouse,
  faShoppingCart,
  faDollarSign,
  faChartLine,
  faCashRegister,
  faSignOutAlt,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import "../css/Home.css"; // Asegúrate de tener este archivo actualizado
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="welcome-container">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          <p className="welcome-message">
            Bienvenido, {userName || "Invitado"}
          </p>
        </div>
      </header>
      <div className="sidebar">
        <ul className="menu">
          <li>
            <Link to="/proveedores">
              <FontAwesomeIcon icon={faTruck} className="menu-icon" />
              <span>Proveedores</span>
            </Link>
          </li>
          <li>
            <Link to="/compras">
              <FontAwesomeIcon icon={faShoppingCart} className="menu-icon" />
              <span>Compras</span>
            </Link>
          </li>
          {userRole === "1" && (
            <li>
              <Link to="/stock">
                <FontAwesomeIcon icon={faWarehouse} className="menu-icon" />
                <span>Stock</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/ventas">
              <FontAwesomeIcon icon={faDollarSign} className="menu-icon" />
              <span>Ventas</span>
            </Link>
          </li>
          {userRole === "1" && (
            <>
              <li>
                <Link to="/caja">
                  <FontAwesomeIcon icon={faCashRegister} className="menu-icon" />
                  <span>Caja</span>
                </Link>
              </li>
              <li>
                <Link to="/reportes">
                  <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
                  <span>Reportes</span>
                </Link>
              </li>
              <li>
                <Link to="/usuarios">
                  <FontAwesomeIcon icon={faUserCircle} className="menu-icon" />
                  <span>Usuarios</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="logout-button-container">
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal con botones grandes usando Bootstrap */}
      <div className="main-content d-flex align-items-center justify-content-center vh-100">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/proveedores" className="btn custom-btn btn-lg w-100 py-5">
                <FontAwesomeIcon icon={faTruck} className="me-2" /> Proveedores
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/stock" className="btn custom-btn btn-lg w-100 py-5">
                <FontAwesomeIcon icon={faWarehouse} className="me-2" /> Stock
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/compras" className="btn custom-btn btn-lg w-100 py-5">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Compras
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/ventas" className="btn custom-btn btn-lg w-100 py-5">
                <FontAwesomeIcon icon={faDollarSign} className="me-2" /> Ventas
              </Link>
            </div>
            {userRole === "1" && (
              <>
                <div className="col-md-6">
                  <Link to="/caja" className="btn custom-btn btn-lg w-100 py-5">
                    <FontAwesomeIcon icon={faCashRegister} className="me-2" /> Caja
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/reportes" className="btn custom-btn btn-lg w-100 py-5">
                    <FontAwesomeIcon icon={faChartLine} className="me-2" /> Reportes
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
