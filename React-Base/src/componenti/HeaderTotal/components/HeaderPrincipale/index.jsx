import "./css/index.css";

export default function HeaderPrincipale() {
  return (
    <>
      <section className=" ">
        <header className="Cabecera justify-between items-center  ">
          <button>
            <img
              className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] "
              src="./assets/iconsLogo/leone5.png"
              alt=""
            />
          </button>
          <div>
            <div className=" navbar flex items-center justify-center  ">
              <a className="a-navbar" href="#Home">
                <img
                  className=" a-navbar h-[60px] w-[90px] a-navbar"
                  src="./assets/iconsLogo/alfa-robotica3.png"
                  alt=""
                />
              </a>
              <span className="span-navbar"></span>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col md:flex-row ">
            <div>
              <img
                className="h-[75px] w-[200px] "
                src="./assets/iconsLogo/Alfa-4.png"
                alt=""
              />
            </div>
            <div>
              <img
                className="h-[90px] w-[300px] "
                src="./assets/iconsLogo/Robotica-4.png"
                alt=""
              />
            </div>
          </div>

          <div>
            <button className="leone6">
              <img
                className="h-[100px] w-[100px]"
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
