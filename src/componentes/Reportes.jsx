import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es"; // 🇪🇸 idioma español para el calendario
registerLocale("es", es);

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import "../css/Reportes.css";

const Reportes = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [ventas, setVentas] = useState([]);

  const obtenerVentas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reportes/ventas", {
        params: {
          fechaInicio: fechaInicio.toISOString().split("T")[0],
          fechaFin: fechaFin.toISOString().split("T")[0],
        },
      });
      setVentas(res.data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, [fechaInicio, fechaFin]);

  // Agrupar ventas por fecha
  const ventasAgrupadas = ventas.reduce((acc, venta) => {
    const fecha = new Date(venta.Fecha).toLocaleDateString("es-AR");
    acc[fecha] = (acc[fecha] || 0) + parseFloat(venta.Subtotal);
    return acc;
  }, {});

  const datosGrafico = Object.entries(ventasAgrupadas).map(([fecha, total]) => ({
    fecha,
    total,
  }));

  // Calcular total general
  const totalGeneral = datosGrafico.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="reporte-container">
      <h2 className="text-center mb-4">Reporte de Ventas</h2>

      <div className="date-picker-container">
        <div>
          <label>Desde:</label>
          <DatePicker
            selected={fechaInicio}
            onChange={setFechaInicio}
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>
        <div>
          <label>Hasta:</label>
          <DatePicker
            selected={fechaFin}
            onChange={setFechaFin}
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>
      </div>

      <div className="grafico-barra">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGrafico}>
            <XAxis
              dataKey="fecha"
              tickFormatter={(fecha) => fecha} // ya viene formateada
            />
            <YAxis />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString("es-AR")}`}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Legend />
            <Bar dataKey="total" name="Total Vendido">
              {datosGrafico.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.total >= 500000 ? "#28a745" : "#dc3545"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="resumen-ventas text-center mt-4">
        <h5>
          Total vendido en el período:{" "}
          <span className={totalGeneral >= 500000 ? "bueno" : "malo"}>
            ${totalGeneral.toLocaleString("es-AR")}
          </span>
        </h5>
      </div>
    </div>
  );
};

export default Reportes;
