import React, { useState } from "react"; // Importa React y el hook useState
import Select from "react-select"; // Importa el componente Select de react-select

// Componente MenuDoppio2
export default function MenuDoppio2({
  clienti, // Prop: Lista de clientes
  onCLIENTEChange, // Prop: Función para manejar el cambio de cliente
  onCOMMESSAChange, // Prop: Función para manejar el cambio de commessa
  selectedCLIENTE, // Prop: Cliente seleccionado
}) {
  // Estado para manejar mensajes de error
  const [error, setError] = useState("");

  // Manejar el cambio de cliente
  const handleClientChange = (selectedOption) => {
    setError(""); // Reinicia el mensaje de error al cambiar el cliente
    // Llama a la función para cambiar el cliente; si no hay opción seleccionada, se pasa -1
    onCLIENTEChange(selectedOption ? selectedOption.value : -1);
  };

  // Manejar el cambio de commessa
  const handleCommessaChange = (selectedOption) => {
    setError(""); // Reinicia el mensaje de error al cambiar la commessa
    // Llama a la función para cambiar la commessa; si no hay opción seleccionada, se pasa -1
    onCOMMESSAChange(selectedOption ? selectedOption.value : -1);
  };

  // Validar que la lista de clientes no esté vacía
  if (!Array.isArray(clienti) || clienti.length === 0) {
    return (
      <div className="text-danger text-center mt-4">
        No hay clientes disponibles.
      </div>
    ); // Muestra un mensaje si no hay clientes
  }

  // Preparar opciones para el selector de clientes
  const clientOptions = clienti.map((cliente, i) => ({
    value: i, // El índice del cliente se usa como valor
    label: cliente.name, // El nombre del cliente se usa como etiqueta
  }));

  // Preparar opciones para el selector de commessas
  const commessaOptions =
    selectedCLIENTE > -1 // Verifica si hay un cliente seleccionado
      ? clienti[selectedCLIENTE].commesse.map((commessa, i) => ({
          value: i, // El índice de la commessa se usa como valor
          label: commessa, // El nombre de la commessa se usa como etiqueta
        }))
      : []; // Si no hay cliente seleccionado, no hay opciones

  return (
    <div className="container flex justify-center items-center ">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error} {/* Muestra mensaje de error si existe */}
        </div>
      )}
      

      <div className="row flex flex-col items-center justify-center ">
        {/* Columna para el selector de clientes */}
        <div className="col-md-10">
          <h3 className="h6 mb-4 mt-4 font-bold text-xl  "> Cliente</h3>
          <Select
            options={clientOptions} // Pasa las opciones de clientes
            onChange={handleClientChange} // Función para manejar el cambio de cliente
            placeholder="Seleziona un cliente" // Placeholder del selector
          />
        </div>

        {/* Columna para el selector de commessas */}
        <div className="col-md-10">
          <h3 className="h6 mb-4 mt-4 font-bold text-xl">Commessa</h3>
          <Select
            options={commessaOptions} // Pasa las opciones de commessas
            onChange={handleCommessaChange} // Función para manejar el cambio de commessa
            placeholder="Seleziona una commessa" // Placeholder del selector
            isDisabled={selectedCLIENTE === -1} // Desactiva el selector si no hay cliente seleccionado
          />
        </div>
      </div>
    </div>
  );
}
