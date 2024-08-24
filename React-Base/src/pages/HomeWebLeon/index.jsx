import { Outlet } from "react-router-dom";
import Header from "../../pages/Header";
import Main from "../../pages/Main";
import Footer from "../../pages/Footer";



export default function HomeWebLeon() {
  return (
    <>
      <div>
        <Header/>
        <Main/>
        <Footer/>
        <Outlet/>
      </div>
    </>
  );
}
