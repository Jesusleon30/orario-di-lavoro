import React, { useState } from "react"; // Importa React y el hook useState
import { TextField } from "@mui/material"; // Importa el componente TextField de Material UI
import Modal from "./Modal.jsx"; // Importa el componente Modal
import TimeSelector from "./TimeSelector.jsx"; // Importa el selector de tiempo
import DurationSelector from "./DurationSelector"; // Importa el selector de duración
import MenuDoppio2 from "./MenuDoppio2"; // Importa el menú de selección para clientes y commesse
import clienti from "./js/clienti.js"; // Importa la lista de clientes desde un archivo JS
import { DatePicker } from "@mui/x-date-pickers"; // Importa el selector de fecha

// Componente principal del modal para añadir un cliente
const AddClientModalPrincipal = ({
  isOpen, // Propiedad que indica si el modal está abierto
  closeModal, // Función para cerrar el modal
  handleChange, // Función para manejar cambios en el estado
  state, // Estado actual del formulario
  handleCaptureDateAndTime, // Función para capturar la fecha y hora
}) => {
  // Estados locales para el cliente y la commessa seleccionados
  const [selectedCLIENTE, setSelectedCLIENTE] = useState(-1); // Inicializa el cliente seleccionado en -1 (ninguno)
  const [selectedCOMMESSA, setSelectedCOMMESSA] = useState(-1); // Inicializa la commessa seleccionada en -1 (ninguna)

  // Función para manejar el cambio de cliente seleccionado
 
  const handleCLIENTEChange = (CLIENTEIndex) => {
    try {
      setSelectedCLIENTE(CLIENTEIndex); // Actualiza el estado del cliente seleccionado
      handleChange("selectedCLIENTE")(CLIENTEIndex); // Actualiza el estado principal con el cliente seleccionado
      setSelectedCOMMESSA(-1); // Resetea la commessa al cambiar cliente
    } catch (error) {
      console.error("Errore durante la selezione del cliente:", error); // Manejo de errores
    }
  };

  // Función para manejar el cambio de commessa seleccionada
  const handleCOMMESSAChange = (COMMESSAIndex) => {
    try {
      setSelectedCOMMESSA(COMMESSAIndex); // Actualiza el estado de la commessa seleccionada
      handleChange("selectedCOMMESSA")(COMMESSAIndex); // Actualiza el estado principal
    } catch (error) {
      console.error("Errore durante la selezione della commessa:", error); // Manejo de errores
    }
  };

  // Renderiza el contenido del modal
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex flex-col justify-center items-center md:flex-grow gap-5 my-10">
        {/* Contenedor flexible para los elementos del formulario */}
        <div className="m-2">
          <h2>Data selezionata: {state.selectedDate.format("DD-MM-YYYY")}</h2>
        </div>
        {/* Muestra la fecha seleccionada */}
        <DatePicker
          label="SELEZIONA DATA" // Etiqueta del selector de fecha
          value={state.selectedDate} // Valor actual del selector
          onChange={handleChange("selectedDate")} // Maneja el cambio de fecha
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                value={state.selectedDate.format("DD-MM-YYYY")} // Formatea la fecha como "DD-MM-YYYY"
              />
            ),
          }}
        />
        <TimeSelector
          label="Inizio" // Etiqueta para el selector de tiempo de inicio
          value={state.selectedTime} // Valor actual del tiempo de inicio
          onChange={handleChange("selectedTime")} // Maneja el cambio de tiempo de inicio
        />
        <div>
          <img
            className="w-[275px] h-[80px]" // Estilo para la imagen
            src="./assets/iconsLogo/Pausa-Pranzo-2.png" // Fuente de la imagen
            alt="" // Texto alternativo vacío
          />
        </div>
        <DurationSelector
          onDurationClick={handleChange("duracion")} // Maneja el clic en la duración seleccionada
          durations={["00:00", "00:30", "01:00", "01:30"]} // Duraciones disponibles
        />
        <TimeSelector
          label="Fine" // Etiqueta para el selector de tiempo de fin
          value={state.endTime} // Valor actual del tiempo de fin
          onChange={handleChange("endTime")} // Maneja el cambio de tiempo de fin
        />
        <TextField
          placeholder="Nota - Descrizione" // Texto placeholder
          value={state.NOTA} // Valor actual de la nota
          onChange={(e) => handleChange("NOTA")(e.target.value)} // Maneja el cambio de la nota
        />
        <MenuDoppio2
          clienti={clienti} // Lista de clientes
          onCLIENTEChange={handleCLIENTEChange} // Maneja el cambio de cliente
          onCOMMESSAChange={handleCOMMESSAChange} // Maneja el cambio de commessa
          selectedCLIENTE={selectedCLIENTE} // Cliente seleccionado
        />
        <button
          className="  w-[90px] h-[90px] rounded hover:h-[130px] hover:w-[130px]  font-semibold m-4" // Estilos del botón
          onClick={handleCaptureDateAndTime} // Maneja el clic en el botón para añadir
        >
          <img src="./assets/iconsLogo/add-11.png" alt="Add" />
        </button>
      </div>
      <button onClick={closeModal}>
      <img
       className=" w-[50px] h-[70px] hover:h-[130px] hover:w-[100px] "
        src="./assets/iconsLogo/indietro.png" alt="indietro" />
       </button>
      {/* Botón para cerrar el modal */}
    </Modal>
  );
};

export default AddClientModalPrincipal; // Exporta el componente
