import "./css/modal.css"; // Importa los estilos CSS para el modal

// Componente Modal que recibe children, isOpen y closeModal como props
const Modal = ({ children, isOpen, closeModal }) => {
  // Maneja el clic en el contenedor del modal para evitar la propagación del evento
  const handleModalContainerClick = (e) => e.stopPropagation();

  try {
    return (
      <article className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
        {/* Contenedor del modal que cierra el modal solo si se hace clic fuera del contenido */}
        <div className="modal-container" onClick={handleModalContainerClick}>
          {/* Botón para cerrar el modal */}
          <button className="modal-close" onClick={closeModal}>
            <img
            className=" flex justify-start items-center "
            src="./assets/iconsLogo/elimina-2.png" alt="Add" />
          </button>
          {children} {/* Renderiza el contenido del modal */}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Errore durante la visualizzazione del modal:", error); // Manejo de errores
    return <div>Si è verificato un errore. Riprova.</div>; // Mensaje de error genérico
  }
};

// Exporta el componente Modal
export default Modal;
