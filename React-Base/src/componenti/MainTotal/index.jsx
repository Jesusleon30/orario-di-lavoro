import {
  CalendarioLavoro_2,
  CalendarioLavoro_3,
  CalendarioLavoro_6,
  CalendarioLavoro_8,
  CalendarioLavoro_9,
} from "./components";

import BackgroundVideo from "../fondovideo/fondovideo.jsx";

export default function MainTotal() {
  return (
    <>
      <BackgroundVideo />
      <div className="md:flex md:flex-col md:justify-center md:items-center">
        {/* <CalendarioLavoro_2/> */}
        {/* <CalendarioLavoro_3/> */}
        {/* aggiornamento commessa e opcion in sede, dal cliente, in trasferta
    aggiornamento con un solo boton para agregar clientes y crear la fecha  */}
        {/* <CalendarioLavoro_6/> */} {/* <CalendarioLavoro_6/> */}
        {/* aggiornamento sabato e domenica lettura come straordinari */}
        {/* <CalendarioLavoro_8/> */}
        <CalendarioLavoro_9 />
      </div>
    </>
  );
}
