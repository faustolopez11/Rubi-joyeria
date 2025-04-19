import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../css/Navbar.css"; // Importamos el CSS para personalización

const NavigationBar = ({ userRole, setUserRole }) => {
    const navigate = useNavigate(); // Hook para redirigir

    const handleLogout = () => {
        // Limpiar cualquier dato de sesión (si usas localStorage)
        localStorage.removeItem("userRole"); 
        localStorage.removeItem("userToken"); 

        setUserRole(null); // Cerrar sesión
        navigate("/login"); // Redirigir a la página de inicio de sesión
    };

    return (
        <div className="navbar-container"> {/* Contenedor del Navbar */}
            <Navbar expand="lg" fixed="top" className="navbar-content shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/home" className="fw-bold">Inicio</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/proveedores">Proveedores</Nav.Link>
                            <Nav.Link as={Link} to="/compras">Compras</Nav.Link>
                            <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                            <Nav.Link as={Link} to="/stock">Stock</Nav.Link>
                            <Nav.Link as={Link} to="/ventas">Ventas</Nav.Link>
                            <Nav.Link as={Link} to="/Reportes">Reportes</Nav.Link>
                            <Nav.Link as={Link} to="/Caja">Caja</Nav.Link>
                        </Nav>
                        <Button variant="outline-dark" onClick={handleLogout}>Cerrar sesión</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavigationBar;
