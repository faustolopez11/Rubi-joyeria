import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEye, FaPrint, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo_rubi.png";
import Swal from "sweetalert2";

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCorreoModal, setMostrarCorreoModal] = useState(false);
  const [emailDestinatario, setEmailDestinatario] = useState("");

  useEffect(() => {
    const fetchVentas = async () => {
      const res = await axios.get("http://localhost:5000/api/ventas");
      const agrupadas = res.data.reduce((acc, venta) => {
        if (!acc[venta.IDVenta]) {
          acc[venta.IDVenta] = {
            IDVenta: venta.IDVenta,
            Fecha: venta.Fecha,
            MetodoPago: venta.MetodoPago,
            productos: [],
          };
        }
        acc[venta.IDVenta].productos.push(venta);
        return acc;
      }, {});
      setVentas(Object.values(agrupadas));
    };
    fetchVentas();
  }, []);
/*
  const imprimirFactura = (venta) => {
    const doc = generarPDF(venta);
    doc.save(`Factura_RUBI_${venta.IDVenta}.pdf`);
  };
  */
 //Ruta para imprimir factura
  const imprimirFactura = (venta) => {
    const doc = generarPDF(venta);
    window.open(doc.output('bloburl')); // Abre la vista previa para imprimir
  };
  
  const generarPDF = (venta) => {
    const doc = new jsPDF();
    const total = venta.productos.reduce((acc, p) => acc + parseFloat(p.Subtotal), 0);

    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 10, 10, 30, 30);
    doc.setFontSize(16);
    doc.text("JOYERÍA RUBÍ", 45, 20);
    doc.setFontSize(10);
    doc.text("Dirección: Av. Brillante 123 - Córdoba", 45, 26);
    doc.text("CUIT: 20-12345678-9", 45, 31);
    doc.text("Condición frente al IVA: Responsable Inscripto", 45, 36);

    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Factura N° ${venta.IDVenta.toString().padStart(4, "0")}`, 160, 20);
    doc.text(`Fecha: ${new Date(venta.Fecha).toLocaleDateString()}`, 160, 26);
    doc.text(
      `Pago: ${venta.MetodoPago === "tarjeta" ? "Tarjeta / Transferencia" : "Contado (Efectivo)"}`,
      160,
      32
    );

    autoTable(doc, {
      startY: 45,
      head: [["Código", "Descripción", "Cantidad", "Subtotal"]],
      body: venta.productos.map((p) => [
        p.CodigoProducto,
        p.Descripcion,
        p.Cantidad,
        `$${parseFloat(p.Subtotal).toFixed(2)}`,
      ]),
    });

    doc.setFontSize(12);
    doc.text(`Total: $${total.toFixed(2)}`, 160, doc.lastAutoTable.finalY + 10);

    return doc;
  };

  const solicitarCorreoYEnviar = (venta) => {
    setVentaSeleccionada(venta);
    setEmailDestinatario("");
    setMostrarCorreoModal(true);
  };

  const enviarFacturaPorGmail = async () => {
    if (!emailDestinatario || !emailDestinatario.includes("@")) {
      return Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Por favor, ingrese un correo válido.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    const doc = generarPDF(ventaSeleccionada);
    const pdfBlob = doc.output("blob");

    const formData = new FormData();
    formData.append("factura", pdfBlob, `Factura_RUBI_${ventaSeleccionada.IDVenta}.pdf`);
    formData.append("email", emailDestinatario);

    try {
      await axios.post("http://localhost:5000/api/enviar-factura", formData);
      Swal.fire({
        icon: "success",
        title: "Factura enviada",
        text: "Factura enviada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      setMostrarCorreoModal(false);
      setVentaSeleccionada(null);
    } catch (error) {
      console.error("Error al enviar la factura:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "Error al enviar la factura por Gmail.",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  const cerrarModal = () => {
    setVentaSeleccionada(null);
    setMostrarModal(false);
    setMostrarCorreoModal(false);
  };

  return (
    <div className="historial-ventas-container ">
      <h2>Historial de Ventas</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Método de Pago</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => {
              const total = venta.productos.reduce((acc, p) => acc + parseFloat(p.Subtotal), 0);
              const cantidadProductos = venta.productos.reduce((acc, p) => acc + p.Cantidad, 0);

              return (
                <tr key={venta.IDVenta}>
                  <td>{new Date(venta.Fecha).toLocaleDateString()}</td>
                  <td>{venta.MetodoPago}</td>
                  <td>${total.toFixed(2)}</td>
                  <td>{cantidadProductos}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => {
                        setVentaSeleccionada(venta);
                        setMostrarModal(true);
                      }}
                    >
                      <FaEye className="me-1" /> Ver Detalle
                    </button>
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => imprimirFactura(venta)}>
                      <FaPrint className="me-1" /> Imprimir
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => solicitarCorreoYEnviar(venta)}>
                      <FaEnvelope className="me-1" /> Gmail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {mostrarModal && ventaSeleccionada && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de Venta #{ventaSeleccionada.IDVenta}</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Fecha:</strong> {new Date(ventaSeleccionada.Fecha).toLocaleDateString()}</p>
                <p><strong>Método de Pago:</strong> {ventaSeleccionada.MetodoPago}</p>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventaSeleccionada.productos.map((p, i) => (
                      <tr key={i}>
                        <td>{p.CodigoProducto}</td>
                        <td>{p.Descripcion}</td>
                        <td>{p.Cantidad}</td>
                        <td>${parseFloat(p.Subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h6 className="text-end">
                  Total: ${ventaSeleccionada.productos.reduce((acc, p) => acc + parseFloat(p.Subtotal), 0).toFixed(2)}
                </h6>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ingreso de correo */}
      {mostrarCorreoModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enviar Factura por Gmail</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="correo">Correo del cliente:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="cliente@example.com"
                  value={emailDestinatario}
                  onChange={(e) => setEmailDestinatario(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={enviarFacturaPorGmail}>
                  Enviar factura
                </button>
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(mostrarModal || mostrarCorreoModal) && (
        <div className="modal-backdrop fade show" onClick={cerrarModal}></div>
      )}
    </div>
  );
};

export default HistorialVentas;
