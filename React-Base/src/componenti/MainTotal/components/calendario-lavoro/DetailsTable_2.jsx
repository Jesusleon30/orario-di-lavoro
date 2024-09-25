
import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Componente que muestra detalles individuales
function DetailCard({ details }) {
  const renderDetails = () => {
    return Object.entries(details)
      .filter(([key]) => key !== "CLIENTE")
      .map(([key, value]) => (
        <div className="flex flex-col" key={key}>
          <div>{key}:</div>
          <div className="text-white bg-gray-600 rounded">{value}</div>
        </div>
      ));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-center gap-3 bg-gray-900 text-white rounded">
        {renderDetails()}
      </div>
      <div className="bg-gray-900 text-white">Nota:</div>
      <div className="text-white bg-gray-600 rounded">{details.CLIENTE}</div>
    </div>
  );
}

DetailCard.propTypes = {
  details: PropTypes.object.isRequired,
};

// Componente que muestra la tabla de detalles
export function DetailsTable_2({ dates }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dates);
  }, [dates]);

  // Generar Excel a partir de los datos
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati orari");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Alfa Robotica orari di lavoro.xlsx");
  };

  // Función para manejar la descarga del Excel con alerta de confirmación
  const handleDownloadExcel = () => {
    if (data.length === 0) {
      alert("Il excel si trova vuoto ");
      return;
    }

    const confirmDownload = window.confirm("Sei sicuro di scaricare in Excel ?");
    if (confirmDownload) {
      generateExcel();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-5">
      <div>
        <button
          className="bg-gray-400 rounded text-black border-2
          hover:bg-black hover:text-white border-black p-2 font-semibold"
          onClick={handleDownloadExcel}
        >
          SCARICARE EXCEL
        </button>
      </div>
      {data.map((details, index) => (
        <DetailCard key={index} details={details} />
      ))}
    </div>
  );
}

DetailsTable_2.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.object).isRequired,
};