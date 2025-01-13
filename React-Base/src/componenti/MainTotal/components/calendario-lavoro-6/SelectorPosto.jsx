import React from "react";
import { Button, ButtonGroup } from "@mui/material"; // Usamos Button y ButtonGroup

const PostoSelector = ({ posti, selectedPosto, onPostoChange }) => {
  const handlePostoChange = (posto) => {
    try {
      onPostoChange(posto); // Intenta ejecutar la función de cambio de posto
    } catch (error) {
      console.error("Error al cambiar el posto:", error); // Muestra un mensaje de error si ocurre un fallo
    }
  };

  return (
    <div className="flex-col mt-4">
      <h3 className="m-3 font-semibold">SELEZIONA IL LUOGO</h3>
      <ButtonGroup variant="contained" fullWidth>
        {posti.map((posto, index) => (
          <Button
            key={index}
            onClick={() => handlePostoChange(posto)} // Cambia el Posto seleccionado con manejo de errores
            color={selectedPosto === posto ? "primary" : "default"} // Resalta el botón seleccionado
          >
            {posto}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default PostoSelector;