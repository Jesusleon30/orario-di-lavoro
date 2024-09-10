import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PropTypes from "prop-types";

// Componente que muestra detalles individuales
function DetailCard({ details }) {
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
      <div className="bg-gray-700 text-white">Nota :</div>
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
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("ELENCO DATI ORARI", 14, 20);

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

      doc.save("Dati_orario.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  // Función para manejar la descarga del PDF con alerta de confirmación
  const handleDownloadPDF = () => {
    if (data.length === 0) {
      alert("Il pdf si trova vuoto ");
      return;
    }

    const confirmDownload = window.confirm("Vuoi scaricare in PDF ?");
    if (confirmDownload) {
      generatePDF();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          className="bg-white rounded text-black border-2
          hover:bg-black hover:text-white border-black p-2 font-semibold"
          onClick={handleDownloadPDF}
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
