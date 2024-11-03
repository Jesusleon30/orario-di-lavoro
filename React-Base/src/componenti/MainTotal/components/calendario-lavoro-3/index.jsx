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
import AddClientModal_2 from "./AddClientModal_2.jsx"; // Segundo modal para agregar cliente
import clienti from "./js/clienti.js"; // Importa lista de clientes
import TextField from "@mui/material/TextField"; // Componente TextField de Material UI

const CalendarioLavoro_3 = () => {
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
  const [isModal2Visible, setModal2Visible] = useState(false); // Estado para controlar la visibilidad del segundo modal

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
      const idx = updatedDates.findIndex((date) => date.DATA === formattedDate); // Busca la fecha en el array

      try {
        if (idx > -1) {
          // Si la fecha ya existe, actualiza la entrada
          const existingEntry = updatedDates[idx];
          const updatedEntry = {
            ...existingEntry,
            INIZIO: selectedTime.format("HH:mm"), // Actualiza hora de inicio
            FINE: endTime.format("HH:mm"), // Actualiza hora de fin
            PAUSA: duracion, // Actualiza duración
            CLIENTE: selectedCLIENTEName || existingEntry.CLIENTE, // Actualiza cliente
            COMMESSA: selectedCOMMESSAName || existingEntry.COMMESSA, // Actualiza commessa
            NOTA: NOTA || existingEntry.NOTA, // Actualiza nota
          };
          updatedDates[idx] = updatedEntry; // Reemplaza la entrada existente
        } else {
          // Si la fecha no existe, crea una nueva entrada
          const newEntry = {
            DATA: formattedDate,
            INIZIO: selectedTime.format("HH:mm"),
            FINE: endTime.format("HH:mm"),
            PAUSA: duracion,
            CLIENTE: selectedCLIENTEName,
            COMMESSA: selectedCOMMESSAName,
            NOTA,
          };
          updatedDates.push(newEntry); // Agrega la nueva entrada
        }

        // Ordena las fechas
        const sortedDates = updatedDates.sort(
          (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
        );

        localStorage.setItem("dates", JSON.stringify(sortedDates)); // Guarda las fechas en localStorage
        setState((prevState) => ({ ...prevState, dates: sortedDates })); // Actualiza el estado con las fechas ordenadas

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

  // Maneja la captura de la fecha y hora en el segundo modal
  const handleCaptureDateAndTime_2 = () => {
    const {
      selectedDate,
      selectedTime,
      endTime,
      NOTA,
      selectedCLIENTE,
      selectedCOMMESSA,
    } = state; // Desestructura el estado

    const selectedCLIENTEName =
      selectedCLIENTE >= 0 ? clienti[selectedCLIENTE].name : ""; // Nombre del cliente seleccionado
    const selectedCOMMESSAName =
      selectedCOMMESSA >= 0
        ? String(clienti[selectedCLIENTE].commesse[selectedCOMMESSA])
        : ""; // Nombre de la commessa seleccionada

    // Validación de campos
    if (selectedDate.isValid() && selectedTime && endTime) {
      const formattedDate = selectedDate.format("DD-MM-YYYY"); // Formatea la fecha seleccionada
      const newEntry = {
        DATA: formattedDate,
        INIZIO: selectedTime.format("HH:mm"),
        FINE: endTime.format("HH:mm"),
        CLIENTE: selectedCLIENTEName,
        COMMESSA: selectedCOMMESSAName,
        NOTA,
      };

      const updatedDates = [...state.dates, newEntry]; // Agrega la nueva entrada a las fechas
      const sortedDates = updatedDates.sort(
        (a, b) => dayjs(a.DATA, "DD-MM-YYYY") - dayjs(b.DATA, "DD-MM-YYYY")
      );

      localStorage.setItem("dates", JSON.stringify(sortedDates)); // Guarda las fechas en localStorage
      setState((prevState) => ({ ...prevState, dates: sortedDates })); // Actualiza el estado con las fechas ordenadas

      toast.success("Giornata aggiunta con successo!"); // Mensaje de éxito
    } else {
      toast.error("Devi inserire INIZIO e FINE."); // Mensaje de error si falta información
    }

    setModal2Visible(false); // Cierra el segundo modal
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {" "}
      {/* Proveedor de localización */}
      <div className="md:flex">
        <DemoContainer components={["DatePicker"]}>
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
                />
              </div>
            </div>
            <div className="flex flex-col gap-9 justify-center items-center">
              <div>
                <button
                  className="h-[100px] w-[135px] rounded hover:h-[150px] hover:w-[150px] font-semibold my-4"
                  onClick={() => setModalVisible(true)} // Abre el primer modal
                >
                  <img src="./assets/iconsLogo/add-12.png" alt="Add" />
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
                className=" bg-[#0c2037] h-[90px] w-[90px]  p-1 rounded font-bold hover:h-[130px] hover:w-[130px] "
                onClick={() => setModal2Visible(true)} // Abre el segundo modal
              >
                <img src="./assets/iconsLogo/clienti-2.png" alt="Add" />
              </button>
              <AddClientModal_2
                isOpen={isModal2Visible} // Controla la visibilidad del segundo modal
                closeModal={() => setModal2Visible(false)} // Función para cerrar el modal
                handleChange={handleChange} // Pasa la función de manejo de cambios
                state={state} // Pasa el estado
                handleCaptureDateAndTime_2={handleCaptureDateAndTime_2} // Pasa la función para capturar fecha y hora
              />
              <button
                className="bg-[#be123c] h-[100px] w-[90px] rounded font-bold 
                 hover:h-[130px] hover:w-[130px] "
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

export default CalendarioLavoro_3; // Exporta el componente
