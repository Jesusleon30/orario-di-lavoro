import { useState } from "react";
import "./css/index.css";


export default function HeaderPrincipale() {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

 

  return (
    <>
      <section className="">
        <header className="Cabecera ">
          <button>
            <img
              className="h-[80px] w-[80px]"
              src="./assets/iconsLogo/leone5.png"
              alt=""
            />
          </button>

          <button onClick={toggleMenu} className="Cabecera-button">
            <svg
              className="Cabecera-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <div className={`Cabecera-nav ${menu ? "isActive" : ""}`}>
            <div className=" navbar Cabecera-ul  Cabecera-li ">
              <a className="a-navbar Cabecera-li " href="#Home">
                Home <span className="span-navbar"></span>
              </a>
              <a className="a-navbar Cabecera-li" href="#About Me">
                About Me <span className="span-navbar"></span>
              </a>
              <a className="a-navbar Cabecera-li" href="#Skills">
                Skills <span className="span-navbar"></span>
              </a>
              <a className="a-navbar Cabecera-li" href="#Portfolio">
                Portfolio <span className="span-navbar"></span>
              </a>
              <a className="a-navbar Cabecera-li" href="#Contact">
                Contact <span className="span-navbar"></span>
              </a>
              <span className="span-navbar"></span>
            </div>
          </div>
          <div>
            <button className="leone6">
              <img
                className="h-[80px] w-[80px]"
                src="./assets/iconsLogo/leone6.png"
                alt=""
              />
            </button>
          </div>
        </header>
      </section>
    </>
  );
}
