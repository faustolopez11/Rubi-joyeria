import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "../src/css/Global.css";
import Login from "./componentes/Login";
import Home from "./componentes/Home";
import Usuarios from "./componentes/Usuarios";
import Proveedores from "./componentes/Proveedores";
import NavigationBar from "./componentes/Navbar";
import Compras from "./componentes/Compras"; 
import Stock from "./componentes/Stock"; // ✅ Nuevo componente de Stock
import Ventas from "./componentes/Ventas"; // ✅ Nuevo componente de Ventas
import HistorialVentas from "./componentes/HistorialVentas";
import Reportes from "./componentes/Reportes"
import Caja from "./componentes/Caja"

const App = () => {
    const [userRole, setUserRole] = useState(null);

    return (
        <Router>
            <MainContent userRole={userRole} setUserRole={setUserRole} />
        </Router>
    );
};

const MainContent = ({ userRole, setUserRole }) => {
    const location = useLocation();
    const showNavbar = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/home"; 

    return (
        <div>
            {showNavbar && <NavigationBar userRole={userRole} setUserRole={setUserRole} />}
            <div className="page-container"> {/* Contenedor general del contenido */}
            <Routes>
    <Route path="/" element={<Login setUserRole={setUserRole} />} />
    <Route path="/login" element={<Login setUserRole={setUserRole} />} />
    <Route path="/home" element={<Home />} />
    <Route path="/usuarios" element={<Usuarios />} />
    <Route path="/proveedores" element={<Proveedores />} />
    <Route path="/compras" element={<Compras />} />
    <Route path="/stock" element={<Stock />} />
    <Route path="/ventas" element={<Ventas />} /> {/* ✅ Ruta correcta */}
    <Route path="/reportes" element={<Reportes />} /> {/* ✅ Ruta correcta */}
    <Route path="/caja" element={<Caja />} /> {/* ✅ Ruta correcta */}


</Routes>

            </div>
        </div>
    );
};

export default App;
