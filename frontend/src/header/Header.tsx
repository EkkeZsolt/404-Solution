// src/components/Header.tsx
import React, { useState } from "react";
import "./Header.scss";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
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
