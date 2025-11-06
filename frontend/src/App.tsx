import { Routes, Route, useLocation } from "react-router-dom";
import './App.scss';
import './index.scss';
import Hero from './hero/Hero';
import FrontWords from './front-words/FrontWords'; // <-- Fontos import!
import Header from "./header/Header";
import Register from "./loginpages/register";
import Login from "./loginpages/login";
import TanarFelulet from "./TanarFelulet/tanarfelulet";
import DiakFelulet from "./DiakFelulet/diakfelulet";

function App() {
  const location = useLocation();

  const hideHeaderRoutes = ["/login", "/register", "/tanarFelulet", "/diakFelulet"];

  const shouldHideHeader = hideHeaderRoutes.some(path => location.pathname.startsWith(path));
  
  return (
    <>
      {!shouldHideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tanarFelulet" element={<TanarFelulet />} />
          <Route path="/diakFelulet" element={<DiakFelulet />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
