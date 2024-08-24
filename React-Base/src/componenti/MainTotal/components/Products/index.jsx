import "./css/index.css";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function FormPage() {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [image, setImage] = useState(null); // Inicializa como null

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image); // Agrega el archivo al FormData

    console.log("Datos del producto:", formData);

    try {
      const response = await fetch("https://django-portfolio-leon.onrender.com/api/v1/products/", {
        method: "POST",
        body: formData,
      });

      // try {
      //   const response = await fetch("http://127.0.0.1:8000/api/v1/products/", {
      //     method: "POST",
      //     body: formData,
      //   });

      if (response.ok) {
        console.log("Producto registrado con éxito");
        alert('ok creato')
      } else {
        console.error("Error al registrare il prodotto");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setname("");
    setprice("");

  };


  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Guarda el archivo seleccionado como un objeto File
  };


  return (
    <>

      <main className="mt-10 mx-auto max-w-4xl p-10 bg-yellow-500 shadow rounded-xl  ">
        <div className="flex flex-col gap-5  items-center justify-between container-sitio1">
        <Link to="/products">
            <button className="mt-4 bg-orange-700 hover:bg-purpuple-700 text-white font-bold py-2 px-4 rounded">
              Lista Corsi
            </button>
          </Link>
          <h2 className="text-5xl font-bold text-black">Inserisci un Corso </h2>

        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-3 mt-2">
            <label htmlFor="name" className="text-2xl">
              Nome del corso:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="nome del corso"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label htmlFor="price" className="text-2xl">
              Prezzo:
            </label>
            <input
              id="price"
              name="price"
              type="text"
              value={price}
              onChange={(e) => setprice(e.target.value)}
              placeholder="prezzo del corso"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="image"
            >
              caricare file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="image"
              type="file"
              onChange={handleFileChange} // Maneja el cambio del archivo
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Registrare
          </button>
        </form>
      </main>
    </>
  );
}