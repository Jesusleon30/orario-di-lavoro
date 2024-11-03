import React, { useEffect, useState } from "react"; // Importa React e i suoi hook
import PropTypes from "prop-types"; // Importa PropTypes per la validazione delle proprietà
import generateExcel from "./js/generateExcel"; // Importa la funzione per generare il file Excel

// Definizione del componente DetailsTable
const DetailsTable = ({ dates }) => {
  // Stato per messaggi di feedback
  const [message, setMessage] = useState({ text: "", type: "" });

  // Stato per i dati temporali
  const [timeData, setTimeData] = useState({
    dailyData: [],
    totalMinutes: 0,
    totalStraordinario: 0,
  });

  // Stato per il download automatico
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  // Funzione per convertire una stringa di tempo in minuti
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0; // Restituisce 0 se la stringa è vuota
    // Controlla il formato della stringa
    if (!/^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeString)) {
      throw new Error(
        `Formato tempo non valido: "${timeString}". Deve essere "HH:MM".`
      );
    }
    const [hours, minutes] = timeString.split(":").map(Number); // Divide la stringa in ore e minuti
    return hours * 60 + minutes; // Restituisce il totale in minuti
  };

  // Effetto per calcolare i dati temporali e gestire il download automatico
  useEffect(() => {
    const hasAutoDownloaded = localStorage.getItem("hasAutoDownloaded"); // Controlla se è già stato fatto il download automatico
    setAutoDownloaded(hasAutoDownloaded === "true"); // Imposta lo stato

    if (dates.length === 0) {
      // Se non ci sono date disponibili
      setMessage({ text: " ", type: "error" }); // Mostra un messaggio di errore
      return;
    }

    // Funzione per calcolare i dati temporali
    const calculateTimeData = () => {
      let totalMinutes = 0; // Totale minuti lavorati
      let totalStraordinario = 0; // Totale straordinari

      const dailyData = dates.map((date) => {
        try {
          const startMinutes = timeToMinutes(date.INIZIO); // Inizio in minuti
          const startMinutesPausa = timeToMinutes(date.PAUSA); // Pausa in minuti
          const endMinutes = timeToMinutes(date.FINE); // Fine in minuti
          const workedMinutes = endMinutes - startMinutes - startMinutesPausa; // Calcola i minuti lavorati

          if (workedMinutes > 0) {
            // Se ci sono minuti lavorati
            totalMinutes += workedMinutes; // Aggiorna il totale
            if (workedMinutes > 480) {
              // Se i minuti superano le 8 ore
              totalStraordinario += workedMinutes - 480; // Calcola gli straordinari
            }
          }

          return {
            ...date, // Restituisce i dati originali con i nuovi campi
            workedMinutes,
            straordinario: workedMinutes > 480 ? workedMinutes - 480 : 0,
          };
        } catch (error) {
          console.error("Errore nel calcolo dei dati temporali:", error);
          return { ...date, workedMinutes: 0, straordinario: 0 }; // Restituisce 0 in caso di errore
        }
      });

      return { dailyData, totalMinutes, totalStraordinario }; // Restituisce i dati calcolati
    };

    try {
      const { dailyData, totalMinutes, totalStraordinario } =
        calculateTimeData(); // Calcola i dati
      setTimeData({ dailyData, totalMinutes, totalStraordinario }); // Aggiorna lo stato

      if (dailyData.length >= 12 && !autoDownloaded) {
        // Se ci sono almeno 12 giorni e non è già stato scaricato
        const isValid = dailyData.every(
          (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA // Controlla se tutti i dati sono presenti
        );

        if (!isValid) {
          // Se ci sono dati mancanti
          setMessage({
            text: "Per favore completa tutti i campi prima di scaricare.",
            type: "error",
          });
          return;
        }

        const name = prompt(
          "Per favore inserisci il tuo nome e cognome per il download automatico:",
          ""
        );
        if (!name) {
          // Se il nome non è fornito
          setMessage({
            text: "Devi inserire il tuo nome e cognome per il download automatico.",
            type: "error",
          });
          return;
        }

        handleDownloadExcel(dailyData, totalMinutes, totalStraordinario, name); // Gestisce il download
        setAutoDownloaded(true); // Imposta lo stato per il download automatico
        localStorage.setItem("hasAutoDownloaded", "true"); // Memorizza il download
      }
    } catch (error) {
      console.error("Errore durante il calcolo del tempo:", error);
      setMessage({
        text: "Errore nel calcolo dei dati temporali.",
        type: "error",
      });
    }
  }, [dates, autoDownloaded]);

  // Funzione per formattare i minuti in ore e minuti
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0"); // Calcola le ore
    const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calcola i minuti rimanenti
    return `${hours}:${remainingMinutes}`; // Restituisce la stringa formattata
  };

  // Funzione per gestire il download dell'Excel
  const handleDownloadExcel = (
    dailyData,
    totalMinutes,
    totalStraordinario,
    name
  ) => {
    setMessage({ text: "", type: "" }); // Reset del messaggio

    // Controlla se i dati giornalieri sono vuoti
    if (dailyData.length === 0) {
      setMessage({ text: "Nessun dato da scaricare.", type: "error" });
      return;
    }

    // Controlla se il nome è fornito
    if (!name) {
      setMessage({
        text: "Devi inserire il tuo nome e cognome per scaricare il file.",
        type: "error",
      });
      return;
    }

    const isValid = dates.every(
      (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA // Controlla se i dati sono completi
    );
    if (!isValid) {
      setMessage({
        text: "Alcuni dati sono mancanti, verifica che INIZIO - FINE - PAUSA siano compilati. GRAZIE 😉",
        type: "error",
      });
      return;
    }

    const excelData = dailyData.map((date) => ({
      DATA: date.DATA,
      INIZIO: date.INIZIO,
      FINE: date.FINE,
      PAUSA: date.PAUSA,
      CLIENTE: date.CLIENTE,
      COMMESSA: date.COMMESSA,
      NOTA: date.NOTA,
      Ore_Lavorate: formatMinutesToTime(date.workedMinutes), // Formatta le ore lavorate
      Ore_Straordinarie: formatMinutesToTime(date.straordinario), // Formatta le ore straordinarie
    }));

    // Aggiunge la riga totale
    excelData.push({
      DATA: "Totale",
      INIZIO: "",
      FINE: "",
      PAUSA: "",
      CLIENTE: "",
      COMMESSA: "",
      NOTA: "",
      Ore_Lavorate: formatMinutesToTime(totalMinutes), // Formatta il totale delle ore lavorate
      Ore_Straordinarie: formatMinutesToTime(totalStraordinario), // Formatta il totale delle ore straordinarie
    });

    try {
      generateExcel(excelData, name); // Genera il file Excel
      setMessage({ text: "Excel scaricato con successo! 👍", type: "success" });
    } catch (error) {
      console.error("Errore durante la generazione dell'Excel:", error);
      setMessage({
        text: "Si è verificato un errore durante la generazione del file Excel.",
        type: "error",
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-between gap-3 p-5 bg-gray-800 rounded-lg shadow-lg">
      <button
        className="bg-gray-400 rounded text-black border-2 hover:bg-white p-2 font-semibold"
        onClick={() =>
          handleDownloadExcel(
            timeData.dailyData,
            timeData.totalMinutes,
            timeData.totalStraordinario,
            prompt(
              "Prima di scaricare il file, inserisci il tuo nome e cognome:"
            )
          )
        }
        aria-label="Download Excel"
      >
        SCARICA EXCEL
      </button>

      {message.text && (
        <div
          className={
            message.type === "error" ? "text-red-500" : "text-green-500"
          }
        >
          {message.text}
        </div>
      )}

      <div className="text-white">
        <p>
          Totale ore lavorate: {Math.floor(timeData.totalMinutes / 60)}h{" "}
          {timeData.totalMinutes % 60}m
        </p>
        <p>
          Totale Ore straordinarie:{" "}
          {Math.floor(timeData.totalStraordinario / 60)}h{" "}
          {timeData.totalStraordinario % 60}m
        </p>
      </div>

      <table className="bg-yellow-300">
        <thead>
          <tr className="bg-yellow-500 border-b-2 border-blue-600 flex flex-wrap">
            <th className="py-2 px-3 text-left">DATA</th>
            <th className="py-2 px-3 text-left">INIZIO</th>
            <th className="py-2 px-3 text-left">FINE</th>
            <th className="py-2 px-3 text-left">PAUSA</th>
            <th className="py-2 px-3 text-left">CLIENTE</th>
            <th className="py-2 px-3 text-left">COMMESSA</th>
            <th className="py-2 px-3 text-left">NOTA</th>
            <th className="py-2 px-3 text-left bg-white">Ore Lavorate</th>
            <th className="py-2 px-3 text-left bg-black text-white">
              Ore Straordinarie
            </th>
          </tr>
        </thead>
        <tbody>
          {timeData.dailyData.map((date, index) => (
            <tr
              key={index}
              className="hover:bg-blue-500 transition flex flex-wrap m-2 gap-2 border-b-2 border-blue-600"
            >
              <td className="py-2 px-3 border">{date.DATA}</td>
              <td className="py-2 px-3 border">{date.INIZIO}</td>
              <td className="py-2 px-3 border">{date.FINE}</td>
              <td className="py-2 px-3 border">{date.PAUSA}</td>
              <td className="py-2 px-3 border">{date.CLIENTE}</td>
              <td className="py-2 px-3 border">{date.COMMESSA}</td>
              <td className="py-2 px-3 border">{date.NOTA}</td>
              <td className="py-2 px-3 border bg-white">
                {formatMinutesToTime(date.workedMinutes)}
              </td>
              <td className="py-2 px-3 border bg-black text-white">
                {formatMinutesToTime(date.straordinario)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DetailsTable.propTypes = {
  dates: PropTypes.arrayOf(
    PropTypes.shape({
      DATA: PropTypes.string.isRequired,
      INIZIO: PropTypes.string.isRequired,
      FINE: PropTypes.string.isRequired,
      PAUSA: PropTypes.string.isRequired,
      CLIENTE: PropTypes.string.isRequired,
      COMMESSA: PropTypes.string.isRequired,
      NOTA: PropTypes.string,
    })
  ).isRequired,
};

export default DetailsTable;
