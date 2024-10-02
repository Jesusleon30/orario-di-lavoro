// generateExcel.js

// generateExcel.js: Define la función generateExcel que se encarga de crear y descargar el archivo Excel.

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Función para generar un archivo Excel
const generateExcel = (data) => {
  try {
    // Validar si data es un array y tiene al menos un elemento
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Los datos deben ser un array con al menos un elemento.");
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati orari");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Usar file-saver para descargar el archivo Excel
    saveAs(blob, "Alfa Robotica orari di lavoro.xlsx");
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error.message);
    alert(`Ocurrió un error al generar el archivo Excel: ${error.message}`);
    // Puedes manejar el error de otras maneras, por ejemplo, registrándote en un servicio de seguimiento de errores
  }
};

export default generateExcel;
