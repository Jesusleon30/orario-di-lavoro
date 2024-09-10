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
          className="w-16 h-16 bg-yellow-700 text-black rounded-full flex items-center justify-center border-2 border-white hover:bg-yellow-400 font-semibold"
          key={duration}
          onClick={() => onDurationClick(duration)}
        >
          {duration}
        </button>
      ))}
    </div>
    <button
      className="h-14 font-semibold bg-yellow-600 hover:bg-yellow-400 rounded items-center border-white text-black"
      onClick={() => onDurationClick("CONTINUATO")}
    >
      CONTINUATO
    </button>
  </div>
);
export default function Logocopy15() {
  const [state, setState] = useState({
    selectedDate: dayjs(),
    selectedTime: null,
    endTime: null,
    cliente: "",
    duracion: "",
    dates: [],
  });

  useEffect(() => {
    const loadDatesFromLocalStorage = () => {
      try {
        const retrievedData = localStorage.getItem("dates");
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData),
          }));
        }
      } catch (error) {
        console.error("Error loading dates from localStorage:", error);
      }
    };
    loadDatesFromLocalStorage();
  }, []);

  const handleCaptureDateAndTime = () => {
    const { selectedDate, selectedTime, endTime, duracion, cliente } = state;

    if (selectedDate.isValid()) {
      const formattedDate = selectedDate.format("DD-MM-YYYY");

      // Preparamos el nuevo objeto, asegurándonos de conservar los campos existentes si no han cambiado
      const updatedDates = [...state.dates];
      const idx = updatedDates.findIndex((date) => date.DATA === formattedDate);

      if (idx > -1) {
        // Encontramos el objeto existente
        const existingEntry = updatedDates[idx];

        // Creamos un nuevo objeto, solo actualizando los campos que pueden haber cambiado
        const updatedEntry = {
          ...existingEntry, // Conservamos los valores existentes
          INIZIO: selectedTime
            ? selectedTime.format("HH:mm")
            : existingEntry.INIZIO,
          FINE: endTime ? endTime.format("HH:mm") : existingEntry.FINE,
          PRANZO: duracion || existingEntry.PRANZO,
          CLIENTE: cliente || existingEntry.CLIENTE,
        };

        // Actualizamos el objeto en la lista
        updatedDates[idx] = updatedEntry;
      } else {
        const combinedDetailsObject = {
          DATA: formattedDate,
          INIZIO: selectedTime ? selectedTime.format("HH:mm") : "",
          FINE: endTime ? endTime.format("HH:mm") : "",
          PRANZO: duracion || "",
          CLIENTE: cliente,
        };
        // Agregamos el nuevo objeto si no existe
        updatedDates.push(combinedDetailsObject);
      }

      // Ordenamos las fechas de forma creciente
      const sortedDates = updatedDates.sort(
        (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
      );

      localStorage.setItem("dates", JSON.stringify(sortedDates));
      setState((prevState) => ({ ...prevState, dates: sortedDates }));
    }
  };

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

  const durations = ["30 min", "1h", "1h 30min", "2h"];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <StaticDatePicker
            orientation="portrait"
            value={state.selectedDate}
            onChange={handleChange("selectedDate")}
          />
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
          <TimeSelector
            label="INIZIO"
            value={state.selectedTime}
            onChange={handleChange("selectedTime")}
          />
          <DurationSelector
            onDurationClick={handleChange("duracion")}
            durations={durations}
          />
          <TimeSelector
            label="FINE"
            value={state.endTime}
            onChange={handleChange("endTime")}
          />
          <TextField
            placeholder="sede o cliente"
            value={state.cliente}
            onChange={(e) => handleChange("cliente")(e.target.value)}
          />
        </DemoContainer>
        <div className="flex flex-col gap-8 items-center ">
          <div>
            <button
              className="bg-blue-500  p-10 rounded-full text-2xl
          hover:bg-yellow-200 font-mono hover:text-3xl hover:text-black font-semibold m-14"
              onClick={handleCaptureDateAndTime}
            >
              OK 😄
            </button>
          </div>
          <div className=" flex flex-col  gap-8">
            <div>
              <h2 className="text-white text-2xl">LISTA DATI :</h2>
            </div>
            <div>
              <button
                className="bg-blue-900 p-2 text-blue-100 rounded font-mono font-semibold
          hover:bg-red-800 hover:text-xl hover:text-black "
                onClick={handleClearDates}
              >
                ELIMINARE DATI 🗑
              </button>
            </div>
          </div>
          <div>
            <DetailsTable dates={state.dates} />
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
