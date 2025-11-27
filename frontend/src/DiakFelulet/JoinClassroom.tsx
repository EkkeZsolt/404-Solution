import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./diakfelulet.scss";

export default function JoinClassroom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Kérlek, adj meg egy érvényes kódot!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        console.log(JSON.parse(atob(token.split('.')[1])));
      }
      if (!token) {
        setError("Nem vagy bejelentkezve!");
        setLoading(false);
        return;
      }
      console.log(localStorage.getItem("token"));
      const response = await fetch(
        `http://127.0.0.1:8000/api/diak/classroom/code?classroom_code=${encodeURIComponent(
          code
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError("Nem található classroom ezzel a kóddal.");
        } else if (response.status === 403) {
          setError("Nincs jogosultságod a hozzáféréshez.");
        } else {
          setError("Hiba történt a lekérés során.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      // Siker esetén navigálás a DiakFelulet oldalra
      navigate("/diakfelulet");
    } catch (err) {
      console.error(err);
      setError("Hiba történt a lekérés során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-classroom-page">
      <h1>Join Classroom</h1>
      <form className="join-form" onSubmit={handleSubmit}>
        <label>
          Classroom kód:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Pl.: 2C4E7E81"
          />
        </label>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="loading-text">Ellenőrzés...</p>}

        <button type="submit" className="join-btn" disabled={loading}>
          Join
        </button>
      </form>
    </div>
  );
}