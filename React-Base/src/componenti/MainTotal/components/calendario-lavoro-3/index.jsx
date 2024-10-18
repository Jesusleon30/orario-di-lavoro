import React, { useState, useEffect } from "react"; // Importa React y los hooks useState y useEffect
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Contenedor para los componentes de selección de fecha
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adaptador para usar Day.js con los selectores de MUI
import {
  LocalizationProvider,
  DatePicker,
  StaticDatePicker,
} from "@mui/x-date-pickers"; // Importa los selectores de fecha y el proveedor de localización
import dayjs from "dayjs"; // Importa Day.js para manipular fechas
import { TextField } from "@mui/material"; // Importa el componente TextField de Material-UI
import TimeSelector from "./TimeSelector.jsx"; // Importa un componente para seleccionar tiempos
import DurationSelector from "./DurationSelector"; // Importa un componente para seleccionar duraciones
import DetailsTable from "./DetailsTable.jsx"; // Importa un componente que muestra una tabla de detalles
import MenuDoppio2 from "./MenuDoppio2"; // Importa un menú para seleccionar clientes y proyectos
import clienti from "./js/clienti.js"; // Importa la lista de clientes disponibles
import "./css/index.css"; // Importa los estilos CSS

// Componente principal
export default function CalendarioLavoro_3() {
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar mensajes de error
  const [selectedCLIENTE, setSelectedCLIENTE] = useState(-1); // Estado para el índice del cliente seleccionado
  const [selectedCOMMESSA, setSelectedCOMMESSA] = useState(-1); // Estado para el índice de la tarea seleccionada

  // Estado principal que mantiene la información sobre fecha, hora, etc.
  const [state, setState] = useState({
    selectedDate: dayjs(), // Fecha seleccionada inicial (hoy)
    selectedTime: null, // Hora de inicio seleccionada
    endTime: null, // Hora de fin seleccionada
    NOTA: "", // Nota adicional
    duracion: "", // Duración seleccionada
    dates: [], // Lista de fechas almacenadas
  });

  // Efecto para cargar las fechas desde localStorage cuando se monta el componente
  useEffect(() => {
    const loadDates = () => {
      try {
        const retrievedData = localStorage.getItem("dates"); // Recupera los datos de fechas del almacenamiento local
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData), // Convierte los datos almacenados de JSON a un objeto
          }));
        }
        setErrorMessage(""); // Limpia el mensaje de error
      } catch (error) {
        console.error("Error loading dates from localStorage:", error); // Muestra el error en la consola
        setErrorMessage("Errore al caricare le date. Prova di nuovo."); // Establece un mensaje de error
      }
    };
    loadDates(); // Llama a la función para cargar las fechas
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  // Maneja el cambio en la selección del cliente
  const handleCLIENTEChange = (CLIENTEIndex) => {
    setSelectedCLIENTE(CLIENTEIndex); // Actualiza el índice del cliente seleccionado
    setSelectedCOMMESSA(-1); // Resetea el índice de la tarea seleccionada
  };

  // Maneja el cambio en la selección de la tarea
  const handleCOMMESSAChange = (COMMESSAIndex) => {
    setSelectedCOMMESSA(COMMESSAIndex); // Actualiza el índice de la tarea seleccionada
  };

  // Función genérica para manejar cambios en el estado
  const handleChange = (field) => (value) =>
    setState((prevState) => ({ ...prevState, [field]: value })); // Actualiza el estado del campo especificado

  // Maneja la captura de la fecha y la hora seleccionadas
  const handleCaptureDateAndTime = () => {
    const { selectedDate, selectedTime, endTime, duracion, NOTA } = state; // Desestructura el estado

    if (selectedDate.isValid()) {
      // Verifica si la fecha seleccionada es válida
      const formattedDate = selectedDate.format("DD-MM-YYYY"); // Formatea la fecha
      const updatedDates = [...state.dates]; // Crea una copia de la lista de fechas almacenadas
      const idx = updatedDates.findIndex((date) => date.DATA === formattedDate); // Busca si la fecha ya existe en la lista

      const selectedCLIENTEName =
        selectedCLIENTE > -1 ? clienti[selectedCLIENTE].name : ""; // Obtiene el nombre del cliente seleccionado

      const selectedCOMMESSAName =
        selectedCLIENTE > -1 && selectedCOMMESSA > -1
          ? String(clienti[selectedCLIENTE].commesse[selectedCOMMESSA]) // Convierte el nombre de la tarea a string
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
            COMMESSA: selectedCOMMESSAName || existingEntry.COMMESSA, // Mantiene la tarea existente si no se selecciona una nueva
            NOTA: NOTA || existingEntry.NOTA, // Mantiene la nota existente si no se introduce una nueva
          };
          updatedDates[idx] = updatedEntry; // Actualiza la entrada en la lista
        } else {
          // Si la fecha no existe, crea una nueva entrada
          const newEntry = {
            DATA: formattedDate, // Asigna la fecha formateada
            INIZIO: selectedTime ? selectedTime.format("HH:mm") : "", // Formatea la hora de inicio
            FINE: endTime ? endTime.format("HH:mm") : "", // Formatea la hora de fin
            PAUSA: duracion || "", // Asigna la duración seleccionada
            CLIENTE: selectedCLIENTEName, // Asigna el nombre del cliente
            COMMESSA: selectedCOMMESSAName, // Asigna el nombre de la tarea
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
        console.error("Error updating dates:", error); // Muestra el error en la consola
        setErrorMessage("Errore al archivio delle date. Prova di nuovo."); // Mensaje de error
      }
    } else {
      setErrorMessage("Data selezionata non valida."); // Mensaje de error si la fecha no es válida
    }
  };

  // Maneja la eliminación de las fechas almacenadas

  const handleClearDates = () => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare? "); // Confirma la eliminación
    if (confirmDelete) {
      // Si el usuario confirma
      try {
        localStorage.removeItem("dates"); // Elimina las fechas de localStorage
        localStorage.removeItem("hasAutoDownloaded"); // Elimina el estado de descarga automática
        setState((prevState) => ({ ...prevState, dates: [] })); // Resetea la lista de fechas en el estado
        setErrorMessage(""); // Limpia el mensaje de error
        window.location.reload(); // Recarga la página para reflejar los cambios
      } catch (error) {
        console.error("Error clearing dates:", error); // Muestra el error en la consola
        setErrorMessage("Errore al eliminare le Date. Prova di nuovo."); // Mensaje de error
      }
    }
  };

  const durations = ["00:00", "00:30", "01:00", "01:30"]; // Duraciones disponibles para seleccionar

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="md:flex">
        <DemoContainer components={["DatePicker"]}>
          <div className="md:flex md:flex-col md:justify-center md:items-center md:gap-6 text-center">
            <div className="md:flex md:justify-center md:items-center gap-20">
              <div className="md:flex md:justify-center md:items-center">
                <div className="flex justify-center items-center my-4">
                  <StaticDatePicker
                    orientation="portrait"
                    value={state.selectedDate}
                    onChange={handleChange("selectedDate")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col text-center justify-center items-center gap-8 my-6 mt-12 md:flex md:flex-col md:justify-center md:items-center">
                  <DatePicker
                    label="SELEZIONA DATA"
                    value={state.selectedDate}
                    onChange={handleChange("selectedDate")}
                    textField={(params) => (
                      <TextField
                        {...params}
                        value={state.selectedDate.format("DD-MM-YYYY")}
                      />
                    )}
                  />
                  <TimeSelector
                    label="Inizio"
                    value={state.selectedTime}
                    onChange={handleChange("selectedTime")}
                  />
                  <div>
                    <p className="text-xl font-bold ">Pausa Pranzo</p>
                  </div>

                  <DurationSelector
                    onDurationClick={handleChange("duracion")}
                    durations={durations}
                  />

                  <TimeSelector
                    label="Fine"
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

            {errorMessage && (
              <div className="error-message">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex flex-col gap-8 my-6 items-center">
              <button
                className="bg-[#140f07] w-[200px] h-[110px] rounded-full  hover:bg-[#60a5fa] font-semibold my-12"
                onClick={handleCaptureDateAndTime}
              >
                <img src="./assets/iconsLogo/add-3.png" alt="" />
              </button>
              <h2 className=" text-2xl font-bold text-black ">ELENCO DATI :</h2>
              <button
                className="bg-[#be123c] p-3 text-white rounded font-bold hover:bg-[#f43f5e] hover:text-black"
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
