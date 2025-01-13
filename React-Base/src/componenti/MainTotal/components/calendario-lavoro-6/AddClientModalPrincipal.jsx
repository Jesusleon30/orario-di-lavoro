import React, { useState } from "react"; // Importa React y el hook useState
import { TextField } from "@mui/material"; // Importa el componente TextField de Material UI
import Modal from "./Modal.jsx"; // Importa el componente Modal
import DurationSelector from "./DurationSelector"; // Importa el selector de duración
import MenuDoppio2 from "./MenuDoppio2"; // Importa el menú de selección para clientes y commesse
import clienti from "./js/clienti.js"; // Importa la lista de clientes desde un archivo JS
import { DatePicker } from "@mui/x-date-pickers"; // Importa el selector de fecha
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker"; // Importa el selector de hora
import PostoSelector from "./SelectorPosto.jsx"; // Importa el selector de "Posto"

// Componente principal del modal para añadir un cliente
const AddClientModalPrincipal = ({
  isOpen, // Propiedad que indica si el modal está abierto
  closeModal, // Función para cerrar el modal
  handleChange, // Función para manejar cambios en el estado
  state, // Estado actual del formulario
  handleCaptureDateAndTime, // Función para capturar la fecha y hora
}) => {
  // Estados locales para el cliente, commessa y posto seleccionados
  const [selectedCLIENTE, setSelectedCLIENTE] = useState(-1); // Inicializa el cliente seleccionado en -1 (ninguno)
  const [selectedCOMMESSA, setSelectedCOMMESSA] = useState(-1); // Inicializa la commessa seleccionada en -1 (ninguna)
  const [selectedPosto, setSelectedPosto] = useState(""); // Estado para el "Posto" seleccionado

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

  // Función para manejar el cambio de "Posto"
  const handlePostoChange = (posti) => {
    setSelectedPosto(posti); // Actualiza el estado del "Posto" seleccionado
    handleChange("selectedPosto")(posti); // Actualiza el estado principal con el "Posto" seleccionado
  };

  // Lista de "Posti" disponibles
  const posti = ["In Sede", "Dal Cliente", "In Trasferta"];

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className=" flex flex-col justify-center items-center md:flex-grow gap-5 my-10">
        <div className="m-2">
          <h2>Data selezionata: {state.selectedDate.format("DD-MM-YYYY")}</h2>
        </div>

        <DatePicker
          label="SELEZIONA DATA"
          value={state.selectedDate}
          onChange={handleChange("selectedDate")}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                value={state.selectedDate.format("DD-MM-YYYY")}
              />
            ),
          }}
        />

        <DesktopTimePicker
          label="Inizio"
          value={state.selectedTime}
          onChange={handleChange("selectedTime")}
        />

        <div>
          <img
            className="w-[275px] h-[80px]"
            src="./assets/iconsLogo/Pausa-Pranzo-2.png"
            alt=""
          />
        </div>

        <DurationSelector
          onDurationClick={handleChange("duracion")}
          durations={["00:00", "00:30", "01:00", "01:30"]}
        />

        <DesktopTimePicker
          label="Fine"
          value={state.endTime}
          onChange={handleChange("endTime")}
        />

        <TextField
          placeholder="Nota - Descrizione"
          value={state.NOTA}
          onChange={(e) => handleChange("NOTA")(e.target.value)}
        />

        {/* Menu de selección de Cliente y Commessa */}
        <MenuDoppio2
          clienti={clienti}
          onCLIENTEChange={handleCLIENTEChange}
          onCOMMESSAChange={handleCOMMESSAChange}
          selectedCLIENTE={selectedCLIENTE}
        />
        {/* Selector de "Posto" */}
        <PostoSelector
          posti={posti}
          selectedPosto={selectedPosto}
          onPostoChange={handlePostoChange}
        />

        <button
          className="w-[90px] h-[90px] rounded hover:h-[130px] hover:w-[130px] font-semibold m-4"
          onClick={handleCaptureDateAndTime}
        >
          <img src="./assets/iconsLogo/add-11.png" alt="Add" />
        </button>
      </div>

      <button onClick={closeModal}>
        <img
          className="w-[50px] h-[70px] hover:h-[130px] hover:w-[100px]"
          src="./assets/iconsLogo/indietro.png"
          alt="indietro"
        />
      </button>
    </Modal>
  );
};

export default AddClientModalPrincipal;
