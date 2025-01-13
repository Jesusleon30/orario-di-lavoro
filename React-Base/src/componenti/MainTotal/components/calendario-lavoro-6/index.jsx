import React, { useState, useEffect } from "react"; // Importa React y hooks
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Importa contenedor demo de date-pickers
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adaptador para usar Day.js
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers"; // Proveedor de localización y picker estático
import dayjs from "dayjs"; // Importa la librería Day.js para manipulación de fechas
import DetailsTable from "./DetailsTable.jsx"; // Componente para mostrar la tabla de detalles
import "./css/index.css"; // Importa estilos CSS
import { ToastContainer, toast } from "react-toastify"; // Importa Toastify para notificaciones
import "react-toastify/dist/ReactToastify.css"; // Estilos para Toastify
import AddClientModalPrincipal from "./AddClientModalPrincipal.jsx"; // Modal para agregar cliente
import clienti from "./js/clienti.js"; // Importa lista de clientes
import TextField from "@mui/material/TextField"; // Componente TextField de Material UI

import "dayjs/locale/it";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);
// Replace "en" with the name of the locale you want to update.
dayjs.updateLocale("it", {
  // Sunday = 0, Monday = 1.
  weekStart: 1,
});

const CalendarioLavoro_6 = () => {
  // Estado para manejar la fecha seleccionada, horarios y otras variables
  const [state, setState] = useState({
    selectedDate: dayjs(), // Fecha seleccionada inicial
    selectedTime: null, // Hora seleccionada
    endTime: null, // Hora de finalización
    NOTA: "", // Nota adicional
    duracion: "", // Duración
    dates: [], // Array de fechas
    selectedCLIENTE: -1, // Cliente seleccionado
    selectedCOMMESSA: -1, // Commessa seleccionada
  });

  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del primer modal

  // useEffect para cargar las fechas del localStorage
  useEffect(() => {
    const loadDates = () => {
      try {
        const retrievedData = localStorage.getItem("dates"); // Recupera datos del localStorage
        if (retrievedData) {
          setState((prevState) => ({
            ...prevState,
            dates: JSON.parse(retrievedData), // Actualiza el estado con las fechas recuperadas
          }));
        }
      } catch (error) {
        console.error("Error al cargar las fechas desde localStorage:", error); // Error en consola
        toast.error("Errore al caricare le date. Prova di nuovo."); // Mensaje de error
      }
    };
    loadDates(); // Llama a la función para cargar fechas
  }, []);

  // Maneja el cambio en los campos de estado
  const handleChange = (field) => (value) => {
    setState((prevState) => ({ ...prevState, [field]: value })); // Actualiza el campo correspondiente en el estado
  };

  // Convierte la hora a minutos
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number); // Separa horas y minutos
    return hours * 60 + minutes; // Retorna el total en minutos
  };

  // Maneja la captura de la fecha y hora
  const handleCaptureDateAndTime = () => {
    const {
      selectedDate,
      selectedTime,
      endTime,
      duracion,
      NOTA,
      selectedCLIENTE,
      selectedCOMMESSA,
      selectedPosto,
    } = state; // Desestructura el estado

    const selectedCLIENTEName =
      selectedCLIENTE >= 0 ? clienti[selectedCLIENTE].name : ""; // Nombre del cliente seleccionado
    const selectedCOMMESSAName =
      selectedCOMMESSA >= 0
        ? String(clienti[selectedCLIENTE].commesse[selectedCOMMESSA])
        : ""; // Nombre de la commessa seleccionada

    // Validación de campos
    if (selectedDate.isValid() && selectedTime && endTime && duracion) {
      const formattedDate = selectedDate.format("DD-MM-YYYY"); // Formatea la fecha seleccionada
      const updatedDates = [...state.dates]; // Copia las fechas existentes

      try {
        // Crea una nueva entrada sin verificar si la fecha ya existe
        const newEntry = {
          DATA: formattedDate,
          INIZIO: selectedTime.format("HH:mm"),
          FINE: endTime.format("HH:mm"),
          PAUSA: duracion,
          CLIENTE: selectedCLIENTEName,
          COMMESSA: selectedCOMMESSAName,
          POSTO: selectedPosto,
          NOTA,
        };
        updatedDates.push(newEntry); // Agrega la nueva entrada

        // Ordena las fechas
        const sortedDates = updatedDates.sort(
          (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
        );

        // Actualiza el estado con las fechas ordenadas
        setState((prevState) => ({ ...prevState, dates: sortedDates }));

        // Guarda las fechas actualizadas en el localStorage
        localStorage.setItem("dates", JSON.stringify(sortedDates));

        toast.success("Giornata aggiunta con successo!"); // Mensaje de éxito
      } catch (error) {
        console.error("Error al actualizar las fechas:", error); // Error en consola
        toast.error("Errore al archivio delle date. Prova di nuovo."); // Mensaje de error
      }
    } else {
      toast.error("Devi inserire INIZIO, PAUSA e FINE."); // Mensaje de error si falta información
    }

    setModalVisible(false); // Cierra el modal
  };

  // Maneja la limpieza de las fechas
  const handleClearDates = () => {
    if (window.confirm("Sei sicuro di voler eliminare?")) {
      try {
        localStorage.removeItem("dates"); // Elimina las fechas del localStorage
        localStorage.removeItem("hasDownloaded"); // Elimina el estado de descarga del localStorage
        localStorage.removeItem("userName"); // Elimina el nombre de usuario del localStorage
        setState((prevState) => ({ ...prevState, dates: [] })); // Limpia el estado de fechas
        toast.success("Date eliminate con successo!"); // Mensaje de éxito
        window.location.reload(); // Recarga la página
      } catch (error) {
        console.error("Error al eliminare le date:", error); // Error en consola
        toast.error("Errore al eliminare le date. Prova di nuovo."); // Mensaje de error
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      {" "}
      {/* Proveedor de localización */}
      <div className="md:flex">
        <DemoContainer components={["DatePicker", "DesktopTimePicker"]}>
          {" "}
          {/* Contenedor demo para date pickers */}
          <div className="md:flex md:flex-col md:justify-center md:items-center md:gap-3 text-center">
            <div className="md:flex md:justify-center md:items-center  md:flex-row">
              <div className="flex justify-center items-center ">
                <StaticDatePicker
                  orientation="portrait"
                  value={state.selectedDate} // Valor de la fecha seleccionada
                  onChange={handleChange("selectedDate")} // Maneja el cambio de fecha
                  slots={{
                    textField: (params) => <TextField {...params} />, // Renderiza el TextField
                  }}
                  slotProps={{
                    toolbar: { toolbarFormat: "dddd DD", hidden: false },
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-9 justify-center items-center">
              <div>
                <button
                  className="h-[150px] w-[150px] rounded hover:h-[200px] hover:w-[200px] font-semibold my-8"
                  onClick={() => setModalVisible(true)} // Abre el primer modal
                >
                  <div className="inline-block p-1 rounded-[20px] border-4 border-blue-500">
                    <div className="inline-block  rounded-[20px] border-4 border-white">
                      <img
                        className="rounded-[10px]"
                        src="./assets/iconsLogo/sveglia4.png"
                        alt="Add"
                      />
                    </div>
                  </div>
                </button>
                <AddClientModalPrincipal
                  isOpen={isModalVisible} // Controla la visibilidad del primer modal
                  closeModal={() => setModalVisible(false)} // Función para cerrar el modal
                  handleChange={handleChange} // Pasa la función de manejo de cambios
                  state={state} // Pasa el estado
                  handleCaptureDateAndTime={handleCaptureDateAndTime} // Pasa la función para capturar fecha y hora
                  clienti={clienti} // Pasa la lista de clientes
                />
              </div>

              <button
                className="bg-[#be123c] h-[100px] w-[90px] rounded font-bold 
                 hover:h-[130px] hover:w-[130px] m-4 "
                onClick={handleClearDates} // Maneja la limpieza de fechas
              >
                <img src="./assets/iconsLogo/delete.png" alt="Add" />
              </button>
              <DetailsTable
                dates={state.dates} // Pasa las fechas a la tabla de detalles
                setDates={
                  (newDates) =>
                    setState((prev) => ({ ...prev, dates: newDates })) // Actualiza el estado con nuevas fechas
                }
              />
            </div>
          </div>
          <ToastContainer /> {/* Contenedor para notificaciones */}
        </DemoContainer>
      </div>
    </LocalizationProvider>
  );
};

export default CalendarioLavoro_6; // Exporta el componente
