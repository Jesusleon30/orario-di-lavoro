import { Route, Routes } from "react-router-dom";
import "./css/index.css"
import { Navbar } from "./components/Navbar";
import { About, Contact, Home, Services } from "./components/pages";

export default function HeaderTre() {
  return (
    <>
      <div>hola desde header tre </div>
      <section>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </section>
    </>
  );
}
