import "./css/index.css";
import userImg0 from "../../../../../public/assets/varieImmagini/ABByumi.jpg";
import userImg1 from "../../../../../public/assets/desktop/robotABB.jpg";
import userImg2 from "../../../../../public/assets/desktop/QEindustriale.jpg";
import userImg3 from "../../../../../public/assets/desktop/stampa3d.png";
import userImg4 from "../../../../../public/assets/desktop/tornitura.jpg";
import userImg5 from "../../../../../public/assets/desktop/progettazione_meccanica.png";
import userImg6 from "../../../../../public/assets/desktop/progetto-3d.jpg";
import userImg8 from "../../../../../public/assets/varieImmagini/developerdesk.jpg";

const users = [
  {
    id: 0,
    name: "Developers",
    description: "Frontend - Backend",
    image: userImg8,
  },
  {
    id: 1,
    name: "Robotica Yumi Cobot",
    description: "Collaborativo",
    image: userImg0,
  },
  {
    id: 2,
    name: "Robot 6 axis ABB",
    description: "Industriale",
    image: userImg1,
  },
  {
    id: 3,
    name: "Quadro Elettrico ",
    description: "Industriale",
    image: userImg2,
  },
  {
    id: 4,
    name: "Stampa 3D",
    description: "",
    image: userImg3,
  },
  {
    id: 6,
    name: "CAD ",
    description: "Soliworks",
    image: userImg5,
  },
  {
    id: 5,
    name: "Turning",
    description: "Programmatore CNC",
    image: userImg4,
  },
  {
    id: 7,
    name: "Meccanica",
    description: "",
    image: userImg6,
  },
];

export default function Lista() {
  const handleClick = (name) => {
    console.log(`cartella ${name}`);
  };

  return (
    <section className="section-lista mt-8">
      {users.map(({ id, name, description, image }) => {
        return (
          <div className="card-lista m-2 gap-2" key={id}>
            <img className="image-lista" src={image} alt={name} />
            <h2 className="name-lista text-2xl">{name}</h2>
            <p className="description-lista">{description}</p>
            <button
              id={id}
              onClick={() => handleClick(name)}
              className="text-white open"
            >
              
            </button>
            {/* si le paso solo handleClick haciendo un click en el button  me va a dar en la console un open y asi por todas las veces que le demos click al button 
        envez si le hago handleclick () con parentesis me pasa toda la function en este caso me 8 open (xk son 8 button que tenemos) si aver cliccado */}
          </div>
        );
      })}
    </section>
  );
}
