import React from "react";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        © 2025 Kvízoldal |{" "}
        <a href="/adatvedelem">Adatvédelem</a> |{" "}
        <a href="/kapcsolat">Kapcsolat</a>
      </p>
    </footer>
  );
};

export default Footer;
