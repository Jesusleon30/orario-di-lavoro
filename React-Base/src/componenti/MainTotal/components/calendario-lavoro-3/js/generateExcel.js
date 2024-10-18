import * as XLSX from "xlsx"; // Importa la libreria per gestire Excel
import { saveAs } from "file-saver"; // Importa la libreria per scaricare file

// Funzione per validare i dati di input
const validateData = (data) => {
  // Controlla se i dati sono un array e non sono vuoti
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("I dati devono essere un array con almeno un elemento.");
  }

  // Chiavi richieste per ogni oggetto
  const requiredKeys = [
    "DATA",
    "INIZIO",
    "FINE",
    "PAUSA",
    "CLIENTE",
    "COMMESSA",
    "NOTA",
  ];

  // Controlla che ogni oggetto contenga le proprietà richieste
  data.forEach((item, index) => {
    requiredKeys.forEach((key) => {
      if (!item.hasOwnProperty(key)) {
        throw new Error(
          `L'oggetto nell'indice ${index} deve contenere la proprietà '${key}'.`
        );
      }
    });
  });
};

// Funzione per generare un file Excel
const generateExcel = (data, userName) => {
  try {
    // Validazione dei dati
    validateData(data);
  } catch (error) {
    console.error("Errore nella validazione dei dati:", error.message);
    alert(`Errore di validazione: ${error.message}`);
    return; // Esci se la validazione fallisce
  }

  try {
    // Crea un foglio di lavoro da dati JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Imposta la larghezza delle colonne
    const columnWidths = [
      { wch: 15 }, // Larghezza per DATA
      { wch: 10 }, // Larghezza per INIZIO
      { wch: 10 }, // Larghezza per FINE
      { wch: 10 }, // Larghezza per PAUSA
      { wch: 20 }, // Larghezza per CLIENTE
      { wch: 15 }, // Larghezza per COMMESSA
      { wch: 20 }, // Larghezza per NOTA
      { wch: 15 }, // Larghezza per Ore Lavorate
      { wch: 20 }, // Larghezza per Ore Straordinarie
    ];

    // Applica le larghezze di colonna
    worksheet["!cols"] = columnWidths;

    // Stili per l'intestazione
    const headerStyle = {
      font: { bold: true }, // Grassetto per il font
      alignment: { horizontal: "center" }, // Allineamento centrale
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFF00" }, // Colore di sfondo giallo
      },
    };

    // Applica stile a ogni cella dell'intestazione
    const headers = Object.keys(data[0]);
    headers.forEach((header, index) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: index })]; // Ottiene la cella
      if (cell) {
        cell.s = headerStyle; // Applica lo stile
      }
    });

    // Crea un nuovo libro di lavoro
    const workbook = XLSX.utils.book_new();
    // Aggiungi il foglio di lavoro al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registro Lavoro");

    // Scrive il libro di lavoro in un buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Crea un blob dal buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Usa il nome dell'utente per salvare il file
    saveAs(blob, `${userName}_Registro_Lavoro.xlsx`);
  } catch (error) {
    console.error(
      "Errore durante la generazione del file Excel:",
      error.message
    );
    alert(`Errore durante la generazione del file: ${error.message}`);
  }
};

export default generateExcel; // Esporta la funzione per l'uso in altri moduli
