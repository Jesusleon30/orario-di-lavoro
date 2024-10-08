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
const generateExcel = (data) => {
  try {
    validateData(data); // Validare i dati prima di procedere

    const worksheet = XLSX.utils.json_to_sheet(data); // Convertire i dati in un foglio di calcolo
    const workbook = XLSX.utils.book_new(); // Creare un nuovo libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati orari"); // Aggiungere il foglio al libro

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx", // Specificare il tipo di libro
      type: "array", // Specificare il tipo di uscita
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Tipo di contenuto del file
    });

    // Usare file-saver per scaricare il file Excel
    saveAs(blob, "Alfa Robotica orari di lavoro.xlsx");
  } catch (error) {
    console.error(
      "Errore durante la generazione del file Excel:",
      error.message
    ); // Registrare l'errore nella console
    alert(
      `Si è verificato un errore durante la generazione del file Excel: ${error.message}`
    ); // Messaggio di errore per l'utente

    // Qui potresti inviare l'errore a un servizio di monitoraggio se necessario
    // inviareErroreAlServizio(error); // Esempio di funzione per inviare l'errore a un servizio esterno
  }
};

export default generateExcel; // Esporta la funzione per l'uso in altri moduli
