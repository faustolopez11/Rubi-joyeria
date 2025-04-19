import { useState } from "react";
import axios from "axios";

const FormularioCambio = () => {
  const [codigoAnterior, setCodigoAnterior] = useState("");
  const [cantidadAnterior, setCantidadAnterior] = useState(1);
  const [codigoNuevo, setCodigoNuevo] = useState("");
  const [cantidadNueva, setCantidadNueva] = useState(1);
  const [fechaBusqueda, setFechaBusqueda] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoVenta, setCodigoVenta] = useState("");

  const handleCambio = async () => {
    if (!codigoAnterior || !codigoNuevo || !motivo) {
      return alert("Debe completar los códigos de producto y el motivo del cambio.");
    }

    try {
      await axios.post("http://localhost:5000/api/cambios", {
        fecha: fechaBusqueda || new Date().toISOString().split("T")[0],
        codigoVenta,
        motivo,
        descripcion,
        productoDevuelto: {
          CodigoProducto: codigoAnterior,
          Cantidad: cantidadAnterior,
        },
        productoNuevo: {
          CodigoProducto: codigoNuevo,
          Cantidad: cantidadNueva,
        },
      });

      alert("Cambio registrado correctamente.");

      // Limpiar el formulario después del cambio
      setCodigoAnterior("");
      setCantidadAnterior(1);
      setCodigoNuevo("");
      setCantidadNueva(1);
      setFechaBusqueda("");
      setMotivo("");
      setDescripcion("");
      setCodigoVenta("");

    } catch (error) {
      console.error("Error al registrar el cambio:", error);
      alert("Hubo un error al registrar el cambio.");
    }
  };

  return (
    <div className="p-4 border rounded bg-light mt-3">
      <h4 className="mb-3">Formulario de Cambio</h4>
     

      <div className="mb-3">
        <label className="form-label">Código de Venta</label>
        <input
          type="text"
          className="form-control"
          value={codigoVenta}
          onChange={(e) => setCodigoVenta(e.target.value)}
          placeholder="Ingrese el código de venta"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Código del producto a devolver</label>
        <input
          type="text"
          className="form-control"
          value={codigoAnterior}
          onChange={(e) => setCodigoAnterior(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cantidad devuelta</label>
        <input
          type="number"
          className="form-control"
          value={cantidadAnterior}
          onChange={(e) => setCantidadAnterior(Number(e.target.value))}
          min="1"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Código del nuevo producto</label>
        <input
          type="text"
          className="form-control"
          value={codigoNuevo}
          onChange={(e) => setCodigoNuevo(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cantidad nueva</label>
        <input
          type="number"
          className="form-control"
          value={cantidadNueva}
          onChange={(e) => setCantidadNueva(Number(e.target.value))}
          min="1"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Motivo del Cambio</label>
        <select
          className="form-select"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        >
          <option value="">Seleccione un motivo</option>
          <option value="defecto">Producto defectuoso</option>
          <option value="talla">Cambio de talla</option>
          <option value="color">Cambio de color</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Buscar por fecha (opcional)</label>
        <input
          type="date"
          className="form-control"
          value={fechaBusqueda}
          onChange={(e) => setFechaBusqueda(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleCambio}>
        Procesar Cambio
      </button>
    </div>
  );
};

export default FormularioCambio;
