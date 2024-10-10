import "./css/index.css";

export default function HeaderPrincipale() {
  return (
    <>
      <section className=" ">
        <header className="Cabecera justify-between">
          <button>
            <img
              className="h-[70px] w-[70px] md:h-[80px] md:w-[80px] "
              src="./assets/iconsLogo/leone5.png"
              alt=""
            />
          </button>
          <div>
            <div className=" navbar  ">
              <a className="a-navbar" href="#Home">
                <img
                className="h-[70px] w-[200px] md:h-[80px] md:w-[330px]"
                src="./assets/iconsLogo/alfa-robotica.PNG" alt="" />
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
