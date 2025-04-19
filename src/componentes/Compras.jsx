import { useState, useEffect } from "react";
import "../css/Compras.css"; // Importamos el CSS separado
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Íconos para acciones
import Swal from 'sweetalert2';


const Compras = () => {
    const [compras, setCompras] = useState([]); // Estado para almacenar compras
    const [proveedores, setProveedores] = useState([]); // Estado para almacenar proveedores
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controlar la visibilidad del formulario

    const [compra, setCompra] = useState({
        fechaCompra: "",
        codigoProveedor: "",
        codigoProducto: "",
        cantidad: "",
        detallesProducto: "",
        precioTotal: "",
        tipoProducto: ""
    });

    useEffect(() => {
        obtenerCompras();
        obtenerProveedores(); // Llamamos la función para obtener proveedores
    }, []);

    const obtenerProveedores = async () => {
        try {
            console.log("🔹 Cargando lista de proveedores...");
            const response = await fetch("http://localhost:5000/api/proveedores");
            if (!response.ok) throw new Error("Error al obtener proveedores");

            const data = await response.json();
            console.log("📋 Proveedores recibidos:", data);
            setProveedores(data);
        } catch (error) {
            console.error("❌ Error al cargar proveedores:", error);
        }
    };

    const handleChange = (e) => {
        setCompra({ ...compra, [e.target.name]: e.target.value });
    };

    const obtenerCompras = async () => {
        try {
            console.log("🔹 Intentando obtener compras desde la API...");
            const response = await fetch("http://localhost:5000/api/compras");
            if (!response.ok) throw new Error("Error al obtener compras");

            const data = await response.json();
            console.log("📦 Compras recibidas:", data);
            setCompras(data);
        } catch (error) {
            console.error("❌ Error al cargar compras:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const nuevaCompra = {
            fecha: compra.fechaCompra,
            CodigoProveedor: compra.codigoProveedor.trim(),
            CodigoProducto: compra.codigoProducto.trim(),
            cantidad: parseInt(compra.cantidad) || 0,
            PrecioTotal: parseFloat(compra.precioTotal) || 0.0,
            DetallesProducto: compra.detallesProducto.trim() || "Sin detalles"
        };
    
        console.log("📤 Enviando datos a /api/compras:", nuevaCompra);
    
        try {
            const response = await fetch("http://localhost:5000/api/compras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaCompra),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al registrar compra");
    
            Swal.fire({
                icon: 'success',
                title: '¡Compra registrada!',
                text: data.message || 'La compra fue registrada correctamente.',
                confirmButtonColor: '#8B1123',
                timer: 2000,
                showConfirmButton: false
              });
             
            obtenerCompras(); // Recargar la lista de compras
    
            // Vaciar los campos del formulario
            setCompra({
                fechaCompra: "",
                codigoProveedor: "",
                codigoProducto: "",
                cantidad: "",
                detallesProducto: "",
                precioTotal: "",
                tipoProducto: ""
            });
    
            // Volver automáticamente al historial
            setMostrarFormulario(false);
        } catch (error) {
            console.error("❌ Error en el registro de compra:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar compra',
                text: error.message || 'Ocurrió un problema al registrar la compra.',
                confirmButtonColor: '#8B1123'
              });
        }
    };

    return (
        <div className="compras-container container mt-4">
            {/* 🔹 Encabezado con título y botón de registrar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="compras-title">{mostrarFormulario ? "Registrar Compra" : "Historial de Compras"}</h2>
                <button className="btn btn-success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                    {mostrarFormulario ? "Volver al Historial" : "+ Nueva Compra"}
                </button>
            </div>

            {/* 🔹 Muestra el formulario de compra o el historial, pero nunca juntos */}
            {mostrarFormulario ? (
                <div className="formulario-compra">
                    <form className="compras-form" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-2">
                                <label className="form-label">Fecha</label>
                                <input type="date" className="form-control" name="fechaCompra" value={compra.fechaCompra} onChange={handleChange} required />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Proveedor</label>
                                <select 
                                    className="form-control" 
                                    name="codigoProveedor" 
                                    value={compra.codigoProveedor} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedores.map((proveedor) => (
                                        <option key={proveedor.CodigoProveedor} value={proveedor.CodigoProveedor}>
                                            {proveedor.Nombre} (Código: {proveedor.CodigoProveedor})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Código Producto</label>
                                <input type="text" className="form-control" name="codigoProducto" placeholder="Ej: P001" value={compra.codigoProducto} onChange={handleChange} required />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Cantidad</label>
                                <input type="number" className="form-control" name="cantidad" placeholder="Cantidad" value={compra.cantidad} onChange={handleChange} required />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Detalles</label>
                                <input type="text" className="form-control" name="detallesProducto" placeholder="Detalles del producto" value={compra.detallesProducto} onChange={handleChange} />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Precio Total</label>
                                <input type="number" className="form-control" name="precioTotal" placeholder="Ej: 500.00" step="0.01" value={compra.precioTotal} onChange={handleChange} required />
                            </div>

                            <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">Registrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Proveedor</th>
                                <th>Código Producto</th>
                                <th>Cantidad</th>
                                <th>Detalles</th>
                                <th>Precio Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.length > 0 ? (
                                compras.map((c, index) => (
                                    <tr key={index}>
                                        <td>{new Date(c.Fecha).toLocaleDateString()}</td>
                                        <td>{c.NombreProveedor}</td>
                                        <td>{c.CodigoProducto}</td>
                                        <td>{c.Cantidad}</td>
                                        <td>{c.DetallesProducto || "Sin detalles"}</td>
                                        <td>${parseFloat(c.PrecioTotal).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No hay compras registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Compras;