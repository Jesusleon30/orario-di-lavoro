import React, { useCallback, useState } from "react"; // Importamos React y hooks
import PropTypes from "prop-types"; // Importamos PropTypes para la validación de props
import generateExcel from "./js/generateExcel"; // Importamos la función para generar el archivo Excel

// Componente principal que recibe una lista de fechas
const DetailsTable = ({ dates }) => {
  // Estado para mostrar mensajes al usuario (éxito o error)
  const [message, setMessage] = useState({ text: "", type: "" });
  // Estado para almacenar el nombre del usuario
  const [userName, setUserName] = useState("");

  // Función para convertir una cadena de tiempo "HH:mm" a minutos
  const timeToMinutes = (timeString) => {
    try {
      // Separamos horas y minutos y convertimos a número
      const [hours, minutes] = timeString.split(":").map(Number);
      // Verificamos que las horas y minutos sean números válidos
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Formato de tiempo no válido"); // Lanzamos error si el formato es incorrecto
      }
      return hours * 60 + minutes; // Retornamos el total de minutos
    } catch (error) {
      setMessage({ text: error.message, type: "error" }); // Mostramos mensaje de error si ocurre una excepción
      return 0; // Devuelve 0 si hay un error en la conversión
    }
  };

  // Función para calcular los datos de tiempo trabajados
  const calculateTimeData = () => {
    let totalMinutes = 0; // Inicializamos el total de minutos trabajados
    let totalStraordinario = 0; // Inicializamos el total de horas extraordinarias

    // Mapeamos cada fecha para calcular el tiempo trabajado
    const dailyData = dates.map((date) => {
      try {
        // Convertimos los tiempos de inicio, fin y pausa a minutos
        const startMinutes = timeToMinutes(date.INIZIO);
        const startMinutesPausa = timeToMinutes(date.PAUSA);
        const endMinutes = timeToMinutes(date.FINE);
        const workedMinutes = endMinutes - startMinutes - startMinutesPausa; // Calculamos el tiempo trabajado

        // Solo sumamos si el tiempo trabajado es positivo
        if (workedMinutes > 0) {
          totalMinutes += workedMinutes; // Acumulamos minutos trabajados

          // Si se han trabajado más de 8 horas, calculamos las horas extraordinarias
          if (workedMinutes > 480) {
            const straordinario = workedMinutes - 480; // Calculamos horas extraordinarias
            totalStraordinario += straordinario; // Acumulamos horas extraordinarias
          }
        }

        return {
          ...date, // Retornamos los datos originales con información adicional
          workedMinutes,
          straordinario: workedMinutes > 480 ? workedMinutes - 480 : 0, // Asignamos horas extraordinarias
        };
      } catch (error) {
        console.error("Error al calcular datos de tiempo:", error); // Log de errores
        return { ...date, workedMinutes: 0, straordinario: 0 }; // Retornamos 0 en caso de error
      }
    });

    return { dailyData, totalMinutes, totalStraordinario }; // Retornamos los datos calculados
  };

  // Llamamos a la función para calcular los datos
  const { dailyData, totalMinutes, totalStraordinario } = calculateTimeData();

  // Función para formatear minutos a cadena "HH:mm"
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0"); // Calculamos las horas y las formateamos
    const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calculamos los minutos restantes
    return `${hours}:${remainingMinutes}`; // Retornamos la cadena formateada
  };

  // Función para manejar la descarga del archivo Excel
  const handleDownloadExcel = useCallback(() => {
    setMessage({ text: "", type: "" }); // Reiniciamos el mensaje

    if (dates.length === 0) {
      // Verificamos si hay fechas
      setMessage({ text: "Il file Excel è vuoto.", type: "error" }); // Mensaje de error si no hay datos
      return;
    }

    try {
      // Pedimos el nombre al usuario
      const name = prompt(
        "Prima di scaricare il file, inserisci il tuo nome e cognome:",
        ""
      );

      if (!name) {
        // Verificamos si el nombre fue ingresado
        setMessage({
          text: "Devi inserire il tuo nome e cognome.",
          type: "error",
        }); // Mensaje de error
        return;
      }

      setUserName(name); // Guardamos el nombre del usuario

      // Verificamos si todos los datos necesarios están presentes
      const isValid = dates.every(
        (date) => date.DATA && date.INIZIO && date.FINE && date.PAUSA
      );
      if (!isValid) {
        setMessage({ text: "Alcuni dati sono mancanti.", type: "error" }); // Mensaje de error si faltan datos
        return;
      }

      // Preparamos los datos para el archivo Excel
      const excelData = dailyData.map((date) => ({
        DATA: date.DATA,
        INIZIO: date.INIZIO,
        FINE: date.FINE,
        PAUSA: date.PAUSA,
        CLIENTE: date.CLIENTE,
        COMMESSA: date.COMMESSA,
        NOTA: date.NOTA,
        Ore_Lavorate: formatMinutesToTime(date.workedMinutes), // Formateamos horas trabajadas
        Ore_Straordinarie: formatMinutesToTime(date.straordinario), // Formateamos horas extraordinarias
      }));

      // Agregamos una fila con los totales
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

      generateExcel(excelData, name); // Llamamos a la función para generar el Excel
      setMessage({ text: "Excel scaricato con successo!", type: "success" }); // Mensaje de éxito
    } catch (error) {
      console.error("Errore durante la generazione dell'Excel:", error); // Log de errores
      setMessage({
        text: "Si è verificato un errore durante la generazione dell'Excel.",
        type: "error",
      }); // Mensaje de error
    }
  }, [dates]);

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

      <div className="text-white ">
        <p>
          Totale ore lavorate: {Math.floor(totalMinutes / 60)}h{" "}
          {totalMinutes % 60}m
        </p>
        <p>
          Totale Ore straordinarie: {Math.floor(totalStraordinario / 60)}h{" "}
          {totalStraordinario % 60}m
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
            <th className="py-2 px-3 text-left bg-white ">Ore Lavorate</th>
            <th className="py-2 px-3 text-left bg-black text-white">
              Ore Straordinarie
            </th>
          </tr>
        </thead>
        <tbody>
          {dailyData.map((date, index) => (
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
