import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaCheck,
  FaHistory,
  FaExchangeAlt,
  FaCreditCard,
  FaMoneyBillAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/VentasFlotante.css";
import "../css/Ventas.css";
import HistorialVentas from "./HistorialVentas";
import FormularioCambio from "./FormularioCambio";
import Swal from "sweetalert2";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [mostrarMenuFlotante, setMostrarMenuFlotante] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarFormularioCambio, setMostrarFormularioCambio] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [carrito]);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stock");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    const filtrados = productos.filter(
      (p) =>
        p.CodigoProducto.toLowerCase().includes(valor.toLowerCase()) ||
        p.Descripcion.toLowerCase().includes(valor.toLowerCase())
    );
    setProductosFiltrados(filtrados);
  };

  const agregarAlCarrito = (producto) => {
    const yaEsta = carrito.find((p) => p.CodigoProducto === producto.CodigoProducto);
    if (yaEsta) return Swal.fire({
      icon: "warning",
      title: "Producto duplicado",
      text: "Ya agregaste este producto.",
      timer: 2000,
      showConfirmButton: false,
    });
    const conCantidad = {
      ...producto,
      cantidad: 1,
      subtotal: Number(producto.PrecioVenta),
    };
    setCarrito([...carrito, conCantidad]);
    setBusqueda("");
  };

  const actualizarCantidad = (codigo, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const actualizado = carrito.map((p) =>
      p.CodigoProducto === codigo
        ? { ...p, cantidad: nuevaCantidad, subtotal: nuevaCantidad * Number(p.PrecioVenta) }
        : p
    );
    setCarrito(actualizado);
  };

  const eliminarDelCarrito = (codigo) => {
    const filtrado = carrito.filter((p) => p.CodigoProducto !== codigo);
    setCarrito(filtrado);
  };

  const calcularTotal = () => {
    const suma = carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);
    setTotal(suma);
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0 || !metodoPago) {
      return Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Debe seleccionar un método de pago.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    for (let item of carrito) {
      const productoActual = productos.find((p) => p.CodigoProducto === item.CodigoProducto);
      if (!productoActual || item.cantidad > productoActual.Cantidad) {
        return Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: `No hay suficiente stock para el producto "${item.Descripcion}". Disponible: ${productoActual?.Cantidad ?? 0}, Solicitado: ${item.cantidad}`,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    }

    try {
      const venta = {
        fecha: new Date().toISOString().split("T")[0],
        metodoPago,
        detalles: carrito.map((p) => ({
          CodigoProducto: p.CodigoProducto,
          Cantidad: p.cantidad,
          Subtotal: p.subtotal,
        })),
      };

      await axios.post("http://localhost:5000/api/ventas", venta);
      Swal.fire({
        icon: "success",
        title: "Venta registrada",
        text: "La venta se guardó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      setCarrito([]);
      setTotal(0);
      fetchProductos();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Error al guardar la venta.",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <div className="ventas-container container mt-4 position-relative">
      <h2 className="text-center">Registrar Venta</h2>

      <div className="busqueda-container mb-4">
        <input
          type="text"
          className="form-control input-busqueda"
          placeholder="Escanear código o escribir el número"
          value={busqueda}
          onChange={handleBusqueda}
        />
      </div>

      {busqueda && productosFiltrados.length > 0 && (
        <div className="table-responsive mb-4">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.CodigoProducto}>
                  <td>{p.CodigoProducto}</td>
                  <td>{p.Descripcion}</td>
                  <td>{p.Cantidad}</td>
                  <td>${parseFloat(p.PrecioVenta).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => agregarAlCarrito(p)}>
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length > 0 ? (
              carrito.map((p) => (
                <tr key={p.CodigoProducto}>
                  <td>{p.CodigoProducto}</td>
                  <td>{p.Descripcion}</td>
                  <td>${parseFloat(p.PrecioVenta).toFixed(2)}</td>
                  <td>${parseFloat(p.subtotal).toFixed(2)}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => actualizarCantidad(p.CodigoProducto, p.cantidad - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="fw-bold">{p.cantidad}</span>
                      <button
                        className="btn btn-success btn-sm ms-2"
                        onClick={() => actualizarCantidad(p.CodigoProducto, p.cantidad + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDelCarrito(p.CodigoProducto)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted text-center">
                  No hay productos en la venta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <h4 className="letra-venta">Total de la venta: ${parseFloat(total).toFixed(2)}</h4>
          <h4 className="letra-pago">
            Método de pago seleccionado:{" "}
            <strong>
              {metodoPago === "efectivo" ? "Contado (Efectivo)" : "Tarjetas / Transferencia"}
            </strong>
          </h4>
        </div>
        <button
          className="btn btn-primary"
          onClick={confirmarVenta}
          disabled={carrito.length === 0}
        >
          Confirmar Venta
        </button>
      </div>

      {/* Botón flotante y menú */}
      <div className="fab-container">
        <button
          className="btn btn-primary fab-btn"
          onClick={() => setMostrarMenuFlotante(!mostrarMenuFlotante)}
        >
          <FaCheck />
        </button>

        {mostrarMenuFlotante && (
          <div className="fab-menu">
            <div className="fab-option">
              <span>Historial</span>
              <button
                className="btn-historial"
                onClick={() => {
                  setMostrarHistorial(true);
                  setMostrarFormularioCambio(false);
                }}
              >
                <FaHistory />
              </button>
            </div>

            <div className="fab-option">
              <span>Cambios</span>
              <button
                className="btn-cambio"
                onClick={() => {
                  setMostrarFormularioCambio(true);
                  setMostrarHistorial(false);
                }}
              >
                <FaExchangeAlt />
              </button>
            </div>

            <div className="fab-option">
              <span>Contado</span>
              <button
                className={`btn ${metodoPago === "efectivo" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => {
                  setMetodoPago("efectivo");
                  setMostrarMenuFlotante(false);
                }}
              >
                <FaMoneyBillAlt />
              </button>
            </div>

            <div className="fab-option">
              <span>Tarjeta</span>
              <button
                className={`btn ${metodoPago === "tarjeta" ? "btn-info" : "btn-outline-info"}`}
                onClick={() => {
                  setMetodoPago("tarjeta");
                  setMostrarMenuFlotante(false);
                }}
              >
                <FaCreditCard />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pantallas completas */}
      {mostrarHistorial && (
        <div className="pantalla-completa">
          <HistorialVentas />
          <div className="text-end mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarHistorial(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarFormularioCambio && (
        <div className="pantalla-completa">
          <FormularioCambio />
          <div className="text-end mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarFormularioCambio(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;