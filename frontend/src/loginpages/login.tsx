import { useNavigate } from "react-router-dom";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <h1>Bejelentkezés</h1>
      <div className="form-wrapper">
        <form className="login-form">
          <input type="text" placeholder="Felhasználónév" />
          <input type="password" placeholder="Jelszó" />
          <button type="button">Login</button>
          <button type="button" onClick={() => navigate("/register")}>
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
}
