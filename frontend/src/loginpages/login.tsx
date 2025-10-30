import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
import {useState} from "react";
=======
>>>>>>> de3ff4b (Create login.tsx)
=======
import {useState} from "react";
>>>>>>> f43d65c (error message update)
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f43d65c (error message update)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

<<<<<<< HEAD
<<<<<<< HEAD
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
=======
  const handleRegister = () => {
>>>>>>> f43d65c (error message update)
=======
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
>>>>>>> 8800ee3 (login hibakeresés javítása)
    if (!username || !password){
      setError("Kérlek, tölts ki minden mezőt!");
      return;
    }
    setError("");
    alert("Sikeres bejelentkezés");
<<<<<<< HEAD
    navigate("/");
  }
  
=======
>>>>>>> de3ff4b (Create login.tsx)
=======
    navigate("/app");
  }
  
>>>>>>> f43d65c (error message update)
  return (
    <div className="login-page">
      <h1>Bejelentkezés</h1>
      <div className="form-wrapper">
<<<<<<< HEAD
<<<<<<< HEAD
        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
=======
        <form className="login-form">
          <input type="text" placeholder="Felhasználónév" />
          <input type="password" placeholder="Jelszó" />
=======
        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
>>>>>>> 8800ee3 (login hibakeresés javítása)
          {error && <p className="error-message">{error}</p>}
          <button type="button">Login</button>
>>>>>>> de3ff4b (Create login.tsx)
          <button type="button" onClick={() => navigate("/register")}>
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
}
