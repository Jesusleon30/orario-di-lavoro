import React, { useCallback, useState } from "react"; // Importa React y hooks
import PropTypes from "prop-types"; // Importa PropTypes para la validación de propiedades
import generateExcel from "./js/generateExcel"; // Importa la función para generar el archivo Excel

// Componente que representa la tabla de detalles
const DetailsTable = ({ dates }) => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userName, setUserName] = useState(""); // Estado para almacenar el nombre del usuario

  // Función que maneja la descarga del archivo Excel
  const handleDownloadExcel = useCallback(() => {
    setMessage({ text: "", type: "" });

    if (dates.length === 0) {
      setMessage({ text: "Il file Excel è vuoto.", type: "error" });
      return;
    }

    // Pide el nombre del usuario antes de continuar
    const name = prompt("Prima di scaricare il file, inserisci il tuo nome e cognome:", "");
    if (name) {
      setUserName(name); // Guardar el nombre en el estado

      // Verifica que todos los datos necesarios estén presentes
      const isValid = dates.every(
        (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA
      );

      if (!isValid) {
        setMessage({
          text: "Alcuni dati sono mancanti.",
          type: "error",
        });
        return;
      }

      try {
        // Llama a la función para generar el archivo Excel con el nombre del usuario
        generateExcel(dates, name);
        setMessage({ text: "Excel scaricato con successo!", type: "success" });
      } catch (error) {
        console.error("Errore durante la generazione dell'Excel:", error);
        setMessage({
          text: "Si è verificato un errore durante la generazione dell'Excel.",
          type: "error",
        });
      }
    }
  }, [dates]); // Dependencia del hook

  return (
    <div className="flex flex-col items-center justify-between gap-5 p-5 bg-gray-800 rounded-lg shadow-lg">
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
          </tr>
        </thead>
        <tbody>
          {dates.map((date, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validación de las propiedades del componente
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

// Exporta el componente para su uso en otras partes de la aplicación
export default DetailsTable;
