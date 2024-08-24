import "./css/index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductsLista() {
  const [dataAPI, setDataApi] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  // Función para obtener los datos de la API
  const getData = async () => {
    try {
      const response = await fetch ("https://django-portfolio-leon.onrender.com/api/v1/products/");
      const data = await response.json();
      setDataApi(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }

    // try {
    //   const response = await fetch ("http://127.0.0.1:8000/api/v1/products/");
    //   const data = await response.json();
    //   setDataApi(data);
    // } catch (error) {
    //   console.error("Error fetching data: ", error);
    // }
  };

  // Función para eliminar un producto
  const deleteData = async (id) => {
    try {
      const response = await fetch(
        `https://django-portfolio-leon.onrender.com/api/v1/products/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getData();

      // try {
      //   const response = await fetch(
      //     `http://127.0.0.1:8000/api/v1/products/${id}/`,
      //     {
      //       method: "DELETE",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );
      //   getData();

    } catch (error) {
      console.error("Error eliminando el producto", error);
    }
  };
  

  return (
    <>
      <header>
        <div className="mx-auto max-w-6xl py-5">
          <h1 className="text-5xl  font-extrabold text-white flex flex-col items-center">
            Lista dei Corsi
          </h1>
        </div>
      </header>
      <main className="mt-20 mx-auto flex-wrap max-w-5xl p-3 bg-cyan-700 shadow rounded-xl ">
        {dataAPI.length > 0 ? (
          <ul className="   ">
           
            {dataAPI.map((product) => (
              <li key={product.id} className="mb-8">
                <div className="md:flex  gap-5 items-center rounded-lg shadow-sm p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-lg h-20 max-w-15  shadow-sm"
                  />
                  <div className="w-full flex  justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">✨ {product.name}</h2>
                      <p className="text-lg font-medium">Prezzo: euro/ {product.price}</p>
                      <p className="text-white  ">Creazione Data {product.created_at.slice(0 ,10)} ora {product.created_at.slice(11 ,19)}</p>
                      <p className="text-white ">Aggiornamento Data {product.created_at.slice(0 ,10)} ora {product.created_at.slice(11 ,19)}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-900 dark:hover:bg-green-700 dark:focus:ring-blue-900">
                        <Link to={`/edit/${product.id}`}>Editare 🖋</Link>
                      </button>

                      <button
                        onClick={() => deleteData(product.id)}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-800 dark:focus:ring-red-900"
                      >
                        Eliminare ☠
                      </button>
                      
                    </div>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Non ci sono prodotti</p>
        )}
      </main>
    </>
  );
}
