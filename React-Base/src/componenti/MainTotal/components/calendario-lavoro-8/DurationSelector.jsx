import React, { useState } from "react"; // Importa React y useState
import PropTypes from "prop-types"; // Importa PropTypes para la validación de propiedades

// Componente che rappresenta il selettore di durate
const DurationSelector = ({ onDurationClick, durations }) => {
  const [selectedDuration, setSelectedDuration] = useState(null); // Estado para la duración seleccionada

  // Verifica se le durate sono valide
  if (!Array.isArray(durations) || durations.length === 0) {
    // Se non è un array o è vuoto, restituisci un messaggio di errore
    return <div className="text-red-500">Nessuna durata disponibile.</div>;
  }

  return (
    <div className="flex justify-center items-center gap-3">
      {/* Mappa attraverso le durate e crea un pulsante per ciascuna */}
      {durations.map((duration) => (
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold ${
            selectedDuration === duration
              ? "bg-[#2476da]" // Color de fondo cuando está seleccionado
              : "bg-[#755221] hover:bg-[#60a5fa]" // Color de fondo y hover
          } text-white`}
          key={duration} // Chiave unica per ogni pulsante
          onClick={() => {
            try {
              setSelectedDuration(duration); // Actualiza la duración seleccionada
              onDurationClick(duration); // Chiama la funzione onDurationClick passando la durata
            } catch (error) {
              // In caso di errore durante la chiamata della funzione
              console.error("Errore durante la selezione della durata:", error);
              alert(
                "Si è verificato un errore durante la selezione della durata."
              ); // Messaggio di errore
            }
          }}
        >
          {duration} {/* Mostra la durata nel pulsante */}
        </button>
      ))}
    </div>
  );
};

// Definizione delle proprietà attese
DurationSelector.propTypes = {
  onDurationClick: PropTypes.func.isRequired, // Deve essere una funzione
  durations: PropTypes.arrayOf(PropTypes.string).isRequired, // Deve essere un array di stringhe
};

export default DurationSelector; // Esporta il componente
