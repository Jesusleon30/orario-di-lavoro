import React, { useEffect, useState } from "react"; // Importa React y hooks useEffect y useState
import PropTypes from "prop-types"; // Importa PropTypes para validar las props
import generateExcel from "./js/generateExcel"; // Importa la función para generar archivos Excel

// Definición del componente DetailsTable
const DetailsTable = ({ dates, setDates }) => {
  // Estado para almacenar mensajes de éxito o error
  const [message, setMessage] = useState({ text: "", type: "" });
  // Estado para almacenar los datos de tiempo
  const [timeData, setTimeData] = useState({
    dailyData: [], // Datos diarios
    totalMinutes: 0, // Total de minutos trabajados
    totalStraordinario: 0, // Total de horas extraordinarias
  });
  // Estado para saber si se ha descargado automáticamente
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  // Función para convertir tiempo en formato HH:MM a minutos
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0; // Devuelve 0 si el tiempo es vacío
    if (!/^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeString)) {
      throw new Error(
        `Formato tempo non valido: "${timeString}". Deve essere "HH:MM".`
      ); // Lanza un error si el formato es inválido
    }
    const [hours, minutes] = timeString.split(":").map(Number); // Convierte horas y minutos a números
    return hours * 60 + minutes; // Devuelve el total en minutos
  };

  // Hook para calcular los datos cada vez que cambian dates o autoDownloaded
  useEffect(() => {
    const hasAutoDownloaded = localStorage.getItem("hasAutoDownloaded"); // Verifica si ya se ha descargado automáticamente
    setAutoDownloaded(hasAutoDownloaded === "true"); // Actualiza el estado

    if (dates.length === 0) {
      setMessage({ text: " ", type: "error" }); // Muestra un mensaje de error si no hay fechas
      return; // Salir de la función
    }

    // Función para calcular los datos de tiempo
    const calculateTimeData = () => {
      let totalMinutes = 0; // Inicializa totalMinutes
      let totalStraordinario = 0; // Inicializa totalStraordinario

      // Mapea las fechas para calcular los minutos trabajados
      const dailyData = dates.map((date) => {
        try {
          const startMinutes = timeToMinutes(date.INIZIO); // Convierte el inicio a minutos
          const startMinutesPausa = timeToMinutes(date.PAUSA); // Convierte la pausa a minutos
          const endMinutes = timeToMinutes(date.FINE); // Convierte el final a minutos
          const workedMinutes = endMinutes - startMinutes - startMinutesPausa; // Calcula los minutos trabajados

          // Si se trabajaron minutos positivos
          if (workedMinutes > 0) {
            totalMinutes += workedMinutes; // Acumula los minutos trabajados
            if (workedMinutes > 480) {
              totalStraordinario += workedMinutes - 480; // Calcula las horas extraordinarias
            }
          }

          return {
            ...date, // Retorna todos los campos de la fecha
            workedMinutes, // Agrega los minutos trabajados
            straordinario: workedMinutes > 480 ? workedMinutes - 480 : 0, // Agrega horas extraordinarias
          };
        } catch (error) {
          console.error("Errore nel calcolo dei dati temporali:", error); // Loguea errores
          return { ...date, workedMinutes: 0, straordinario: 0 }; // Retorna la fecha con 0 minutos trabajados y extraordinarios
        }
      });

      return { dailyData, totalMinutes, totalStraordinario }; // Retorna los datos calculados
    };

    try {
      const { dailyData, totalMinutes, totalStraordinario } =
        calculateTimeData(); // Calcula los datos de tiempo
      setTimeData({ dailyData, totalMinutes, totalStraordinario }); // Actualiza el estado con los datos calculados

      // Si hay más de 12 días y no se ha descargado automáticamente
      if (dailyData.length >= 12 && !autoDownloaded) {
        const isValid = dailyData.every(
          (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA // Verifica que todos los campos estén llenos
        );

        if (!isValid) {
          setMessage({
            text: "Per favore completa tutti i campi prima di scaricare.",
            type: "error", // Muestra un mensaje de error si faltan campos
          });
          return; // Salir de la función
        }

        const name = prompt(
          "Per favore inserisci il tuo nome e cognome per il download automatico:",
          ""
        ); // Pide el nombre del usuario
        if (!name) {
          setMessage({
            text: "Devi inserire il tuo nome e cognome per il download automatico.",
            type: "error", // Muestra un mensaje de error si no se ingresa nombre
          });
          return; // Salir de la función
        }

        // Llama a la función para descargar el archivo Excel
        handleDownloadExcel(dailyData, totalMinutes, totalStraordinario, name);
        setAutoDownloaded(true); // Marca como descargado automáticamente
        localStorage.setItem("hasAutoDownloaded", "true"); // Almacena en localStorage
      }
    } catch (error) {
      console.error("Errore durante il calcolo del tempo:", error); // Loguea errores
      setMessage({
        text: "Errore nel calcolo dei dati temporali.",
        type: "error", // Muestra un mensaje de error si hay problemas en el cálculo
      });
    }
  }, [dates, autoDownloaded]); // Dependencias del efecto

  // Función para formatear minutos a tiempo en formato HH:MM
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0"); // Calcula y formatea horas
    const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calcula y formatea minutos restantes
    return `${hours}:${remainingMinutes}`; // Retorna el tiempo formateado
  };

  // Función para manejar la descarga del archivo Excel
  const handleDownloadExcel = (
    dailyData,
    totalMinutes,
    totalStraordinario,
    name
  ) => {
    setMessage({ text: "", type: "" }); // Limpia el mensaje

    if (dailyData.length === 0) {
      setMessage({ text: "Nessun dato da scaricare.", type: "error" }); // Mensaje de error si no hay datos
      return; // Salir de la función
    }

    if (!name) {
      setMessage({
        text: "Devi inserire il tuo nome e cognome per scaricare il file.",
        type: "error", // Mensaje de error si no se ingresa nombre
      });
      return; // Salir de la función
    }

    // Verifica que todos los campos estén llenos
    const isValid = dates.every(
      (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA
    );
    if (!isValid) {
      setMessage({
        text: "Alcuni dati sono mancanti, verifica che INIZIO - FINE - PAUSA siano compilati. GRAZIE 😉",
        type: "error", // Mensaje de error si faltan campos
      });
      return; // Salir de la función
    }

    // Prepara los datos para el archivo Excel
    const excelData = dailyData.map((date) => ({
      DATA: date.DATA,
      INIZIO: date.INIZIO,
      FINE: date.FINE,
      PAUSA: date.PAUSA,
      CLIENTE: date.CLIENTE,
      COMMESSA: date.COMMESSA,
      NOTA: date.NOTA,
      Ore_Lavorate: formatMinutesToTime(date.workedMinutes),
      Ore_Straordinarie: formatMinutesToTime(date.straordinario),
    }));

    // Agrega una fila de totales
    excelData.push({
      DATA: "Totale",
      INIZIO: "",
      FINE: "",
      PAUSA: "",
      CLIENTE: "",
      COMMESSA: "",
      NOTA: "",
      Ore_Lavorate: formatMinutesToTime(totalMinutes),
      Ore_Straordinarie: formatMinutesToTime(totalStraordinario),
    });

    try {
      generateExcel(excelData, name); // Genera el archivo Excel
      setMessage({ text: "Excel scaricato con successo! 👍", type: "success" }); // Mensaje de éxito
    } catch (error) {
      console.error("Errore durante la generazione dell'Excel:", error); // Loguea errores
      setMessage({
        text: "Si è verificato un errore durante la generazione del file Excel.",
        type: "error", // Mensaje de error si ocurre un problema
      });
    }
  };

  // Función para manejar la eliminación de un día
  const handleDelete = (index) => {
    try {
      if (window.confirm("Sei sicuro di voler eliminare questo giorno?")) {
        const updatedDates = dates.filter((_, i) => i !== index); // Filtra las fechas para eliminar la seleccionada
        setDates(updatedDates); // Actualiza las fechas en el componente padre
        localStorage.setItem("dates", JSON.stringify(updatedDates)); // Persistir cambios en localStorage
        setMessage({ text: "Giorno eliminato con successo!", type: "success" }); // Mensaje de éxito

        // Verifica si después de la eliminación solo queda una entrada
        if (updatedDates.length === 0) {
          window.location.reload(); // Recarga la página solo si no quedan entradas
        }
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione del giorno:", error); // Loguea el error
      setMessage({
        text: "Si è verificato un errore durante l'eliminazione del giorno.",
        type: "error", // Mensaje de error si ocurre un problema
      });
    }
  };

  // Renderizado del componente
  return (
    <div className="flex flex-col items-center justify-between gap-3 p-5 bg-gray-800 rounded-lg shadow-lg">
      <button
        className="bg-gray-400 rounded text-black border-2 hover:bg-[#60a5fa] p-2 font-semibold"
        onClick={() =>
          handleDownloadExcel(
            timeData.dailyData,
            timeData.totalMinutes,
            timeData.totalStraordinario,
            prompt(
              "Prima di scaricare il file, inserisci il tuo nome e cognome:"
            ) // Pide el nombre antes de descargar
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

      {/* Tabla con los datos de tiempo */}
      <table className="bg-[#cccfe2]">
        <thead>
          <tr className="bg-[#ff9900]  border-b-2 border-blue-600 flex flex-wrap">
            <th className="py-2 px-3 border text-left">DATA</th>
            <th className="py-2 px-3 border text-left">INIZIO</th>
            <th className="py-2 px-3 border text-left">FINE</th>
            <th className="py-2 px-3 border text-left">PAUSA</th>
            <th className="py-2 px-3 border text-left">CLIENTE</th>
            <th className="py-2 px-3 border text-left">COMMESSA</th>
            <th className="py-2 px-3 border text-left">NOTA</th>
            <th className="py-2 px-3 border text-left bg-white">
              Ore Lavorate
            </th>
            <th className="py-2 px-3 border text-left bg-[#102a45] text-white">
              Ore Straordinarie
            </th>
          </tr>
        </thead>
        <tbody>
          {timeData.dailyData.map((date, index) => (
            <tr
              key={index}
              className="hover:bg-[#60a5fa] transition border-b-2 border-blue-600 flex flex-wrap"
            >
              <td className="py-2 px-3 border font-semibold">{date.DATA}</td>
              <td className="py-2 px-3 border">{date.INIZIO}</td>
              <td className="py-2 px-3 border">{date.FINE}</td>
              <td className="py-2 px-3 border">{date.PAUSA}</td>
              <td className="py-2 px-3 border">{date.CLIENTE}</td>
              <td className="py-2 px-3 border">{date.COMMESSA}</td>
              <td className="py-2 px-3 border">{date.NOTA}</td>
              <td className="py-2 px-3 bg-white">
                {formatMinutesToTime(date.workedMinutes)}
              </td>
              <td className="py-2 px-3 bg-[#102a45] text-white">
                {formatMinutesToTime(date.straordinario)}
              </td>
              <td className="py-2 px-3 border hover:bg-[#ebf372] rounded-full bg-[#421010] text-white text-center">
                <button onClick={() => handleDelete(index)}>
                  <img
                    className="w-[20px] h-[20px]"
                    src="./assets/iconsLogo/cestino-2.png"
                    alt="Elimina" // Icono de eliminar
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validación de las props del componente
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
  setDates: PropTypes.func.isRequired,
};

export default DetailsTable; // Exporta el componente
