import { useState } from "react";
import "./css/index.css";

export default function FooterBase(props) {
  const [counter, setCounter] = useState(0);

  function handleClick() {
    setCounter(counter + 1);
  }

  return (
    <>
      <div className="text  ">
        <button
          onClick={handleClick}
          className=" border rounded-full w-[200px] h-[50px]"
        >
          likes {props.hola} {props.lastname} {counter} 
        </button>
      </div>
      <div id="Contact" className="container-footer text container-sitio">
        <div>Design Studio 3D animation</div>
        <div>Jesus Hugo Retamozo Leon</div>
        <div>Automazione</div>
        <div>Robotica</div>
        <div>Developer Full Stack</div>
        <div>Fronted and Backend</div>
        <div>2024</div>
        <div className="img-footer m-3">
          <div>
            <a
              href="https://github.com/Jesusleon30/codigo-18-frontend">
              <img
                className=" h-[80px] w-[80px] object-cover "
                src="./assets/iconsLogo/github.png"
                alt=""
              />
            </a>
          </div>

          <div>
            <a
              href=" "
            >
              <img
                className=" h-[80px] w-[80px] object-cover bg-white"
                src="./assets/mobile/linkedin.png"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
