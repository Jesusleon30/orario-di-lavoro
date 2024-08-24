import { Outlet } from "react-router-dom";
import Header from "../../pages/Header";
import Main from "../../pages/Main";
import Footer from "../../pages/Footer";



export default function PageWebLayout() {
  return (
    <>
      <div>
        {/* <p>hola desde pageweblayout </p> */}
        {/* <Header/> */}
        <Outlet/>
      </div>
    </>
  );
}
