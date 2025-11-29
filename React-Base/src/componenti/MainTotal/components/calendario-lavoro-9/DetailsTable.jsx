import React, { useEffect, useState } from "react"; // Importa React, useEffect y useState hooks desde la librería 'react'. Estos son esenciales para construir componentes React con estado y gestión del ciclo de vida.
import PropTypes from "prop-types"; // Importa la librería PropTypes para la verificación de tipos de las props del componente, asegurando que se pasen los tipos de datos correctos al componente.
import generateExcel from "./js/generateExcel"; // Importa la función 'generateExcel' desde un archivo local './js/generateExcel'. Esta función es responsable de crear y descargar el archivo Excel.
import { toast } from "react-toastify"; // Importa la función 'toast' para notificaciones desde la librería 'react-toastify'. Se utiliza para mostrar mensajes amigables al usuario (éxito, error, advertencias).
import dayjs from "dayjs"; // Importa la librería 'dayjs' para la manipulación de fechas y horas, proporcionando una forma más conveniente de trabajar con fechas en comparación con los objetos Date nativos de JavaScript.

// Función para validar si todas las entradas en el array 'dates' tienen una propiedad 'DATA' (que representa la fecha).
const validateDates = (dates) => dates.every((entry) => entry.DATA);

// Función para formatear minutos en formato de tiempo "HH:MM".
const formatMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60) // Calcula las horas dividiendo los minutos por 60 y redondeando hacia abajo.
    .toString() // Convierte las horas a string.
    .padStart(2, "0"); // Rellena el string de horas con un '0' al inicio si es un solo dígito, asegurando el formato "HH".
  const remainingMinutes = (minutes % 60).toString().padStart(2, "0"); // Calcula los minutos restantes y los formatea a string "MM".
  return `${hours}:${remainingMinutes}`; // Retorna el string de tiempo formateado "HH:MM".
};

// Función para convertir un string de tiempo "HH:MM" a minutos.
const timeToMinutes = (timeString) => {
  if (!timeString) return 0; // Si timeString está vacío o nulo, retorna 0 minutos.
  const regex = /^([01]?\d|2[0-3]):([0-5]\d)$/; // Expresión regular para validar el formato "HH:MM" (00:00 a 23:59).
  if (!regex.test(timeString)) {
    // Prueba si el timeString coincide con el formato "HH:MM".
    toast.error(
      // Si el formato no es válido, muestra una notificación de error tipo toast.
      `Formato orario non valido: "${timeString}". Deve essere "HH:MM".` // Mensaje de error en italiano.
    );
    return 0; // Retorna 0 minutos para un formato de tiempo inválido.
  }
  const [hours, minutes] = timeString.split(":").map(Number); // Divide el timeString por ":" y convierte horas y minutos a números.
  return hours * 60 + minutes; // Calcula el total de minutos a partir de horas y minutos.
};

// Función para calcular los minutos trabajados y los minutos de horas extra a partir de un array de entradas de tiempo.
const calculateWorkedData = (entries) => {
  let workedMinutes = 0; // Inicializa los minutos totales trabajados a 0.
  let straordinario = 0; // Inicializa los minutos de horas extra a 0.

  try {
    entries.forEach((entry) => {
      // Itera sobre cada entrada de tiempo en el array 'entries'.
      const startMinutes = timeToMinutes(entry.INIZIO); // Convierte el string de hora de inicio a minutos.
      const endMinutes = timeToMinutes(entry.FINE); // Convierte el string de hora de fin a minutos.
      const pauseMinutes = timeToMinutes(entry.PAUSA || "00:00"); // Convierte el string de hora de pausa a minutos, por defecto "00:00" si no se proporciona pausa.

      const entryWorkedMinutes = endMinutes - startMinutes - pauseMinutes; // Calcula los minutos trabajados para la entrada actual (fin - inicio - pausa).
      workedMinutes += Math.max(0, entryWorkedMinutes); // Suma los minutos trabajados al total, asegurando que no sea negativo (usando Math.max(0, ...)).
    });

    if (entries.length > 0) {
      // Verifica si hay alguna entrada para el día.
      const entryDate = dayjs(entries[0].DATA, "DD-MM-YYYY"); // Parsea el string de fecha de la primera entrada usando dayjs en formato "DD-MM-YYYY".
      const dayOfWeek = entryDate.day(); // Obtiene el día de la semana (0 para Domingo, 1 para Lunes, ..., 6 para Sábado).

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Verifica si es un día de semana (Lunes a Viernes).
        straordinario = Math.max(0, workedMinutes - 480); // Calcula las horas extra como los minutos trabajados que exceden los 480 minutos (8 horas) en días de semana.
      } else {
        // Si es fin de semana (Sábado o Domingo).
        straordinario = Math.max(0, workedMinutes); // Todos los minutos trabajados se consideran horas extra en fines de semana.
      }
    }
  } catch (error) {
    // Captura cualquier error durante el cálculo de tiempo.
    console.error("Error al calcular los minutos trabajados:", error); // Loguea el error en la consola.
    return {
      // Retorna valores por defecto en caso de error.
      workedMinutes: 0,
      straordinario: 0,
    };
  }

  return {
    // Retorna los minutos trabajados calculados y los minutos de horas extra.
    workedMinutes: Math.max(0, workedMinutes), // Asegura que los minutos trabajados no sean negativos.
    straordinario: Math.max(0, straordinario), // Asegura que los minutos de horas extra no sean negativos.
  };
};

// Definición del componente React 'DetailsTable'. Recibe 'dates' y 'setDates' como props.
const DetailsTable = ({ dates, setDates }) => {
  const [timeData, setTimeData] = useState({
    // Hook useState para gestionar el estado de los datos de tiempo.
    dailyData: [], // Array para almacenar las entradas de tiempo diarias con los minutos trabajados y de horas extra calculados.
    totalMinutes: 0, // Minutos totales trabajados para todas las entradas.
    totalStraordinario: 0, // Minutos totales de horas extra para todas las entradas.
  });
  const [isEditable, setIsEditable] = useState(true); // Hook useState para gestionar la editabilidad de los inputs de la tabla (actualmente siempre true, por lo que los inputs siempre están editables).
  const [name, setName] = useState(
    // Hook useState para gestionar el nombre del usuario.
    () => localStorage.getItem("userName") || "" // Inicializa el nombre desde localStorage si está disponible, de lo contrario, string vacío.
  );

  // Función para calcular y agregar los datos de tiempo desde el array 'dates'.
  const calculateTimeData = () => {
    try {
      let totalMinutes = 0; // Inicializa los minutos totales trabajados para el cálculo.
      let totalStraordinario = 0; // Inicializa los minutos totales de horas extra para el cálculo.
      const groupedData = {}; // Objeto para agrupar las entradas por fecha.

      dates.forEach((entry) => {
        // Itera sobre cada entrada en el array 'dates'.
        const { DATA, INIZIO, FINE } = entry; // Desestructura las propiedades DATA, INIZIO y FINE de la entrada.
        if (!DATA || !INIZIO || !FINE) {
          // Verifica si DATA, INIZIO o FINE faltan.
          toast.warn(`Dati incompleti per l'entrata: ${JSON.stringify(entry)}`); // Muestra una advertencia tipo toast si faltan datos.
          return; // Salta a la siguiente entrada si faltan datos.
        }
        const dateKey = DATA; // Usa DATA (fecha) como clave para agrupar.
        if (!groupedData[dateKey]) groupedData[dateKey] = []; // Si aún no hay entrada para esta fecha, inicializa un array vacío.
        groupedData[dateKey].push(entry); // Agrega la entrada actual al array para su fecha correspondiente.
      });

      const dailyData = Object.entries(groupedData).flatMap(
        // Convierte el objeto groupedData a un array de entradas de datos diarias usando flatMap.
        ([dateKey, entries]) => {
          // Desestructura dateKey y el array entries para cada grupo de fecha.
          entries.sort(
            // Ordena las entradas para cada fecha por hora de inicio (INIZIO).
            (a, b) => timeToMinutes(a.INIZIO) - timeToMinutes(b.INIZIO)
          );
          const workedData = calculateWorkedData(entries); // Calcula los minutos trabajados y de horas extra para las entradas de la fecha actual.
          totalMinutes += workedData.workedMinutes; // Suma los minutos trabajados calculados al total.
          totalStraordinario += workedData.straordinario; // Suma los minutos de horas extra calculados al total.

          return entries.map((entry, index) => ({
            // Mapea cada entrada del día para incluir workedMinutes y straordinario.
            ...entry, // Expande las propiedades existentes de la entrada.
            workedMinutes: index === 0 ? workedData.workedMinutes : "", // Agrega workedMinutes solo a la primera entrada del día para evitar repetición en la tabla.
            straordinario: index === 0 ? workedData.straordinario : "", // Agrega straordinario solo a la primera entrada del día para evitar repetición.
          }));
        }
      );

      return { dailyData, totalMinutes, totalStraordinario }; // Retorna los datos diarios procesados y los totales.
    } catch (error) {
      // Captura cualquier error durante el cálculo de datos.
      toast.error("Errore nel calcolare i dati: " + error.message); // Muestra un error tipo toast.
      return { dailyData: [], totalMinutes: 0, totalStraordinario: 0 }; // Retorna datos vacíos por defecto en caso de error.
    }
  };

  // Hook useEffect para recalcular los datos de tiempo y potencialmente activar la descarga de Excel cuando la prop 'dates' cambia.
  useEffect(() => {
    try {
      if (!validateDates(dates)) {
        // Valida si todas las fechas tienen la propiedad 'DATA'.
        toast.error("Assicurati che tutte le voci abbiano DATA."); // Muestra un error tipo toast si la validación falla.
        return; // Sale del useEffect si las fechas no son válidas.
      }

      const { dailyData, totalMinutes, totalStraordinario } =
        calculateTimeData(); // Calcula los datos de tiempo usando la función calculateTimeData.
      setTimeData({ dailyData, totalMinutes, totalStraordinario }); // Actualiza el estado timeData con los datos calculados.

      const hasDownloaded = localStorage.getItem("hasDownloaded"); // Verifica si Excel ya ha sido descargado (flag en localStorage).
      const storedName = localStorage.getItem("userName"); // Obtiene el nombre de usuario almacenado desde localStorage.

      if (dailyData.length >= 15 && !hasDownloaded) {
        // Verifica si hay 15 o más entradas y Excel no ha sido descargado aún.
        const excelData = prepareExcelData(
          // Prepara los datos para la exportación a Excel.
          dailyData,
          totalMinutes,
          totalStraordinario
        );
        generateExcel(excelData, storedName); // Genera y descarga el archivo Excel usando la función generateExcel.
        localStorage.setItem("hasDownloaded", "true"); // Establece el flag 'hasDownloaded' en localStorage para evitar la descarga automática de nuevo.
        toast.success("Excel scaricato automaticamente! 👍"); // Muestra un toast de éxito para la descarga automática.
      }
    } catch (error) {
      // Captura cualquier error durante el procesamiento de fechas.
      toast.error("Errore nel processare le date: " + error.message); // Muestra un error tipo toast.
    }
  }, [dates]); // Array de dependencias de useEffect: el efecto se ejecuta cuando la prop 'dates' cambia.

  // Función para manejar el click del botón de descarga manual de Excel.
  const handleDownloadExcel = () => {
    try {
      if (!name) {
        // Verifica si se ha proporcionado el nombre de usuario.
        toast.error("Devi inserire un nome per il file!"); // Muestra un error tipo toast si falta el nombre.
        return; // Sale de la función si falta el nombre.
      }

      const confirmDownload = window.confirm(
        // Confirma la descarga con un diálogo de confirmación del navegador.
        "Sei sicuro di voler scaricare il file Excel?"
      );
      if (!confirmDownload) {
        // Si el usuario cancela la confirmación.
        toast.info("Download annullato."); // Muestra un toast de información.
        return; // Sale de la función.
      }

      const { dailyData, totalMinutes, totalStraordinario } = timeData; // Obtiene los datos de tiempo del estado.
      const excelData = prepareExcelData(
        // Prepara los datos para la exportación a Excel.
        dailyData,
        totalMinutes,
        totalStraordinario
      );

      generateExcel(excelData, name); // Genera y descarga el archivo Excel.
      toast.success("Excel scaricato con successo! 👍"); // Muestra un toast de éxito.
    } catch (error) {
      // Captura cualquier error durante el proceso de descarga.
      toast.error("Errore nel scaricare il file: " + error.message); // Muestra un error tipo toast.
    }
  };

  // Función para preparar los datos en un formato adecuado para la exportación a Excel.
  const prepareExcelData = (dailyData, totalMinutes, totalStraordinario) => {
    try {
      const excelData = dailyData.map((entry) => {
        // Mapea cada entrada de datos diarios a un objeto de fila de Excel.
        const workedTime = formatMinutesToTime(entry.workedMinutes); // Formatea los minutos trabajados a "HH:MM".
        const extraHours = formatMinutesToTime(entry.straordinario); // Formatea los minutos de horas extra a "HH:MM".

        return {
          // Retorna un objeto que representa una fila en la hoja de Excel.
          DATA: entry.DATA, // Fecha.
          INIZIO: entry.INIZIO || "N/A", // Hora de inicio, por defecto "N/A" si no se proporciona.
          FINE: entry.FINE || "N/A", // Hora de fin, por defecto "N/A" si no se proporciona.
          PAUSA: entry.PAUSA || "00:00", // Hora de pausa, por defecto "00:00" si no se proporciona.
          Ore_Lavorate: workedTime === "00:00" ? "N/A" : workedTime, // Horas trabajadas, "N/A" si es 00:00, de lo contrario, tiempo formateado.
          Ore_Straordinarie: extraHours === "00:00" ? "N/A" : extraHours, // Horas extra, "N/A" si es 00:00, de lo contrario, tiempo formateado.
          CLIENTE: entry.CLIENTE || "N/A", // Nombre del cliente, por defecto "N/A" si no se proporciona.
          COMMESSA: entry.COMMESSA || "N/A", // Código/orden de trabajo, por defecto "N/A" si no se proporciona.
          NOTA: entry.NOTA || "N/A", // Nota, por defecto "N/A" si no se proporciona.
          POSTO: entry.POSTO || "N/A", // Lugar/Puesto, por defecto "N/A" si no se proporciona.
        };
      });

      excelData.push({
        // Agrega una fila de "Total" al final de los datos de Excel.
        DATA: "Totale", // Etiqueta para la fila total.
        INIZIO: "N/A", // No aplicable para la fila total.
        FINE: "N/A", // No aplicable para la fila total.
        PAUSA: "N/A", // No aplicable para la fila total.
        // Horas totales trabajadas.
        Ore_Lavorate:
          totalMinutes === 0 ? "N/A" : formatMinutesToTime(totalMinutes), // "N/A" si 0 minutos totales, de lo contrario, tiempo total trabajado formateado.
        // Horas totales extra.
        Ore_Straordinarie:
          totalStraordinario === 0
            ? "N/A"
            : formatMinutesToTime(totalStraordinario), // "N/A" si 0 minutos totales de horas extra, de lo contrario, tiempo total de horas extra formateado.
        POSTO: "N/A", // No aplicable para la fila total.
      });

      return excelData; // Retorna el array de datos de Excel preparado.
    } catch (error) {
      // Captura cualquier error durante la preparación de datos.
      console.error("Error preparing Excel data:", error); // Loguea el error en la consola.
      return []; // Retorna un array vacío en caso de error.
    }
  };

  // Hook useEffect para guardar el nombre de usuario en localStorage cuando el estado 'name' cambia.
  useEffect(() => {
    try {
      localStorage.setItem("userName", name); // Guarda el 'name' actual en localStorage.
    } catch (error) {
      // Captura cualquier error durante la operación de localStorage.
      toast.error("Errore nel salvare il nome: " + error.message); // Muestra un error tipo toast.
    }
  }, [name]); // Array de dependencias de useEffect: el efecto se ejecuta cuando el estado 'name' cambia.

  // Función para manejar los cambios en los inputs en las filas de la tabla.
  const handleInputChange = (index, field, value) => {
    try {
      if (!name) {
        // Verifica si se ha proporcionado el nombre de usuario antes de permitir cambios en los inputs.
        toast.error("Devi inserire un nome per creare o modificare le voci!"); // Muestra un error tipo toast si falta el nombre.
        return; // Sale de la función si falta el nombre.
      }

      const updatedDates = [...dates]; // Crea una copia del array 'dates' para evitar la mutación directa del estado.
      updatedDates[index][field] = value; // Actualiza el campo especificado en la entrada en el índice dado.

      setDates(updatedDates); // Actualiza el estado 'dates' con el array modificado.
      localStorage.setItem("dates", JSON.stringify(updatedDates)); // Actualiza 'dates' en localStorage.
      if (field === "INIZIO" || field === "FINE" || field === "PAUSA") {
        // Si el campo cambiado está relacionado con el tiempo.
        toast.success("Entrata aggiornata con successo!"); // Muestra un toast de éxito para la actualización de la entrada de tiempo.
      }
    } catch (error) {
      // Captura cualquier error durante el manejo del cambio de input.
      toast.error("Errore nell'aggiornare l'entrata: " + error.message); // Muestra un error tipo toast.
    }
  };
  // Función para manejar la eliminación de una fila de la tabla.
  const handleDelete = (index) => {
    if (window.confirm("Sei sicuro di voler eliminare questa entrata?")) {
      // Confirma la eliminación con un diálogo de confirmación del navegador.
      try {
        const updatedDates = dates.filter((_, i) => i !== index); // Crea un nuevo array excluyendo la entrada en el índice especificado.
        setDates(updatedDates); // Actualiza el estado 'dates' con el array filtrado.
        localStorage.setItem("dates", JSON.stringify(updatedDates)); // Actualiza 'dates' en localStorage.

        if (index === 0) {
          // Si se elimina la primera entrada (índice 0).
          localStorage.removeItem("userName"); // Elimina el nombre de usuario de localStorage ya que podría estar asociado con la primera entrada.
        }

        if (updatedDates.length === 0) {
          // Si se eliminan todas las entradas, el array se vuelve vacío.
          localStorage.removeItem("dates"); // Elimina 'dates' de localStorage.
          localStorage.removeItem("hasDownloaded"); // Elimina el flag 'hasDownloaded' de localStorage.
          window.location.reload(); // Recarga la ventana para resetear el estado de la aplicación (ej., limpiar la tabla).
        } else {
          // Si todavía quedan entradas.
          toast.success("Entrata eliminata con successo!"); // Muestra un toast de éxito para la eliminación.
        }
      } catch (error) {
        // Captura cualquier error durante el proceso de eliminación.
        toast.error("Errore nell'eliminare l'entrata: " + error.message); // Muestra un error tipo toast.
      }
    }
  };

  // Función para manejar el cambio del nombre de usuario a través de un diálogo prompt.
  const handleNameChange = () => {
    const newName = prompt("Inserisci il tuo nome e cognome:", name); // Abre un prompt del navegador para obtener un nuevo nombre del usuario, pre-rellenado con el nombre actual.
    if (newName !== null) {
      // Verifica si el usuario ingresó un nuevo nombre y no canceló el prompt.
      setName(newName); // Actualiza el estado 'name' con el nuevo nombre.
      toast.success("Nome aggiornato con successo!"); // Muestra un toast de éxito para la actualización del nombre.
    }
  };

  // Estructura JSX del componente DetailsTable.
  return (
    <div className="flex flex-col items-center justify-between gap-6 p-5 bg-[#092239dc]  rounded-lg shadow-lg ">
      {/* Botón para cambiar el nombre de usuario */}
      <button
        onClick={handleNameChange}
        className="mb-4 p-2 border rounded text-white bg-[#0c4551] hover:bg-[#3739b8]"
      >
        {name || "Inserisci il tuo nome e cognome"}{" "}
        {/* Muestra el nombre de usuario o un placeholder si el nombre está vacío. */}
      </button>
      {/* Botón de descarga de Excel */}
      <button
        className="rounded text-black border-8 border-[#0d1233] p-2 font-semibold"
        onClick={handleDownloadExcel}
      >
        <img
          className="bg-[#e6e6e6] h-[80px] w-[80px] hover:h-[110px] hover:w-[110px] p-3 rounded font-bold"
          src="./assets/iconsLogo/download-4.png"
          alt="Download"
        />
      </button>
      {/* Muestra el total de horas trabajadas y horas extra */}
      <div className="text-white gap-4 flex flex-col font-semibold  md:flex md:flex-row justify-start items-center">
        <div className="text-green-500">
          TOTALE ORE LAVORATE:  {Math.floor(timeData.totalMinutes / 60)}h{" "}
          {timeData.totalMinutes % 60}m
        </div>
        <div className="text-yellow-500">
          TOTALE ORE STRAORDINARIE:{" "}
          {Math.floor(timeData.totalStraordinario / 60)}h{" "}
          {timeData.totalStraordinario % 60}m
        </div>
      </div>
      {/* Tabla para mostrar las entradas de tiempo */}
      <table className="text-left text-gray-400">
        {/* Cabecera de la tabla */}
        <thead className="text-gray-200 uppercase text-sm bg-gray-900 ">
          <tr className="flex flex-wrap items-center">
            {/* Celdas de la cabecera de la tabla */}
            {[
              "Data",
              "Inizio",
              "Fine",
              "Pausa",
              "Lavorato",
              "Extra",
              "Nota",
              "Luogo",
              "Cliente",
              "Commessa",
            ].map(
              (
                header // Mapea sobre los nombres de la cabecera para crear las celdas de la cabecera de la tabla.
              ) => (
                <th key={header} className="px-6 py-3 text-[#b7b6d5]">
                  {header === "Lavorato" ? ( // Estilo para la cabecera "Lavorato" en verde.
                    <span className=" text-green-500">{header}</span>
                  ) : header === "Extra" ? ( // Estilo para la cabecera "Extra" en amarillo.
                    <span className="text-yellow-500">{header}</span>
                  ) : (
                    header // Estilo por defecto para otras cabeceras.
                  )}
                </th>
              )
            )}
          </tr>
        </thead>
        {/* Cuerpo de la tabla */}
        <tbody>
          {timeData.dailyData.map((entry, index) => {
            // Mapea sobre las entradas de datos diarios para crear las filas de la tabla.
            const showInputs = // Determina si las columnas de trabajado y horas extra deben mostrar valores (solo para la primera entrada de cada día).
              index === 0 || entry.DATA !== timeData.dailyData[index - 1].DATA;

            const entryDate = dayjs(entry.DATA, "DD-MM-YYYY"); // Parsea la fecha para el cálculo del día de la semana.
            const dayOfWeek = entryDate.day(); // Obtiene el día de la semana.
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Verifica si es fin de semana (Domingo o Sábado).

            return (
              <tr // Fila de la tabla para cada entrada.
                key={`${entry.DATA}-${index}`}
                className="bg-gray-700 border-b text-black flex flex-wrap justify-start items-center border-gray-200 hover:bg-gray-500"
              >
                <td className="px-2 py-3 font-bold !text-white">
                  {entry.DATA} {/* Muestra la fecha. */}
                </td>
                <td className="px-2 py-3">
                  <input // Input para la hora de inicio.
                    type="time"
                    value={entry.INIZIO || "00:00"} // Muestra la hora de inicio o "00:00" si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para la hora de inicio.
                    ) => handleInputChange(index, "INIZIO", e.target.value)}
                    disabled={!isEditable} // El input siempre está habilitado ya que isEditable siempre es true.
                  />
                </td>
                <td className="px-2 py-3">
                  <input // Input para la hora de fin.
                    type="time"
                    value={entry.FINE || "00:00"} // Muestra la hora de fin o "00:00" si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para la hora de fin.
                    ) => handleInputChange(index, "FINE", e.target.value)}
                    disabled={!isEditable} // El input siempre está habilitado.
                  />
                </td>
                <td className="px-1 py-3">
                  <input // Input para la hora de pausa.
                    type="time"
                    value={entry.PAUSA || "00:00"} // Muestra la hora de pausa o "00:00" si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para la hora de pausa.
                    ) => handleInputChange(index, "PAUSA", e.target.value)}
                    disabled={!isEditable} // El input siempre está habilitado.
                  />
                </td>
                {!isWeekend &&
                  showInputs && ( // Renderiza condicionalmente la columna "Lavorato" solo para días de semana y la primera entrada del día.
                    <td className="text-green-500 px-1 py-2 text-xl font-bold w-[20px]">
                      {formatMinutesToTime(entry.workedMinutes)}{" "}
                      {/* Muestra la hora trabajada formateada. */}
                    </td>
                  )}

                {showInputs && ( // Renderiza condicionalmente la columna "Extra" solo para la primera entrada del día.
                  <td className="text-yellow-500 px-12 py-2 text-xl font-bold w-[20px]">
                    {formatMinutesToTime(entry.straordinario)}{" "}
                    {/* Muestra la hora extra formateada. */}
                  </td>
                )}
                <td className="px-2 py-3">
                  <input // Input para la nota.
                    value={entry.NOTA || ""} // Muestra la nota o un string vacío si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para la nota.
                    ) => handleInputChange(index, "NOTA", e.target.value)}
                    placeholder="Nota"
                    disabled={!isEditable} // El input siempre está habilitado.
                    className="w-[150px] text-gray-800 text-center bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none py-1"
                  />
                </td>
                <td className="px-1 py-3">
                  <input // Input para el lugar/puesto.
                    type="text"
                    value={entry.POSTO || ""} // Muestra el lugar o un string vacío si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para el lugar.
                    ) => handleInputChange(index, "POSTO", e.target.value)}
                    placeholder="Luogo" 
                    disabled={!isEditable} // El input siempre está habilitado.
                    className="w-[100px] text-gray-800 text-center bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 py-1"
                  />
                </td>

                <td className="px-1 py-3">
                  <input // Input para el nombre del cliente.
                    type="text"
                    value={entry.CLIENTE || ""} // Muestra el nombre del cliente o un string vacío si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para el nombre del cliente.
                    ) => handleInputChange(index, "CLIENTE", e.target.value)}
                    placeholder="Cliente"
                    disabled={!isEditable} // El input siempre está habilitado.
                    className="w-[150px] text-gray-800 text-center bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 py-1"
                  />
                </td>
                <td className="px-1 py-3">
                  <input // Input para el código/orden de trabajo.
                    type="text"
                    value={entry.COMMESSA || ""} // Muestra el código de trabajo o un string vacío si no se proporciona.
                    onChange={(
                      e // Maneja el cambio del input para el código de trabajo.
                    ) =>
                      handleInputChange(
                        index,
                        "COMMESSA",
                        e.target.value ? Number(e.target.value) : "" // Convierte el valor del input a número si no está vacío.
                      )
                    }
                    placeholder="Commessa"
                    disabled={!isEditable} // El input siempre está habilitado.
                    className="w-[100px] text-center text-gray-800 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 py-1"
                  />
                </td>

                <td className="px-1 py-3">
                  <button // Botón de eliminar para cada fila.
                    className="text-red-500"
                    onClick={() => handleDelete(index)} // Maneja el click del botón de eliminar.
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

// PropTypes para la verificación de tipos de las props del componente DetailsTable.
DetailsTable.propTypes = {
  dates: PropTypes.array.isRequired, // 'dates' prop es requerida y debe ser un array.
  setDates: PropTypes.func.isRequired, // 'setDates' prop es requerida y debe ser una función.
};

export default DetailsTable; // Exporta el componente DetailsTable para ser usado en otras partes de la aplicación.
