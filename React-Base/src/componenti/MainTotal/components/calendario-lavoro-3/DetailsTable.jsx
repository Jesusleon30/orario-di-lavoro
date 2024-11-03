import React, { useEffect, useState } from "react"; // Importa React y los hooks useEffect y useState
import PropTypes from "prop-types"; // Importa PropTypes para la validación de tipos
import generateExcel from "./js/generateExcel"; // Importa la función para generar archivos Excel
import { toast } from "react-toastify"; // Importa la función para mostrar notificaciones

// Función para validar que todas las entradas tengan una fecha válida
const validateDates = (dates) => dates.every((entry) => entry.DATA);

// Función para formatear minutos en una cadena "HH:MM"
const formatMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0"); // Calcula las horas y asegura que tenga dos dígitos
  const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calcula los minutos restantes
  return `${hours}:${remainingMinutes}`; // Retorna la cadena formateada
};

// Función para convertir una cadena de tiempo "HH:MM" en minutos
const timeToMinutes = (timeString) => {
  if (!timeString) return 0; // Devuelve 0 si no hay cadena de tiempo
  const regex = /^([01]?\d|2[0-3]):([0-5]\d)$/; // Expresión regular para validar el formato "HH:MM"
  if (!regex.test(timeString)) {
    // Si no coincide con el formato
    toast.error(
      `Formato orario non valido: "${timeString}". Deve essere "HH:MM".`
    ); // Muestra un error
    return 0; // Devuelve 0
  }
  const [hours, minutes] = timeString.split(":").map(Number); // Separa la cadena en horas y minutos
  return hours * 60 + minutes; // Devuelve el total de minutos
};

// Función para calcular los datos trabajados de las entradas
const calculateWorkedData = (entries) => {
  const startMinutes = timeToMinutes(entries[0].INIZIO); // Convierte la hora de inicio a minutos
  const endMinutes = Math.max(
    ...entries.map((entry) => timeToMinutes(entry.FINE))
  ); // Encuentra la hora de fin máxima
  const totalPause = entries.reduce(
    // Suma todas las pausas
    (acc, entry) => acc + timeToMinutes(entry.PAUSA || "00:00"),
    0
  );
  const workedMinutes = endMinutes - startMinutes - totalPause; // Calcula los minutos trabajados
  return {
    workedMinutes: Math.max(0, workedMinutes), // Asegura que los minutos trabajados no sean negativos
    straordinario: workedMinutes > 480 ? workedMinutes - 480 : 0, // Calcula horas extraordinarias si son más de 8 horas
  };
};

// Componente principal que representa la tabla de detalles
const DetailsTable = ({ dates, setDates }) => {
  const [timeData, setTimeData] = useState({
    // Estado para almacenar datos de tiempo
    dailyData: [],
    totalMinutes: 0,
    totalStraordinario: 0,
  });
  const [isEditable, setIsEditable] = useState(true); // Estado para controlar si la tabla es editable
  const [name, setName] = useState(
    () => localStorage.getItem("userName") || ""
  ); // Estado para almacenar el nombre del usuario, recuperado de localStorage

  // Función para calcular los datos de tiempo
  const calculateTimeData = () => {
    try {
      let totalMinutes = 0; // Inicializa el total de minutos
      let totalStraordinario = 0; // Inicializa el total de horas extraordinarias
      const groupedData = {}; // Objeto para agrupar datos por fecha

      dates.forEach((entry) => {
        // Itera sobre cada entrada
        const { DATA, INIZIO, FINE } = entry; // Desestructura los campos relevantes
        if (!DATA || !INIZIO || !FINE) {
          // Verifica si hay datos incompletos
          toast.warn(`Dati incompleti per l'entrata: ${JSON.stringify(entry)}`); // Muestra una advertencia
          return; // Salir si hay datos incompletos
        }
        const dateKey = DATA; // Usa la fecha como clave
        if (!groupedData[dateKey]) groupedData[dateKey] = []; // Inicializa el grupo si no existe
        groupedData[dateKey].push(entry); // Agrega la entrada al grupo correspondiente
      });

      const dailyData = Object.entries(groupedData).flatMap(
        ([dateKey, entries]) => {
          // Convierte el objeto agrupado en un array
          entries.sort(
            (a, b) => timeToMinutes(a.INIZIO) - timeToMinutes(b.INIZIO)
          ); // Ordena las entradas por hora de inicio
          const workedData = calculateWorkedData(entries); // Calcula los datos trabajados
          totalMinutes += workedData.workedMinutes; // Suma los minutos trabajados al total
          totalStraordinario += workedData.straordinario; // Suma las horas extraordinarias al total

          return entries.map((entry, index) => ({
            // Mapea las entradas a un nuevo formato
            ...entry,
            workedMinutes: index === 0 ? workedData.workedMinutes : "", // Solo muestra los minutos trabajados en la primera entrada
            straordinario:
              index === 0 && workedData.workedMinutes > 480
                ? workedData.workedMinutes - 480
                : "", // Solo muestra las horas extra en la primera entrada si corresponde
          }));
        }
      );

      return { dailyData, totalMinutes, totalStraordinario }; // Devuelve los datos calculados
    } catch (error) {
      toast.error("Errore nel calcolare i dati: " + error.message); // Muestra un error si ocurre algún problema
      return { dailyData: [], totalMinutes: 0, totalStraordinario: 0 }; // Retorna valores vacíos
    }
  };

  // Efecto para calcular los datos cada vez que cambian las fechas
  useEffect(() => {
    try {
      if (!validateDates(dates)) {
        // Valida las fechas
        toast.error("Assicurati che tutte le voci abbiano DATA."); // Muestra un error si hay fechas inválidas
        return; // Salir si hay error
      }

      const { dailyData, totalMinutes, totalStraordinario } =
        calculateTimeData(); // Calcula los datos de tiempo
      setTimeData({ dailyData, totalMinutes, totalStraordinario }); // Actualiza el estado de timeData

      const hasDownloaded = localStorage.getItem("hasDownloaded"); // Comprueba si ya se descargó el archivo
      const storedName = localStorage.getItem("userName"); // Recupera el nombre almacenado

      if (dailyData.length >= 12 && !hasDownloaded) {
        // Si hay suficientes datos y no se ha descargado aún
        const excelData = prepareExcelData(
          dailyData,
          totalMinutes,
          totalStraordinario
        ); // Prepara los datos para Excel
        generateExcel(excelData, storedName); // Genera el archivo Excel
        localStorage.setItem("hasDownloaded", "true"); // Marca que se ha descargado
        toast.success("Excel scaricato automaticamente! 👍"); // Muestra un mensaje de éxito
      }
    } catch (error) {
      toast.error("Errore nel processare le date: " + error.message); // Muestra un error si ocurre algún problema
    }
  }, [dates]); // Se ejecuta cada vez que cambia el array dates

  // Función para manejar la descarga del archivo Excel
  const handleDownloadExcel = () => {
    try {
      if (!name) {
        // Verifica si el nombre está vacío
        toast.error("Devi inserire un nome per il file!"); // Muestra un error
        return; // Salir si hay error
      }

      const confirmDownload = window.confirm(
        "Sei sicuro di voler scaricare il file Excel?"
      ); // Pide confirmación para descargar
      if (!confirmDownload) {
        // Si no se confirma
        toast.info("Download annullato."); // Muestra un mensaje de cancelación
        return; // Salir
      }

      const { dailyData, totalMinutes, totalStraordinario } = timeData; // Recupera los datos de tiempo
      const excelData = prepareExcelData(
        dailyData,
        totalMinutes,
        totalStraordinario
      ); // Prepara los datos para Excel

      generateExcel(excelData, name); // Genera el archivo Excel
      toast.success("Excel scaricato con successo! 👍"); // Muestra un mensaje de éxito
    } catch (error) {
      toast.error("Errore nel scaricare il file: " + error.message); // Muestra un error si ocurre algún problema
    }
  };

  // Función para preparar los datos para el archivo Excel
  const prepareExcelData = (dailyData, totalMinutes, totalStraordinario) => {
    try {
      // Mapea los datos diarios a un formato adecuado para Excel
      const excelData = dailyData.map((entry) => {
        // Formatea los minutos trabajados y las horas extraordinarias
        const workedTime = formatMinutesToTime(entry.workedMinutes);
        const extraHours = formatMinutesToTime(entry.straordinario);

        return {
          // Crea un objeto que representa cada entrada
          DATA: entry.DATA, // Fecha de la entrada
          INIZIO: entry.INIZIO || "N/A", // Hora de inicio, muestra "N/A" si no está disponible
          FINE: entry.FINE || "N/A", // Hora de finalización, muestra "N/A" si no está disponible
          PAUSA: entry.PAUSA || "00:00", // Pausa, muestra "N/A" si no está disponible
          // Muestra "N/A" si el tiempo trabajado es "00:00", de lo contrario muestra el tiempo formateado
          Ore_Lavorate: workedTime === "00:00" ? "N/A" : workedTime,
          // Muestra "N/A" si las horas extraordinarias son "00:00", de lo contrario muestra el tiempo formateado
          Ore_Straordinarie: extraHours === "00:00" ? "N/A" : extraHours,
          CLIENTE: entry.CLIENTE || "N/A", // Cliente, muestra "N/A" si no está disponible
          COMMESSA: entry.COMMESSA || "N/A", // Comessa, muestra "N/A" si no está disponible
          NOTA: entry.NOTA || "N/A", // Nota, muestra "N/A" si no está disponible
        };
      });

      // Agrega una fila de totales al final del arreglo de datos
      excelData.push({
        DATA: "Totale", // Indica que esta fila representa totales
        INIZIO: "N/A", // No hay hora de inicio para el total
        FINE: "N/A", // No hay hora de finalización para el total
        PAUSA: "N/A", // No hay pausa para el total
        // Muestra "N/A" si el total de minutos es 0, de lo contrario muestra el tiempo formateado
        Ore_Lavorate:
          totalMinutes === 0 ? "N/A" : formatMinutesToTime(totalMinutes),
        // Muestra "N/A" si el total de horas extraordinarias es 0, de lo contrario muestra el tiempo formateado
        Ore_Straordinarie:
          totalStraordinario === 0
            ? "N/A"
            : formatMinutesToTime(totalStraordinario),
      });

      return excelData; // Retorna el arreglo de datos formateados para Excel
    } catch (error) {
      // Captura cualquier error que ocurra durante la ejecución
      console.error("Error preparing Excel data:", error);
      return []; // Devuelve un arreglo vacío en caso de error para evitar que la ejecución falle
    }
  };

  // Efecto para guardar el nombre en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("userName", name); // Almacena el nombre en localStorage
    } catch (error) {
      toast.error("Errore nel salvare il nome: " + error.message); // Muestra un error si ocurre algún problema
    }
  }, [name]); // Se ejecuta cada vez que cambia el estado name

  // Función para manejar el cambio de las entradas
  const handleInputChange = (index, field, value) => {
    try {
      if (!name) {
        toast.error("Devi inserire un nome per creare o modificare le voci!");
        return;
      }

      const updatedDates = [...dates];
      updatedDates[index][field] = value;

      setDates(updatedDates);
      localStorage.setItem("dates", JSON.stringify(updatedDates));
      toast.success("Entrata aggiornata con successo!");
    } catch (error) {
      toast.error("Errore nell'aggiornare l'entrata: " + error.message);
    }
  };
  // Función para manejar la eliminación de entradas
  const handleDelete = (index) => {
    if (window.confirm("Sei sicuro di voler eliminare questa entrata?")) {
      // Pide confirmación para eliminar
      try {
        const updatedDates = dates.filter((_, i) => i !== index); // Filtra el array para eliminar la entrada
        setDates(updatedDates); // Actualiza el estado de fechas
        localStorage.setItem("dates", JSON.stringify(updatedDates)); // Almacena las fechas actualizadas

        // Verifica si se está eliminando el índice 0
        if (index === 0) {
          localStorage.removeItem("userName"); // Elimina el userName de localStorage
        }

        if (updatedDates.length === 0) {
          // Si no quedan entradas
          localStorage.removeItem("dates"); // Elimina las fechas de localStorage
          localStorage.removeItem("hasDownloaded"); // Elimina la marca de descarga
          window.location.reload(); // Recarga la página
        } else {
          toast.success("Entrata eliminata con successo!"); // Muestra un mensaje de éxito
        }
      } catch (error) {
        toast.error("Errore nell'eliminare l'entrata: " + error.message); // Muestra un error si ocurre algún problema
      }
    }
  };

  // Función para manejar el cambio de nombre
  const handleNameChange = () => {
    const newName = prompt("Inserisci il tuo nome e cognome:", name); // Pide al usuario que ingrese su nombre
    if (newName !== null) {
      // Si el usuario no canceló
      setName(newName); // Actualiza el nombre
      toast.success("Nome aggiornato con successo!"); // Muestra un mensaje de éxito
    }
  };
  // Rendere il componente
  return (
    <div className="flex flex-col items-center justify-between gap-6 p-5 bg-gray-800 rounded-lg shadow-lg">
      {/* Pulsante per inserire il nome */}
      <button
        onClick={handleNameChange}
        className="mb-4 p-2 border rounded text-white bg-[#0c4551] hover:bg-[#3739b8]"
      >
        {name || "Inserisci il tuo nome e cognome"}
      </button>
      {/* Pulsante per scaricare l'Excel */}
      <button
        className="rounded text-black border-8 border-[#7b8fab] p-2 font-semibold"
        onClick={handleDownloadExcel}
      >
        <img
          className="bg-[#e6e6e6] h-[80px] w-[80px] hover:h-[110px] hover:w-[110px] p-3 rounded font-bold"
          src="./assets/iconsLogo/download-4.png"
          alt="Download"
        />
      </button>
      <div className="text-white gap-4 flex flex-col md:flex md:flex-row justify-start items-center">
        <div>
          Totale ore lavorate: {Math.floor(timeData.totalMinutes / 60)}h{" "}
          {timeData.totalMinutes % 60}m
        </div>
        <div>
          Totale ore straordinarie:{" "}
          {Math.floor(timeData.totalStraordinario / 60)}h{" "}
          {timeData.totalStraordinario % 60}m
        </div>
      </div>
      <table className="text-left text-gray-400">
        <thead className="text-gray-200 uppercase text-sm bg-gray-900">
          <tr className="flex flex-wrap items-center">
            {[
              "Data",
              "Inizio",
              "Fine",
              "Pausa",
              "Lavorato",
              "Extra",
              "Nota",
              "Cliente",
              "Commessa",
            ].map((header) => (
              <th key={header} className="px-6 py-3 text-[#b7b6d5]">
                {header === "Lavorato" ? (
                  <span className=" text-green-500">{header}</span> // Color para Lavorato
                ) : header === "Extra" ? (
                  <span className="text-yellow-500">{header}</span> // Color para Extra
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeData.dailyData.map((entry, index) => {
            const showInputs =
              index === 0 || entry.DATA !== timeData.dailyData[index - 1].DATA;
            return (
              <tr
                key={`${entry.DATA}-${index}`}
                className="bg-gray-800 border-b text-black flex flex-wrap justify-start items-center  border-gray-500 hover:bg-gray-700"
              >
                <td className="px-2 py-3 font-bold  text-[#fff]">
                  {entry.DATA}
                </td>
                <td className="px-2 py-3">
                  <input
                    type="time"
                    value={entry.INIZIO || "00:00"}
                    onChange={(e) =>
                      handleInputChange(index, "INIZIO", e.target.value)
                    }
                    disabled={!isEditable}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="time"
                    value={entry.FINE || "00:00"}
                    onChange={(e) =>
                      handleInputChange(index, "FINE", e.target.value)
                    }
                    disabled={!isEditable}
                  />
                </td>
                {showInputs && (
                  <>
                    <td className="px-1 py-3">
                      <input
                        type="time"
                        value={entry.PAUSA || "00:00"}
                        onChange={(e) =>
                          handleInputChange(index, "PAUSA", e.target.value)
                        }
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="text-green-500 px-1 py-2 text-xl font-bold w-[20px] ">
                      {formatMinutesToTime(entry.workedMinutes)}
                    </td>
                    <td className="text-yellow-500 px-12 py-2 text-xl font-bold w-[20px] ">
                      {formatMinutesToTime(entry.straordinario)}
                    </td>
                  </>
                )}
                <td className="px-2 py-3">
                  <input
                    value={entry.NOTA || ""}
                    onChange={(e) =>
                      handleInputChange(index, "NOTA", e.target.value)
                    }
                    disabled={!isEditable}
                    className="w-[150px] text-gray-800 text-center bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </td>
                <td className="px-1 py-3">
                  <input
                    type="text"
                    value={entry.CLIENTE || ""}
                    onChange={(e) =>
                      handleInputChange(index, "CLIENTE", e.target.value)
                    }
                    disabled={!isEditable}
                    className="w-[150px] text-gray-800 text-center bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-1 py-3">
                  <input
                    type="text"
                    value={entry.COMMESSA || ""}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "COMMESSA",
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    disabled={!isEditable}
                    className="w-[100px] text-center text-gray-800 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-1 py-3">
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(index)}
                  >
                    <img
                      className="h-[25px] w-[25px] hover:bg-[#d4f145] hover:rounded "
                      src="./assets/iconsLogo/cestino-2.png"
                      alt=""
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Validare le proprietà del componente
DetailsTable.propTypes = {
  dates: PropTypes.array.isRequired,
  setDates: PropTypes.func.isRequired,
};

export default DetailsTable;
