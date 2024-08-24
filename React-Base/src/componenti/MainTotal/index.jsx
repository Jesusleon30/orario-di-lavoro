import {
  Logo,
  TextAnimation,
  Lista,
  Contador,
  Pokedex,
  Lavori,
  Products,
} from "./components";

export default function MainTotal() {
  return (
    <>
      <div>
        <a
          className="text-5xl text-blue-300 font-semibold flex items-center justify-center  m-10"
          href="#About Me"
        >
          About me
        </a>
      </div>
      <TextAnimation
        className="m-[80px] "
        title1="👋 Hi! I'm Jesus Hugo Retamozo Leon"
      />

      <div id="Skills">
        <a
          className="text-5xl text-blue-300 font-semibold flex items-center justify-center  m-10"
          href="#Skills"
        >
          Skills
        </a>
      </div>
      <Lista />
      <div>
        <a
          className="text-5xl text-blue-300 font-semibold flex items-center justify-center m-10"
          href="#Portfolio"
        >
          Portfolio
        </a>
      </div>

      <Contador />
      <Lavori/>
      <Products/>
      <Logo />
      <div>
        <a
          className="text-5xl text-blue-300 font-semibold flex items-center justify-center m-10"
          href="#Contact"
        >
          Contact
        </a>
      </div>
    </>
  );
}
