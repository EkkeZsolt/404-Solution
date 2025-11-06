// src/components/Header.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsActive(!isActive);
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Bal oldali ikon (Font Awesome használatával) */}
      <i className="fa-regular fa-house header__icon" />

      {/* Jobb oldali gomb */}
      <button
        type="button"
        className={`nav-btn ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        Bejelentkezés / Regisztráció
      </button>
    </header>
  );
};

export default Header;
