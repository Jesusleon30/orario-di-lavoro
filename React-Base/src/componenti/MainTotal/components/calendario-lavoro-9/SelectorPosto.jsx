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
    <div className="flex flex-col mt-4">
      <h3 className="m-3 font-semibold text-lg">SELEZIONA IL LUOGO</h3>
      
      {/* Contenedor de dos filas: una arriba y otra abajo */}
      <div className="grid grid-cols-2 gap-4 font-semibold "> {/* Grid con dos columnas */}
        {posti.slice(0, 2).map((posto, index) => (
          <button
            key={index}
            onClick={() => handlePostoChange(posto)}
            className={`${
              selectedPosto === posto
                ? "bg-blue-600 text-white" // Si el posto está seleccionado, fondo azul y texto blanco
                : "bg-gray-100 text-gray-700" // Si no está seleccionado, fondo gris y texto gris
            } hover:bg-blue-600 hover:text-white rounded-md px-6 py-3  m-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`} // Estilos de hover y enfoque
          >
            {posto}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2  font-semibold"> {/* Segunda fila de botones */}
        {posti.slice(2, 4).map((posto, index) => (
          <button
            key={index}
            onClick={() => handlePostoChange(posto)}
            className={`${
              selectedPosto === posto
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            } hover:bg-blue-600 hover:text-white rounded-md px-6 py-3 m-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            {posto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostoSelector;