import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import generateExcel from "./js/generateExcel";


// Componente que representa la tabla de detalles
export function DetailsTable({ dates }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDownloadExcel = useCallback(() => {
    setErrorMessage(""); // Reiniciar mensajes de error
    setSuccessMessage(""); // Reiniciar mensajes de éxito

    if (dates.length === 0) {
      setErrorMessage("Il file Excel è vuoto.");
      return;
    }

    if (window.confirm("Sei sicuro di scaricare in Excel?")) {
      try {
        // Validar datos antes de intentar generar el Excel
        const isValid = dates.every((date) => {
          return (
            date.DATA &&
            date.INIZIO &&
            date.FINE &&
            date.PAUSA &&
            date.CLIENTE &&
            date.NOTA_COMMESSA
          );
        });

        if (!isValid) {
          setErrorMessage("Alcuni dati sono mancanti o non validi.");
          return;
        }

        // Intentar generar el archivo Excel con los datos proporcionados
        generateExcel(dates);
        setSuccessMessage("Excel scaricato con successo!"); // Mensaje de éxito
      } catch (error) {
        console.error("Errore durante la generazione dell'Excel:", error);
        setErrorMessage(
          "Si è verificato un errore durante la generazione dell'Excel."
        );
      }
    }
  }, [dates]);

  return (
    <div className="  flex flex-col items-center justify-between gap-5 p-5 bg-gray-800 rounded-lg shadow-lg ">
      <button
        className="bg-gray-400 rounded text-black border-2 hover:bg-black hover:text-white border-black p-2 font-semibold"
        onClick={handleDownloadExcel}
        aria-label="Scarica Excel"
      >
        SCARICARE EXCEL
      </button>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      <table className=" bg-yellow-300   ">
        <thead>
          <tr className="bg-yellow-500 border-b-2 border-blue-600 flex flex-wrap  ">
            <th className="py-2 px-3 text-left">DATA</th>
            <th className="py-2 px-3 text-left">INIZIO</th>
            <th className="py-2 px-3 text-left">FINE</th>
            <th className="py-2 px-3 text-left">PAUSA</th>
            <th className="py-2 px-3 text-left">CLIENTE</th>
            <th className="py-2 px-3 text-left">NOTA-COMMESSA</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date, index) => (
            <tr
              key={index}
              className=" hover:bg-blue-500 transition flex flex-wrap m-2 gap-2 border-b-2 border-blue-600 my-3"
            >
              <td className="py-2 px-3 border">{date.DATA}</td>
              <td className="py-2 px-3 border">{date.INIZIO}</td>
              <td className="py-2 px-3 border">{date.FINE}</td>
              <td className="py-2 px-3 border">{date.PAUSA}</td>
              <td className="py-2 px-3 border">
                {typeof date.CLIENTE === "string"
                  ? date.CLIENTE
                  : date.CLIENTE && typeof date.CLIENTE === "object"
                  ? JSON.stringify(date.CLIENTE)
                  : ""}
              </td>
              <td className="py-3 px-6 border">{date.NOTA_COMMESSA}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Definición de las propiedades esperadas
DetailsTable.propTypes = {
  dates: PropTypes.arrayOf(
    PropTypes.shape({
      DATA: PropTypes.string,
      INIZIO: PropTypes.string,
      FINE: PropTypes.string,
      PAUSA: PropTypes.string,
      NOTA_COMMESSA: PropTypes.string,
      CLIENTE: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.oneOf([null]), // Manejar null
      ]),
    })
  ).isRequired,
};
