import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("error.fillAllFields"));
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        setError(data.message || t("common.error"));
        return;
      }

      const userRole = data.user?.role;
      console.log("User role:", userRole);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userRole);

      if (userRole.toLowerCase() === "tanar") {
        navigate("/teacher");
      } else if (userRole.toLowerCase() === "diak") {
        navigate("/student");
      } else {
        setError(t("common.error"));
      }
    } catch (err) {
      setError(t("error.networkError"));
      console.error(err);
    }
  }

  return (
    <div className="login-page">
      <h1>{t("auth.loginTitle")}</h1>
      <div className="form-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="form-input"
            type="text"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button className="btn btn-primary" type="submit">{t("nav.login")}</button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/register")}>
            {t("nav.register")}
          </button>
        </form>
      </div>
    </div>
  );
}
