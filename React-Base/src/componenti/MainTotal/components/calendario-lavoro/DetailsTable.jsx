import React, { useCallback, useState } from "react"; // Importa React y hooks
import PropTypes from "prop-types"; // Importa PropTypes para la validación de propiedades
import generateExcel from "./js/generateExcel"; // Importa la función para generar el archivo Excel
import "./css/tabla.css"; // Importa el archivo de estilos CSS

// Componente que representa la tabla de detalles
const DetailsTable = ({ dates }) => {
  // Estado para manejar los mensajes de éxito o error
  const [message, setMessage] = useState({ text: "", type: "" });

  // Función que maneja la descarga del archivo Excel
  const handleDownloadExcel = useCallback(() => {
    // Reinicia los mensajes al inicio de la función
    setMessage({ text: "", type: "" });

    // Verifica si la lista de fechas está vacía
    if (dates.length === 0) {
      // Muestra un mensaje de error si el archivo está vacío
      setMessage({ text: "Il file Excel è vuoto.", type: "error" });
      return; // Sale de la función
    }

    // Confirma que el usuario desea continuar con la descarga
    if (window.confirm("Sei sicuro di voler scaricare in Excel?")) {
      try {
        // Verifica que todos los datos necesarios estén presentes
        const isValid = dates.every(
          (date) =>
            date.DATA &&
            date.INIZIO &&
            date.FINE &&
            date.PAUSA 
            //date.CLIENTE &&
            //date.COMMESSA // Verifica todas las propiedades
        );

        // Si algunos datos son inválidos o faltan
        if (!isValid) {
          // Muestra un mensaje de error
          setMessage({
            text: "Alcuni dati sono mancanti.",
            type: "error",
          });
          return; // Sale de la función
        }

        // Llama a la función para generar el archivo Excel
        generateExcel(dates);
        // Muestra un mensaje de éxito
        setMessage({ text: "Excel scaricato con successo!", type: "success" });
      } catch (error) {
        // Maneja cualquier error que ocurra durante la generación del Excel
        console.error("Errore durante la generazione dell'Excel:", error);
        // Muestra un mensaje de error
        setMessage({
          text: "Si è verificato un errore durante la generazione dell'Excel.",
          type: "error",
        });
      }
    }
  }, [dates]); // Dependencia del hook: se actualiza cuando cambia 'dates'

  return (
    <div className="flex flex-col items-center justify-between gap-5 p-5 bg-gray-800 rounded-lg shadow-lg">
      {/* Botón para descargar el archivo Excel */}
      <button
        className="bg-gray-400 rounded text-black border-2 hover:bg-white p-2 font-semibold"
        onClick={handleDownloadExcel} // Llama a la función de descarga al hacer clic
        aria-label="Scarica Excel" // Accesibilidad: etiqueta para lectores de pantalla
      >
        SCARICA EXCEL
      </button>
      
      {/* Muestra el mensaje de error o éxito si existe */}
      {message.text && (
        <div className={message.type === "error" ? "text-red-500" : "text-green-500"}>
          {message.text}
        </div>
      )}

      {/* Tabla que muestra los datos */}
      <table className="bg-yellow-300">
        <thead>
          <tr className="bg-yellow-500 border-b-2 border-blue-600 flex flex-wrap">
            {/* Encabezados de la tabla */}
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
          {/* Mapea cada elemento de 'dates' para crear una fila en la tabla */}
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