import React, { useCallback, useEffect, useState } from "react"; // Importa React y hooks
import PropTypes from "prop-types"; // Importa PropTypes per la validazione delle proprietà
import generateExcel from "./js/generateExcel"; // Importa la funzione per generare l'Excel

const DetailsTable = ({ dates }) => { // Definisce il componente DetailsTable e accetta la proprietà 'dates'
  // Stato per gestire i messaggi (successo/errore)
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userName, setUserName] = useState(""); // Stato per il nome utente
  const [timeData, setTimeData] = useState({ // Stato per i dati di tempo
    dailyData: [], // Dati giornalieri
    totalMinutes: 0, // Totale minuti lavorati
    totalStraordinario: 0, // Totale straordinario
  });

  // Funzione per convertire la stringa di tempo in minuti
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0; // Gestisce la stringa di tempo vuota

    // Convalida il formato del tempo "HH:MM"
    if (!/^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeString)) {
      throw new Error(
        `Formato di tempo non valido: "${timeString}". Deve essere "HH:MM".`
      );
    }

    const [hours, minutes] = timeString.split(":").map(Number); // Estrae ore e minuti
    return hours * 60 + minutes; // Ritorna il totale in minuti
  };

  // Effetto per calcolare i dati di tempo ogni volta che 'dates' cambia
  useEffect(() => {
    if (dates.length === 0) { // Controlla se l'array 'dates' è vuoto
      setMessage({ text: " ", type: "error" }); // Imposta un messaggio di errore
      return; // Esce dalla funzione
    }

    const calculateTimeData = () => { // Funzione per calcolare i dati di tempo
      let totalMinutes = 0; // Inizializza il totale minuti
      let totalStraordinario = 0; // Inizializza il totale straordinario

      // Processa ogni data per calcolare i minuti lavorati e gli straordinari
      const dailyData = dates.map((date) => {
        try {
          const startMinutes = timeToMinutes(date.INIZIO); // Converte l'inizio in minuti
          const startMinutesPausa = timeToMinutes(date.PAUSA); // Converte la pausa in minuti
          const endMinutes = timeToMinutes(date.FINE); // Converte la fine in minuti
          const workedMinutes = endMinutes - startMinutes - startMinutesPausa; // Calcola i minuti lavorati

          // Assicura che i minuti lavorati siano positivi
          if (workedMinutes > 0) {
            totalMinutes += workedMinutes; // Aggiunge ai minuti totali
            if (workedMinutes > 480) { // Se i minuti lavorati superano 8 ore
              totalStraordinario += workedMinutes - 480; // Calcola lo straordinario
            }
          }

          return {
            ...date, // Ritorna tutti i dati della data
            workedMinutes, // Aggiunge i minuti lavorati
            straordinario: workedMinutes > 480 ? workedMinutes - 480 : 0, // Aggiunge gli straordinari
          };
        } catch (error) {
          console.error("Errore nel calcolo dei dati di tempo:", error); // Logga l'errore
          return { ...date, workedMinutes: 0, straordinario: 0 }; // Ritorna la data con valori di tempo a 0
        }
      });

      return { dailyData, totalMinutes, totalStraordinario }; // Ritorna i dati giornalieri e i totali
    };

    try {
      const { dailyData, totalMinutes, totalStraordinario } = calculateTimeData(); // Calcola i dati di tempo
      setTimeData({ dailyData, totalMinutes, totalStraordinario }); // Imposta i dati di tempo nello stato
    } catch (error) {
      console.error("Errore durante il calcolo dei dati di tempo:", error); // Logga l'errore
      setMessage({ text: "Errore nel calcolo dei dati.", type: "error" }); // Imposta un messaggio di errore
    }
  }, [dates]); // Dipendenza: esegue quando 'dates' cambia

  // Funzione per formattare i minuti in "HH:MM"
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) // Calcola le ore
      .toString()
      .padStart(2, "0"); // Formatta le ore con due cifre
    const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calcola i minuti rimanenti
    return `${hours}:${remainingMinutes}`; // Ritorna il formato "HH:MM"
  };

  // Funzione per gestire il download dell'Excel
  const handleDownloadExcel = useCallback(() => {
    setMessage({ text: "", type: "" }); // Reset del messaggio

    if (dates.length === 0) { // Controlla se l'array 'dates' è vuoto
      setMessage({ text: "Il file Excel è vuoto.", type: "error" }); // Messaggio di errore
      return; // Esce dalla funzione
    }

    const name = prompt( // Chiede all'utente il nome
      "Prima di scaricare il file, inserisci il tuo nome e cognome:",
      ""
    );
    if (!name) { // Controlla se il nome è stato inserito
      setMessage({
        text: "Devi inserire il tuo nome e cognome.",
        type: "error", // Messaggio di errore
      });
      return; // Esce dalla funzione
    }
    setUserName(name); // Imposta il nome utente

    // Valida che tutti i campi necessari siano presenti
    const isValid = dates.every(
      (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA // Controlla i campi richiesti
    );
    if (!isValid) { // Se ci sono dati mancanti
      setMessage({ text: "Alcuni dati sono mancanti.", type: "error" }); // Messaggio di errore
      return; // Esce dalla funzione
    }

    // Prepara i dati per l'esportazione in Excel
    const excelData = timeData.dailyData.map((date) => ({
      DATA: date.DATA, // Data
      INIZIO: date.INIZIO, // Orario di inizio
      FINE: date.FINE, // Orario di fine
      PAUSA: date.PAUSA, // Durata della pausa
      CLIENTE: date.CLIENTE, // Nome del cliente
      COMMESSA: date.COMMESSA, // Nome del progetto
      NOTA: date.NOTA, // Note
      Ore_Lavorate: formatMinutesToTime(date.workedMinutes), // Ore lavorate formattate
      Ore_Straordinarie: formatMinutesToTime(date.straordinario), // Ore straordinarie formattate
    }));

    // Aggiunge la riga dei totali
    excelData.push({
      DATA: "Totale", // Indica che questa è la riga dei totali
      INIZIO: "",
      FINE: "",
      PAUSA: "",
      CLIENTE: "",
      COMMESSA: "",
      NOTA: "",
      Ore_Lavorate: formatMinutesToTime(timeData.totalMinutes), // Totale ore lavorate
      Ore_Straordinarie: formatMinutesToTime(timeData.totalStraordinario), // Totale ore straordinarie
    });

    try {
      generateExcel(excelData, name); // Genera il file Excel
      setMessage({ text: "Excel scaricato con successo!", type: "success" }); // Messaggio di successo
    } catch (error) {
      console.error("Errore durante la generazione dell'Excel:", error); // Logga l'errore
      setMessage({
        text: "Si è verificato un errore durante la generazione dell'Excel.",
        type: "error", // Messaggio di errore
      });
    }
  }, [dates, timeData]); // Dipendenze: esegue quando 'dates' o 'timeData' cambiano

  return (
    <div className="flex flex-col items-center justify-between gap-3 p-5 bg-gray-800 rounded-lg shadow-lg">
      <button
        className="bg-gray-400 rounded text-black border-2 hover:bg-white p-2 font-semibold"
        onClick={handleDownloadExcel}
        aria-label="Scarica Excel"
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
