import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./Register.scss";
import { api } from "../../services/api";
import { useModal } from "../../context/ModalContext";

export default function Register() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isAutoJoin, setIsAutoJoin] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const codeParam = searchParams.get("code");

    if (roleParam === "diak") {
      setRole("diak");
    }
    if (codeParam) {
      setIsAutoJoin(true);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword || !role) {
      setError(t("error.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("error.passwordMismatch"));
      return;
    }

    if (role !== "tanar" && role !== "diak") {
      setError(t("error.fillAllFields"));
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          email,
          password,
          role
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: t("common.error") }));
        console.error("Register error:", error);
        setError(error.message || t("common.error"));
        return;
      }

      const joinCode = searchParams.get("code");
      if (joinCode && role === "diak") {
        try {
          const loginRes = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!loginRes.ok) throw new Error("Auto login failed");

          const loginData = await loginRes.json();
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("role", loginData.user?.role);

          const parseJwt = (token: string) => {
            try {
              return JSON.parse(atob(token.split('.')[1]));
            } catch (e) {
              return {};
            }
          };
          const tokenPayload = parseJwt(loginData.token);
          const studentId = tokenPayload.sub?.id || tokenPayload.id || tokenPayload.user_id;

          await api.studentJoinCreate({ classroom_code: joinCode, student_id: studentId });

          showModal({
            title: t("common.success"),
            message: t("modal.registerAndJoinSuccess"),
            onConfirm: () => navigate("/student")
          });
          return;

        } catch (autoErr) {
          console.error("Auto join error", autoErr);
          showModal({
            title: t("common.warning"),
            message: t("modal.joinFailed"),
            onConfirm: () => navigate("/login")
          });
          return;
        }
      }

      showModal({
        title: t("common.success"),
        message: t("modal.registerSuccess"),
        onConfirm: () => navigate("/login")
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <h1>{t("auth.registerTitle")} {isAutoJoin && t("auth.forJoining")}</h1>
      <div className="form-wrapper">
        <form className="register-form" onSubmit={handleRegister}>
          <input
            className="form-input"
            type="text"
            placeholder={t("auth.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder={t("auth.confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            className="form-input"
            type="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isAutoJoin && role === "diak"}
          >
            <option value="" disabled>{t("auth.selectRole")}</option>
            <option value="tanar">{t("auth.teacher")}</option>
            <option value="diak">{t("auth.student")}</option>
          </select>
          {error && <p className="error-message">{error}</p>}
          <button className="btn btn-primary" type="submit">
            {isAutoJoin ? t("auth.registerAndJoin") : t("auth.registerBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
