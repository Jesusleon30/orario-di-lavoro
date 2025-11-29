// useModal.jsx
import { useState } from "react"; // Importa el hook useState de React

// Definición del hook personalizado useModal
export const useModal = (initialValue) => {
  // Estado para manejar si el modal está abierto o cerrado, inicializado con el valor proporcionado
  const [isOpen, setIsOpen] = useState(initialValue);

  // Función para abrir el modal
  const openModal = () => {
    try {
      setIsOpen(true);
    } catch (error) {
      console.error("Errore nell'aprire il modal:", error); // Manejo de errores al abrir
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    try {
      setIsOpen(false);
    } catch (error) {
      console.error("Errore nella chiusura del modal:", error); // Manejo de errores al cerrar
    }
  };

  // Retorna el estado del modal y las funciones para abrir y cerrar
  return [isOpen, openModal, closeModal];
};
