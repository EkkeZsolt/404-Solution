import { useNavigate } from "react-router-dom";
import {useState} from "react";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
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
        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
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
