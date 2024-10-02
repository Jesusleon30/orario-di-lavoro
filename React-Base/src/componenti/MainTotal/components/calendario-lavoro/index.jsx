// Importamos archivos CSS y librerías necesarias
import "./css/index.css"; // Estilos personalizados
import React, { useState, useEffect } from "react"; // Importamos hooks de React
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Contenedor para los selectores de fecha
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adaptador para utilizar dayjs
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Proveedor para la localización de fecha
import { DatePicker, TimePicker, StaticDatePicker } from "@mui/x-date-pickers"; // Selectores de fecha y hora
import dayjs from "dayjs"; // Librería para manipulación de fechas
import { TextField } from "@mui/material"; // Componente de entrada de Material-UI
import { DetailsTable } from "./DetailsTable"; // Componente para mostrar la tabla de detalles
import Select from "react-select"; // Componente de selección de react-select
import options from "./js/index.js";

// Componente para seleccionar la hora
const TimeSelector = ({ label, value, onChange }) => (
  <TimePicker label={label} value={value} onChange={onChange} />
);

// Componente para seleccionar la duración a través de botones
const DurationSelector = ({ onDurationClick, durations }) => (
  <div className="flex  justify-center items-center gap-5">
    {durations.map((duration) => (
      <button
        className="w-16 h-16 bg-yellow-600 text-black rounded-full flex items-center justify-center hover:bg-yellow-200 font-semibold"
        key={duration}
        onClick={() => onDurationClick(duration)} // Al hacer clic, llama a onDurationClick con la duración correspondiente
      >
        {duration}
      </button>
    ))}
  </div>
);

// Componente principal
export default function CalendarioLavoro() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangelLista = (option) => {
    setSelectedOption(option);
    console.log(`Opción seleccionada:`, option);
  };

  // Estado inicial del componente
  const [state, setState] = useState({
    selectedDate: dayjs(), // Fecha seleccionada inicializada a hoy
    selectedTime: null, // Hora de inicio seleccionada
    endTime: null, // Hora de fin
    NOTA_COMMESSA: "", // Nombre del NOTA_COMMESSA
    duracion: "", // Duración seleccionada
    dates: [], // Lista de fechas guardadas
    selectedCLIENTE: null, // Sabor seleccionado
  });

  // Efecto para cargar fechas desde localStorage al montar el componente
  useEffect(() => {
    const loadDates = () => {
      try {
        const retrievedData = localStorage.getItem("dates"); // Obtener datos del localStorage
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData), // Parsear y establecer las fechas en el estado
          }));
        }
      } catch (error) {
        console.error("Error loading dates from localStorage:", error);
      }
    };
    loadDates(); // Llamar a la función para cargar fechas
  }, []);

  // Función para capturar la fecha y hora seleccionadas y actualizar el estado
  const handleCaptureDateAndTime = () => {
    const {
      selectedDate,
      selectedTime,
      endTime,
      duracion,
      selectedCLIENTE,
      NOTA_COMMESSA,
    } = state;

    const CLIENTE = selectedOption ? selectedOption.value : selectedCLIENTE;

    if (selectedDate.isValid()) {
      const formattedDate = selectedDate.format("DD-MM-YYYY");

      const updatedDates = [...state.dates];
      const idx = updatedDates.findIndex((date) => date.DATA === formattedDate);

      // Verificamos si existe la entrada
      if (idx > -1) {
        const existingEntry = updatedDates[idx];

        const updatedEntry = {
          ...existingEntry,
          INIZIO: selectedTime
            ? selectedTime.format("HH:mm")
            : existingEntry.INIZIO,
          FINE: endTime ? endTime.format("HH:mm") : existingEntry.FINE,
          PAUSA: duracion || existingEntry.PAUSA,
          CLIENTE: CLIENTE || existingEntry.CLIENTE,
          NOTA_COMMESSA: NOTA_COMMESSA || existingEntry.NOTA_COMMESSA,
        };

        updatedDates[idx] = updatedEntry;
      } else {
        const combinedDetailsObject = {
          DATA: formattedDate,
          INIZIO: selectedTime ? selectedTime.format("HH:mm") : "",
          FINE: endTime ? endTime.format("HH:mm") : "",
          PAUSA: duracion || "",
          CLIENTE: CLIENTE,
          NOTA_COMMESSA: NOTA_COMMESSA,
        };

        updatedDates.push(combinedDetailsObject);
      }

      const sortedDates = updatedDates.sort(
        (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
      );

      try {
        localStorage.setItem("dates", JSON.stringify(sortedDates));
        setState((prevState) => ({ ...prevState, dates: sortedDates }));
      } catch (error) {
        console.error("Error saving dates to localStorage:", error);
      }
    }
  };
  // Función para manejar cambios en los campos
  const handleChange = (field) => (value) =>
    setState((prevState) => ({ ...prevState, [field]: value }));

  const handleClearDates = () => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare?");

    if (confirmDelete) {
      try {
        localStorage.removeItem("dates");
        setState((prevState) => ({ ...prevState, dates: [] }));
      } catch (error) {
        console.error("Error clearing dates:", error);
      }
    }
  };
  // Duraciones que se pueden seleccionar
  const durations = ["00:00", "00:30", "01:00", "01:30"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {" "}
      {/* Proveedor de localización */}
      <DemoContainer components={["DatePicker"]}>
        {" "}
        {/* Contenedor demo */}
        {/* Selector de fecha estático */}
        <StaticDatePicker
          orientation="portrait"
          value={state.selectedDate}
          onChange={handleChange("selectedDate")} // Manejar cambio de fecha
        />
        {/* Selector de fecha */}
        <DatePicker
          label="SELEZIONA DATA"
          value={state.selectedDate}
          onChange={handleChange("selectedDate")}
          renderInput={(params) => (
            <TextField
              {...params}
              value={state.selectedDate.format("DD-MM-YYYY")}
            />
          )}
        />
        {/* Selector de hora de inicio */}
        <TimeSelector
          label="INIZIO"
          value={state.selectedTime}
          onChange={handleChange("selectedTime")}
        />
        {/* Selector de duración */}
        <DurationSelector
          onDurationClick={handleChange("duracion")}
          durations={durations}
        />
        {/* Selector de hora de fin */}
        <TimeSelector
          label="FINE"
          value={state.endTime}
          onChange={handleChange("endTime")}
        />
        {/* Campo de texto para el NOTA_COMMESSA */}
        <TextField
          placeholder="NOTA - COMMESSA - DESCRIZIONE"
          value={state.NOTA_COMMESSA}
          onChange={(e) => handleChange("NOTA_COMMESSA")(e.target.value)} // Manejar cambio en el campo de texto
        />
      </DemoContainer>
      {/* Selector de sabor */}
      <div>
        <h1 className="text-xl font-bold ">SELEZIONA IL CLIENTE || SEDE </h1>
        <Select
          value={selectedOption}
          onChange={handleChangelLista}
          options={options}
        />
      </div>
      <div className="flex flex-col gap-8 items-center ">
        {/* Botón para confirmar la selección */}
        <button
          className="bg-blue-500 p-4 rounded-full text-2xl hover:bg-yellow-400 font-semibold my-6"
          onClick={handleCaptureDateAndTime} // Capturar fecha y hora al hacer clic
        >
          ok ✔
        </button>

        <h2 className="text-white text-2xl">ELENCO DATI :</h2>
        {/* Botón para eliminar datos */}
        <button
          className="bg-yellow-500 p-1 text-red-800 rounded font-semibold hover:bg-red-600 hover:text-black"
          onClick={handleClearDates} // Limpiar datos al hacer clic
        >
          ELIMINARE DATI 🗑
        </button>

        {/* Mostrar la tabla de detalles */}
        <DetailsTable dates={state.dates} />
      </div>
    </LocalizationProvider>
  );
}
