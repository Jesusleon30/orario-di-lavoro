import React, { useState } from "react"; // Importa React y useState
import PropTypes from "prop-types"; // Importa PropTypes para validar propiedades
import TextField from "@mui/material/TextField"; // Importa TextField de MUI

import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";

const TimeSelector = ({ label, value, onChange }) => {
  const [error, setError] = useState(""); // Estado para manejar errores

  const handleChange = (newValue) => {
    setError(""); // Reinicia el mensaje de error al cambiar el valor
    try {
      if (newValue === null) {
        setError("Seleziona un orario valido"); // Mensaje de error si el valor es nulo
      } else {
        onChange(newValue); // Llama a la función onChange con el nuevo valor
      }
    } catch (error) {
      console.error("Errore durante la selezione dell'orario:", error); // Manejo de errores
      setError("Errore durante la selezione. Riprova."); // Mensaje de error genérico
    }
  };

  return (
    <div className="time-selector">
      {/* Contenedor para el selector de tiempo */}
      <DesktopTimePicker
        label={label} // Etiqueta del selector
        value={value} // Valor actual del selector
        onChange={handleChange} // Maneja el cambio de valor
        textField={(params) => (
          <TextField {...params} error={!!error} helperText={error} />
        )} // Muestra el campo de texto con error
      />
    </div>
  );
};

// Validación de las propiedades esperadas
TimeSelector.propTypes = {
  label: PropTypes.string.isRequired, // La etiqueta es un string requerido
  value: PropTypes.any, // El valor puede ser de cualquier tipo
  onChange: PropTypes.func.isRequired, // onChange debe ser una función requerida
};

export default TimeSelector;
