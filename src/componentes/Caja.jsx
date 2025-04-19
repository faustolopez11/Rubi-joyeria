import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Caja.css";
import Swal from "sweetalert2";

const Caja = () => {
  const [ventas, setVentas] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    fetchCaja();
    fetchVentas();
  }, []);

  const fetchCaja = async () => {
    const res = await axios.get("http://localhost:5000/api/caja");
    setEgresos(res.data.filter((mov) => mov.TipoMovimiento === "RETIRO"));
  };

  const fetchVentas = async () => {
    const res = await axios.get("http://localhost:5000/api/ventas");
    const agrupadas = res.data.reduce((acc, venta) => {
      if (!acc[venta.IDVenta]) {
        acc[venta.IDVenta] = {
          IDVenta: venta.IDVenta,
          Fecha: venta.Fecha,
          productos: [],
        };
      }
      acc[venta.IDVenta].productos.push(venta);
      return acc;
    }, {});
    setVentas(Object.values(agrupadas));
  };

  const totalIngresos = ventas.reduce(
    (acc, venta) =>
      acc +
      venta.productos.reduce((s, p) => s + parseFloat(p.Subtotal), 0),
    0
  );

  const totalEgresos = egresos.reduce((acc, e) => acc + parseFloat(e.Monto), 0);
  const saldoFinal = totalIngresos - totalEgresos;

  const registrarEgreso = async () => {
    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Monto incorrecto",
        text: "Ingrese un monto válido.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    try {
      await axios.post("http://localhost:5000/api/caja", {
        tipo: "RETIRO",
        monto: parseFloat(monto),
        descripcion,
        fecha: new Date().toISOString().split("T")[0],
      });
      Swal.fire({
        icon: "success",
        title: "Egreso registrado",
        text: "El egreso fue registrado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      setMonto("");
      setDescripcion("");
      fetchCaja();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar egreso.",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  const formatearFecha = (isoString) => {
    const fecha = new Date(isoString);
    return `${fecha.getDate().toString().padStart(2, "0")}/${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fecha.getFullYear()} ${fecha
      .getHours()
      .toString()
      .padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="caja-container">
      <div className="resumen-boxes">
        <div className="box ingreso">
          <h4>${totalIngresos.toLocaleString()}</h4>
          <p>Total Ingresos</p>
        </div>
        <div className="box egreso">
          <h4>${totalEgresos.toLocaleString()}</h4>
          <p>Total Egresos</p>
        </div>
        <div className="box saldo">
          <h4>${saldoFinal.toLocaleString()}</h4>
          <p>Saldo Final</p>
        </div>
      </div>

      <div className="acciones">
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto del egreso"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        <button onClick={registrarEgreso} className="btn btn-danger">
          Registrar Egreso
        </button>
      </div>

      <div className="tablas">
        {/* INGRESOS */}
        <div className="tabla ingresos">
          <h5>Lista de Ingresos (Ventas)</h5>
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.IDVenta}>
                    <td>{formatearFecha(v.Fecha)}</td>
                    <td>
                      ${v.productos.reduce((s, p) => s + parseFloat(p.Subtotal), 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="total-fila fondo-ingresos">
                  <td><strong>Total Ingresos</strong></td>
                  <td><strong>${totalIngresos.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EGRESOS */}
        <div className="tabla egresos">
          <h5>Lista de Egresos</h5>
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {egresos.map((e) => (
                  <tr key={e.IDCaja}>
                    <td>{formatearFecha(e.Fecha)}</td>
                    <td>${parseFloat(e.Monto).toFixed(2)}</td>
                    <td>{e.Descripcion}</td>
                  </tr>
                ))}
                <tr className="total-fila fondo-egresos">
                  <td><strong>Total Egresos</strong></td>
                  <td><strong>${totalEgresos.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
