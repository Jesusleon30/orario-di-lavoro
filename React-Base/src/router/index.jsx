import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HeaderPage,
  MainPage,
  FooterPage,
  HomeWebLeonPage,
} from "../pages";




export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomeWebLeonPage />} />
          <Route path="/header" element={<HeaderPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/footer" element={<FooterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
