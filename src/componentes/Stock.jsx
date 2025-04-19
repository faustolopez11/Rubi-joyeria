import { useState, useEffect } from "react";
import "../css/Stock.css"; // Importamos el CSS separado

const Stock = () => {
    const [stock, setStock] = useState([]);

    useEffect(() => {
        obtenerStock();
    }, []);

    const obtenerStock = async () => {
        try {
            console.log("🔹 Solicitando datos del stock...");
            const response = await fetch("http://localhost:5000/api/stock");
            if (!response.ok) throw new Error("Error al obtener stock");
    
            const data = await response.json();
            console.log("✅ Datos recibidos del backend:", data);  // 👉 Verifica aquí si los valores están correctos
    
            setStock(data);
        } catch (error) {
            console.error("❌ Error al cargar stock:", error);
        }
    };
    

    // Función para determinar el color del círculo según el stock disponible
    const getStockStatus = (cantidad) => {
        if (cantidad < 5) return "red"; // Stock crítico
        if (cantidad >= 5 && cantidad <= 10) return "yellow"; // Stock bajo
        return "green"; // Stock suficiente
    };

    
    return (
        <div className="stock-container container mt-4">
            <h2 className="stock-title">Inventario de Stock</h2>
            <div className="table-container">
            <table className="table table-striped">
    <thead>
        <tr>
            <th>Código</th>
            <th>Detalles</th>
            <th>P. Venta</th>
            <th>Stock</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        {stock.length > 0 ? (
            stock.map((s, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{s.CodigoProducto}</td>
                    <td>{s.DetallesProducto || "Sin detalles"}</td>

                    <td>
                        ${Number(s.PrecioVenta.replace(/,/g, "")).toFixed(2)}
                    </td>
                    <td>{s.Cantidad}</td>
                    <td>
                        <span
                            className="estado-circle"
                            style={{
                                backgroundColor: getStockStatus(s.Cantidad),
                                width: "20px",
                                height: "20px",
                                display: "inline-block",
                                borderRadius: "50%",
                            }}
                        ></span>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="6">No hay productos en stock.</td>
            </tr>
        )}
    </tbody>
</table>


            </div>
        </div>
    );
};

export default Stock;
