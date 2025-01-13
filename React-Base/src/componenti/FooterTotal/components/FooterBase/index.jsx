import { useState } from "react";
import "./css/index.css";

export default function FooterBase(props) {
  return (
    <>
      <div className="text  "></div>
      <div
        id="Contact"
        className=" text-white container-footer text container-sitio"
      >
        <div className="card font-semibold border  text-[#e5e5e5] bg-[#1e40af] p-4 m-5 hover:bg-[#bfdbfe] hover:font-bold hover:text-xl hover:p-8 hover:border-[#1e3a8a] hover:border-4  hover:text-black ">
          <div className="font-medium">Dati aziendali:</div>
          <div>ALFA ROBOTICA SRL</div>
          <div>VIA ROMA N°404</div>
          <div>CARONNO PERTUSELLA (VA)</div>
          <div>CAP: 21042</div>
          <div>P.iva: 12259080153</div>
          <div>Codice Univoco: SUBM70N</div>
          <div >
            <ul>
              <li>
                <a
                  href="https://www.alfarobotica.it/contatti/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                  className="w-[75px] h-[50px] rounded  hover:w-[100px] hover:h-[70px] hover:rounded  "
                    src="./assets/iconsLogo/alfa-robotica3.png"
                    alt="sito di Alfa Robotica"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>Robotica</div>
        <div>Automazione</div>
        <div>frontend & backend</div>
        <div>Jesus Hugo Retamozo Leon</div>
        <div>2024</div>
        <div className="img-footer m-3"></div>
      </div>
    </>
  );
}
