import { useState } from "react";
import { Children } from "react";
import "./css/index.css";

export default function TextAnimation({ title1 }) {
  const [imagen1, setImagen1] = useState("./assets/icons/Jesus.png");

  function handleimages() {
    setImagen1("./assets/varieImmagini/jesusavatar1.png");
  }

  return (
    <>
      <section id="About Me" 
        className=" text-center mt-[80px]
      md:flex  md:items-center md:justify-center md:p-5 "
      >
        <div>
          <img
            className="xs:h-[400px] xs:w-[400px] md:hidden object-cover "
            src="./assets/mobile/jesusStrada.jpg"
            alt=""
          />
        </div>
        <div className="md:flex md:flex-row-reverse md:justify-center md:items-center">
          <div>
            <div className="wrapper flex-col justify-center items-center">
              <div>
                <div>
                  <h1
                    className=" title1
               md:text-5xl text-2xl  text-lime-100 "
                  >
                    {title1}
                  </h1>
                </div>
                <ul className="sec-texts">
                  <li className="li-wrapper">
                    <span>Developer - Frontend</span>
                  </li>
                  <li className="li-wrapper">
                    <span>Tecnico di Automazione Industriale</span>
                  </li>
                  <li className="li-wrapper">
                    <span>Robotica ABB</span>
                  </li>
                  <li className="li-wrapper">
                    <span>Installatore e Manutentore</span>
                  </li>
                  <li className="li-wrapper">
                    <span>Meccanico - Elettrico</span>
                  </li>
                  <li className="li-wrapper">
                    <span>Programmatore CNC</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              className=" h-[200px] w-[200px] md:h-[300px] md:w-[300px] object-cover "
              src="./assets/varieImmagini/robot2.png"
              alt=""
            />
          </div>
        </div>

        <div>
          <img
            className="hidden md:block md:h-[350px] md:w-[380px]  md:bg-cover rounded-[20%] "
            src={imagen1}
            alt=""
            onClick={handleimages}
          />
        </div>
      </section>
    </>
  );
}
