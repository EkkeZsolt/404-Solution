import { useNavigate } from "react-router-dom";
import {useState} from "react";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!username || !password){
      setError("Kérlek, tölts ki minden mezőt!");
      return;
    }
    setError("");
    alert("Sikeres bejelentkezés");
    navigate("/app");
  }
  
  return (
    <div className="login-page">
      <h1>Bejelentkezés</h1>
      <div className="form-wrapper">
        <form className="login-form">
          <input type="text" placeholder="Felhasználónév" />
          <input type="password" placeholder="Jelszó" />
          {error && <p className="error-message">{error}</p>}
          <button type="button">Login</button>
          <button type="button" onClick={() => navigate("/register")}>
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
}
