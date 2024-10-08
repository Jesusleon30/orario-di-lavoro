// src/components/TimeSelector.jsx
import React, { useState } from "react"; // Importa React y useState
import PropTypes from "prop-types"; // Importa PropTypes para validar propiedades
import { TimePicker } from "@mui/x-date-pickers"; // Importa el componente TimePicker de MUI

const TimeSelector = ({ label, value, onChange }) => {
  const [error, setError] = useState(""); // Estado para manejar errores

  const handleChange = (newValue) => {
    setError(""); // Reinicia el mensaje de error al cambiar el valor
    if (newValue === null) {
      setError("Seleziona un orario valido"); // Mensaje de error si el valor es nulo
    } else {
      onChange(newValue); // Llama a la función onChange con el nuevo valor
    }
  };

  return (
    <div className="time-selector">
      {" "}
      {/* Contenedor para el selector de tiempo */}
      <TimePicker
        label={label} // Etiqueta del selector
        value={value} // Valor actual del selector
        onChange={handleChange} // Maneja el cambio de valor
        renderInput={(params) => (
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
