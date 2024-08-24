import { useState} from "react";
import Pokedex from "../Pokedex";
import "./css/index.css";

export default function Contador() {
  const [backgroundColor, setBackgroundColor] = useState("");

  const handleChange = (event) => {
    setBackgroundColor(event.target.value);
    // console.log(event.target.value)
  };

  return (
    <div id="Portfolio"
      className="app mt-9 flex md:justify-center items-center"
      style={{ backgroundColor }}
    >
      {/* <div className="text-white">hola desde contador</div> */}
      <section className="text-gray-500 flex-col items-center">
        {/* {backgroundColor} */}
        <span className="md:text-5xl md:m-5  text-4xl">
          Seleziona un colore :
        </span>
        <input
          className="md:h-[50px] h-[40px] bg-orange-100  rounded-xl input-list"
          type="text"
          placeholder="#FF0000"
          onChange={handleChange}
          value={backgroundColor}
        />
        <div>
          <Pokedex />
        </div>
      </section>
    </div>
  );
}
