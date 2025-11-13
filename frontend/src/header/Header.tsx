// src/components/Header.tsx
import { useNavigate } from "react";
import "./Header.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* Bal oldali ikon (Font Awesome használatával) */}
      <i className="fa-regular fa-house header__icon" />

      {/* Jobb oldali gomb */}
      <button
        className="nav-btn" 
        onClick={() => navigate('/login')}
      >
        Bejelentkezés / Regisztráció
      </button>
    </header>
  );
};

export default Header;
