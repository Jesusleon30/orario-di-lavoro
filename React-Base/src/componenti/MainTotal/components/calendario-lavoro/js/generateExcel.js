// generateExcel.js

import * as XLSX from "xlsx"; // Importa la libreria per gestire Excel
import { saveAs } from "file-saver"; // Importa la libreria per scaricare file

// Funzione per validare i dati di input
const validateData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("I dati devono essere un array con almeno un elemento.");
  }

  // Assicurati che ogni oggetto contenga le proprietà necessarie
  const requiredKeys = [
    "DATA",
    "INIZIO",
    "FINE",
    "PAUSA",
    "CLIENTE",
    "COMMESSA",
    "NOTA",
  ];
  data.forEach((item) => {
    requiredKeys.forEach((key) => {
      if (!item.hasOwnProperty(key)) {
        throw new Error(`L'oggetto deve contenere la proprietà '${key}'.`);
      }
    });
  });
};

// Funzione per generare un file Excel
const generateExcel = (data, userName) => {
  try {
    validateData(data);

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

    // Usar el nombre del usuario para guardar el archivo
    saveAs(blob, `${userName}_orari_di_lavoro.xlsx`);
  } catch (error) {
    console.error(
      "Errore durante la generazione del file Excel:",
      error.message
    );
    alert(
      `Si è verificato un errore durante la generazione del file Excel: ${error.message}`
    );
  }
};

export default generateExcel; // Esporta la funzione per l'uso in altri moduli
