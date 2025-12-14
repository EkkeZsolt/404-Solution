import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./JoinClassroom.scss";
import { api } from "../../services/api";

export default function JoinClassroom() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError(t("error.invalidCode"));
      return;
    }

    const parseJwt = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        return {};
      }
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(t("error.notLoggedIn"));
        setLoading(false);
        return;
      }

      const tokenPayload = parseJwt(token);
      console.log("Token Payload:", tokenPayload);
      const studentId = tokenPayload.sub?.id || tokenPayload.id || tokenPayload.user_id;

      await api.studentJoinCreate({ classroom_code: code, student_id: studentId });

      navigate("/student");
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("404")) {
        setError(t("error.classroomNotFound"));
      } else if (err.message && err.message.includes("403")) {
        setError(t("error.noPermission"));
      } else {
        setError(t("error.joinFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-classroom-page">
      <h1>{t("join.title")}</h1>
      <form className="join-form" onSubmit={handleSubmit}>
        <label className="form-label">
          {t("join.code")}:
          <input
            className="form-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("join.placeholder")}
          />
        </label>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="loading-text">{t("join.checking")}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {t("join.button")}
        </button>
      </form>
    </div>
  );
}