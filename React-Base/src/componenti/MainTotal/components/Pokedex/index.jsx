import { useEffect, useState } from "react";
import "./css/index.css";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);

  const [page, setPage] = useState(1);

  // cogemos la url de internet del api del pokemon pidiendo che me traiga el listado de pokemones
  // const response = fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=8");
  // console.log(response);
  // me da una promise pero para que la data llegue necesita de un await y asyn se encarga de la promise del pedido

  // pero para usar async await necesitamos una function:
  const fetchPokemons = async (page = 1) => {
    const limit = 8;
    const offset = (page - 1) * limit;

    const response = await fetch(
      // "https://pokeapi.co/api/v2/pokemon?offset=0&limit=8"
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();
    const results = data.results.map((result) => {
      // "url": "https://pokeapi.co/api/v2/pokemon/1/"
      // const id= result.url.split('/')[6]`
      // forma moderna
      const id = result.url.split("/").at(6);
      console.log(id);
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
      console.log(image);
      //return result

      return {
        name: result.name,
        id,
        image,
      };
    });

    console.log(results);
    setPokemons(results);
    //Ahora vamos a usar useEffect y esto nos sirve para que el componente no se renderice infinitamente
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  return (
    <>
      <div className="text-white pokemonList">
        <div>
          <p className="text-5xl flex justify-center items-center m-8">Pokemon List</p>
          <div className="pokemons md:w-[830px]  ">
            {pokemons.map((pokemon) => {
              return (
                <div className="pokemon">
                  <img src={pokemon.image} alt="" />
                  <h3>{pokemon.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage}>Prev</button>
          <span>{page}</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
    </>
  );
}
