// Importa los estilos CSS para el componente
import "./css/index.css";
// Importa las librerías necesarias de React y sus hooks
import React, { useState, useEffect } from "react";
// Importa los componentes necesarios de Material-UI y MUI Date Pickers
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Contenedor para los componentes de fecha
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adaptador para usar Day.js con MUI
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Proveedor de localización para los selectores de fecha
import { DatePicker, StaticDatePicker } from "@mui/x-date-pickers"; // Selectores de fecha
import dayjs from "dayjs"; // Importa Day.js para manejar fechas
import { TextField } from "@mui/material"; // Importa el campo de texto de Material-UI
import TimeSelector from "./TimeSelector.jsx"; // Importa el selector de tiempo
import DurationSelector from "./DurationSelector"; // Importa el selector de duración
import DetailsTable from "./DetailsTable.jsx"; // Importa la tabla de detalles
import MenuDoppio2 from "./MenuDoppio2"; // Importa el componente para seleccionar categorías y artículos
import clienti from "./js/clienti.js"; // Importa las categorías disponibles

// Componente principal
export default function CalendarioLavoro() {
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar mensajes de error
  const [selectedCLIENTE, setSelectedCLIENTE] = useState(-1); // Estado para la categoría seleccionada (inicialmente no se selecciona ninguna)
  const [selectedCOMMESSA, setSelectedCOMMESSA] = useState(-1); // Estado para el artículo seleccionado (inicialmente no se selecciona ninguno)

  // Estado principal que contiene información de la fecha, hora, etc.
  const [state, setState] = useState({
    selectedDate: dayjs(), // Fecha seleccionada inicial (hoy)
    selectedTime: null, // Hora de inicio seleccionada
    endTime: null, // Hora de fin seleccionada
    NOTA: "", // Nota adicional
    duracion: "", // Duración seleccionada
    dates: [], // Lista de fechas almacenadas
  });

  // Efecto para cargar las fechas desde localStorage al montar el componente
  useEffect(() => {
    const loadDates = () => {
      try {
        const retrievedData = localStorage.getItem("dates"); // Recupera los datos de fechas del almacenamiento local
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData), // Parsear los datos a formato JSON
          }));
        }
        setErrorMessage(""); // Limpia el mensaje de error
      } catch (error) {
        console.error("Error loading dates from localStorage:", error); // Registro del error en consola
        setErrorMessage("Error al cargar las fechas. Inténtalo de nuevo."); // Mensaje de error
      }
    };
    loadDates(); // Llama a la función para cargar las fechas
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  // Maneja el cambio de categoría seleccionada
  const handleCLIENTEChange = (CLIENTEIndex) => {
    setSelectedCLIENTE(CLIENTEIndex); // Actualiza el índice de la categoría seleccionada
    setSelectedCOMMESSA(-1); // Resetea el artículo seleccionado al cambiar de categoría
  };

  // Maneja el cambio de artículo seleccionado
  const handleCOMMESSAChange = (COMMESSAIndex) => {
    setSelectedCOMMESSA(COMMESSAIndex); // Actualiza el índice del artículo seleccionado
  };

  // Función genérica para manejar cambios en el estado
  const handleChange = (field) => (value) =>
    setState((prevState) => ({ ...prevState, [field]: value })); // Actualiza el estado del campo especificado

  // Maneja la captura de la fecha y hora seleccionadas
  const handleCaptureDateAndTime = () => {
    const { selectedDate, selectedTime, endTime, duracion, NOTA } = state;

    if (selectedDate.isValid()) {
      // Verifica si la fecha seleccionada es válida
      const formattedDate = selectedDate.format("DD-MM-YYYY"); // Formatea la fecha
      const updatedDates = [...state.dates]; // Copia la lista de fechas almacenadas
      const idx = updatedDates.findIndex((date) => date.DATA === formattedDate); // Busca si la fecha ya existe en la lista

      const selectedCLIENTEName =
        selectedCLIENTE > -1 ? clienti[selectedCLIENTE].name : ""; // Obtiene el nombre del cliente seleccionado

      const selectedCOMMESSAName =
        selectedCLIENTE > -1 && selectedCOMMESSA > -1
          ? String(clienti[selectedCLIENTE].commesse[selectedCOMMESSA]) // Convertir a string
          : "";

      try {
        if (idx > -1) {
          // Si la fecha ya existe, actualiza la entrada
          const existingEntry = updatedDates[idx]; // Obtiene la entrada existente
          const updatedEntry = {
            ...existingEntry,
            INIZIO: selectedTime
              ? selectedTime.format("HH:mm") // Formatea la hora de inicio
              : existingEntry.INIZIO, // Mantiene la hora existente si no se selecciona una nueva
            FINE: endTime ? endTime.format("HH:mm") : existingEntry.FINE, // Formatea la hora de fin
            PAUSA: duracion || existingEntry.PAUSA, // Mantiene la duración existente si no se selecciona una nueva
            CLIENTE: selectedCLIENTEName || existingEntry.CLIENTE, // Mantiene el cliente existente si no se selecciona uno nuevo
            COMMESSA: selectedCOMMESSAName || existingEntry.COMMESSA, // Mantiene la commessa existente si no se selecciona una nueva
            NOTA: NOTA || existingEntry.NOTA, // Mantiene la nota existente si no se introduce una nueva
          };
          updatedDates[idx] = updatedEntry; // Actualiza la entrada en la lista
        } else {
          // Si la fecha no existe, crea una nueva entrada
          const newEntry = {
            DATA: formattedDate,
            INIZIO: selectedTime ? selectedTime.format("HH:mm") : "", // Formatea la hora de inicio
            FINE: endTime ? endTime.format("HH:mm") : "", // Formatea la hora de fin
            PAUSA: duracion || "", // Asigna la duración seleccionada
            CLIENTE: selectedCLIENTEName, // Asigna el nombre del cliente
            COMMESSA: selectedCOMMESSAName, // Asigna el nombre de la commessa
            NOTA, // Asigna la nota
          };
          updatedDates.push(newEntry); // Agrega la nueva entrada a la lista
        }

        // Ordena las fechas
        const sortedDates = updatedDates.sort(
          (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
        );

        localStorage.setItem("dates", JSON.stringify(sortedDates)); // Almacena la lista ordenada en localStorage
        setState((prevState) => ({ ...prevState, dates: sortedDates })); // Actualiza el estado con la nueva lista
        setErrorMessage(""); // Limpia el mensaje de error
      } catch (error) {
        console.error("Error updating dates:", error); // Registro del error en consola
        setErrorMessage("Error al guardar las fechas. Inténtalo de nuevo."); // Mensaje de error
      }
    } else {
      setErrorMessage("Fecha seleccionada no válida."); // Mensaje de error si la fecha no es válida
    }
  };

  // Maneja la eliminación de las fechas almacenadas
  const handleClearDates = () => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare?"); // Confirma la eliminación
    if (confirmDelete) {
      // Si el usuario confirma
      try {
        localStorage.removeItem("dates"); // Elimina las fechas de localStorage
        setState((prevState) => ({ ...prevState, dates: [] })); // Resetea la lista de fechas en el estado
        setErrorMessage(""); // Limpia el mensaje de error
      } catch (error) {
        console.error("Error clearing dates:", error); // Registro del error en consola
        setErrorMessage("Error al eliminar las fechas. Inténtalo de nuevo."); // Mensaje de error
      }
    }
  };

  const durations = ["00:00", "00:30", "01:00", "01:30"]; // Duraciones disponibles para seleccionar

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className=" md:flex ">
        <DemoContainer components={["DatePicker"]}>
          <div className=" md:flex md:flex-col md:justify-center md:items-center md:gap-6  text-center">
            <div className="md:flex md:justify-center md:items-center gap-20">
              <div className="md:flex md:justify-center md:items-center ">
                <div className="flex justify-center items-center my-4  ">
                  {" "}
                  <StaticDatePicker
                    orientation="portrait"
                    value={state.selectedDate}
                    onChange={handleChange("selectedDate")}
                  />
                </div>
              </div>
              <div className=" flex flex-col gap-4 ">
                <div className=" flex flex-col text-center justify-center items-center gap-4 md:flex md:flex-col md:justify-center md:items-center">
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
                    placeholder="Nota - Descrizione"
                    value={state.NOTA}
                    onChange={(e) => handleChange("NOTA")(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <MenuDoppio2
                  clienti={clienti}
                  onCLIENTEChange={handleCLIENTEChange}
                  onCOMMESSAChange={handleCOMMESSAChange}
                  selectedCLIENTE={selectedCLIENTE}
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {errorMessage && (
              <div className="error-message">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex flex-col gap-8 items-center">
              <button
                className="bg-blue-500 w-[200px] p-4 rounded-full text-2xl hover:bg-yellow-400 font-semibold my-10"
                onClick={handleCaptureDateAndTime}
              >
                ok ✔
              </button>
              <h2 className="text-white text-2xl">ELENCO DATI :</h2>
              <button
                className="bg-yellow-500 p-1 text-red-800 rounded font-semibold hover:bg-red-600 hover:text-black"
                onClick={handleClearDates}
              >
                ELIMINARE DATI 🗑
              </button>
              <DetailsTable dates={state.dates} />
            </div>
          </div>
        </DemoContainer>
      </div>
    </LocalizationProvider>
  );
}
