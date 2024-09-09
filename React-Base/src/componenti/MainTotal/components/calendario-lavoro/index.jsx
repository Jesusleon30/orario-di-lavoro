import "./css/index.css";

import "./css/index.css";

import React, { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { DetailsTable } from "./DetailsTable"; // Componente para la tabla de detalles

// Componente para seleccionar la hora
const TimeSelector = ({ label, value, onChange }) => (
  <TimePicker label={label} value={value} onChange={onChange} />
);

// Componente para seleccionar la duración
const DurationSelector = ({ onDurationClick, durations }) => (
  <div className="flex flex-col gap-5">
    <div className="flex flex-row items-center gap-5">
      {durations.map((duration) => (
        <button
          className="w-16 h-16 bg-orange-400 text-black rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-600"
          key={duration}
          onClick={() => onDurationClick(duration)}
        >
          {duration}
        </button>
      ))}
    </div>
    {/* Botón adicional para seleccionar "CONTINUATO" */}
    <button
      className="h-14 bg-orange-600 hover:bg-blue-600 rounded items-center border-2 border-white text-black"
      onClick={() => onDurationClick("CONTINUATO")}
    >
      CONTINUATO
    </button>
  </div>
);

export default function CalendarioLavoro() {
  // Estado inicial del componente
  const [state, setState] = useState({
    selectedDate: dayjs(), // Fecha seleccionada inicial
    selectedTime: dayjs().hour(8).minute(0), // Hora de inicio inicial
    endTime: dayjs().hour(17).minute(0), // Hora de fin inicial
    cliente: "", // Cliente inicial (vacío)
    duracion: "1h", // Duración por defecto
    dates: [], // Lista de fechas guardadas
  });

  // Carga de fechas del local storage cuando se monta el componente
  useEffect(() => {
    const loadDatesFromLocalStorage = () => {
      try {
        const retrievedData = localStorage.getItem("dates");
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData), // Convierte la cadena JSON a un objeto
          }));
        }
      } catch (error) {
        console.error("Error loading dates from localStorage:", error); // Manejo de errores
      }
    };
    loadDatesFromLocalStorage();
  }, []);

  // Función para capturar la fecha y hora seleccionadas
  const handleCaptureDateAndTime = () => {
    const { selectedDate, selectedTime, endTime, duracion, cliente } = state;

    if (selectedDate.isValid() && selectedTime) {
      try {
        const formattedDate = selectedDate.format("DD-MM-YYYY");
        const combinedDetailsObject = {
          DATA: formattedDate,
          INIZIO: selectedTime.format("HH:mm"),
          FINE: endTime.format("HH:mm"),
          PRANZO: duracion || "",
          CLIENTE: cliente,
        };

        const updatedDates = [
          ...state.dates.filter((date) => date.DATA !== formattedDate),
          combinedDetailsObject,
        ].sort(
          (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
        );

        localStorage.setItem("dates", JSON.stringify(updatedDates)); // Guarda en local storage
        setState((prevState) => ({ ...prevState, dates: updatedDates })); // Actualiza el estado
      } catch (error) {
        console.error("Error capturing date and time:", error); // Manejo de errores
      }
    }
  };

  // Función para actualizar el estado al cambiar campos
  const handleChange = (field) => (value) =>
    setState((prevState) => ({ ...prevState, [field]: value }));

  // Función para limpiar las fechas del local storage y del estado
  const handleClearDates = () => {
    try {
      localStorage.removeItem("dates"); // Elimina fechas guardadas
      setState((prevState) => ({ ...prevState, dates: [] })); // Limpiar el estado
    } catch (error) {
      console.error("Error clearing dates:", error); // Manejo de errores
    }
  };

  const durations = ["30 min", "1h", "1h 30min", "2h"]; // Opciones de duración disponibles

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <StaticDatePicker
            orientation="portrait"
            value={state.selectedDate}
            onChange={handleChange("selectedDate")} // Actualiza la fecha seleccionada
          />
          <DatePicker
            label="SELEZIONA DATA"
            value={state.selectedDate}
            onChange={handleChange("selectedDate")}
            renderInput={(params) => (
              <TextField
                {...params}
                value={state.selectedDate.format("DD-MM-YYYY")} // Muestra la fecha formateada
              />
            )}
          />
          <TimeSelector
            label="INIZIO"
            value={state.selectedTime}
            onChange={handleChange("selectedTime")} // Actualiza la hora de inicio
          />
          <DurationSelector
            onDurationClick={handleChange("duracion")} // Actualiza la duración seleccionada
            durations={durations}
          />
          <TimeSelector
            label="FINE"
            value={state.endTime}
            onChange={handleChange("endTime")} // Actualiza la hora de fin
          />
          <TextField
            placeholder="CLIENTE"
            value={state.cliente}
            onChange={(e) => handleChange("cliente")(e.target.value)} // Actualiza el cliente
          />
        </DemoContainer>
        <button
          className="bg-yellow-500 p-6 rounded text-xl 
        hover:bg-yellow-300 font-mono hover:text-2xl hover:text-black"
          onClick={handleCaptureDateAndTime} // Captura la fecha y hora al hacer clic
        >
          OK ✔
        </button>
        <button
          className="bg-blue-900 p-2 text-blue-100 rounded font-mono
        hover:bg-red-800 hover:text-xl hover:text-black"
          onClick={handleClearDates} // Limpia las fechas al hacer clic
        >
          ELIMINARE DATI 🗑
        </button>
        <h2 className="text-white text-2xl">LISTA DATI :</h2>
        <DetailsTable dates={state.dates} />{" "}
        {/* Componente para mostrar la tabla de detalles */}
      </LocalizationProvider>
    </>
  );
}
