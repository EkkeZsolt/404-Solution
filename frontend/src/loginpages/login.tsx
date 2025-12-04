import { useNavigate } from "react-router-dom";
import {useState} from "react";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password){
      setError("Kérlek, tölts ki minden mezőt!");
      return;
    }
    async function handleLogin() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Hiba történt a bejelentkezés során.");
        return;
      }
      
      const userRole = data.user.role;

      localStorage.setItem("token", data.token);

      if (userRole.toLowerCase() === "tanar") {
        navigate("/tanarfelulet");
      } else if (userRole.toLowerCase() === "diak") {
        navigate("/diakfelulet");
      } else {
        setError("Ismeretlen felhasználói szerep.");
      }
    } catch (err) {
      setError("Hálózati hiba, próbáld újra.");
      console.error(err);
    }
  }
}
  return (
    <div className="login-page">
      <h1>Bejelentkezés</h1>
      <div className="form-wrapper">
        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)}/>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate("/register")}>
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
}
