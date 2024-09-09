import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PropTypes from "prop-types";

// Componente que muestra detalles individuales
function DetailCard({ details }) {
  // Filtra y mapea las entradas del detalle para mostrar solo las relevantes
  const renderDetails = () => {
    return Object.entries(details)
      .filter(([key]) => key !== "CLIENTE")
      .map(([key, value]) => (
        <div className="flex flex-col" key={key}>
          <div>{key}:</div>
          <div className="bg-blue-800 rounded">{value}</div>
        </div>
      ));
  };

  return (
    <div className="mb-4 flex flex-col">
      <div className="flex items-start gap-10 bg-gray-700 text-white rounded">
        {renderDetails()}
      </div>
      <div className="bg-gray-700 text-white">CLIENTE:</div>
      <div className="bg-blue-800 text-white rounded">{details.CLIENTE}</div>
    </div>
  );
}

DetailCard.propTypes = {
  details: PropTypes.object.isRequired,
};

// Componente que muestra la tabla de detalles
export function DetailsTable({ dates }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dates);
  }, [dates]);

  // Generar PDF a partir de los datos
  const generatePDF = () => {
    try {
      // Verifica si hay datos
      if (data.length === 0) {
        console.error("No hay datos para generar el PDF.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("LISTA DATI", 14, 20);

      // Genera la tabla de datos
      autoTable(doc, {
        head: [["DATA", "INIZIO", "PRANZO", "FINE", "CLIENTE"]],
        body: data.map(({ DATA, INIZIO, PRANZO, FINE, CLIENTE }) => [
          DATA || "N/A",
          INIZIO || "N/A",
          PRANZO || "N/A",
          FINE || "N/A",
          CLIENTE || "N/A",
        ]),
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        margin: { top: 30 },
      });

      doc.save("reporte_usuarios.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          className="bg-white rounded text-black border-2
          hover:bg-black hover:text-white border-black p-2"
          onClick={generatePDF}
        >
          SCARICARE PDF
        </button>
      </div>
      {data.map((details, index) => (
        <DetailCard key={index} details={details} />
      ))}
    </div>
  );
}

DetailsTable.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.object).isRequired,
};
