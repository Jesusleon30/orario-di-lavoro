import "./css/index.css";

export default function HeaderDue() {
  return (
    <>
      <section className="container-menu">
        <div>hola</div>
        <div className="container-lista">
          <ul className="ul-lista">
            <li className="li-lista">
              <a className="a-lista" href="#Home">
                Home
              </a>
            </li>
            <li className="li-lista">
              <a className="a-lista" href="#About Me">
                About Me
              </a>
            </li>
            <li className="li-lista">
              <a className="a-lista" href="#Skills">
                Skills
              </a>
            </li>
            <li className="li-lista">
              <a className="a-lista" href="#Portfolio">
                Portfolio
              </a>
            </li>
            <li className="li-lista">
              <a className="a-lista" href="#Contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
