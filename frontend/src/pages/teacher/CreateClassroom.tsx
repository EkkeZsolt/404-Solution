import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.scss";

export default function CreateClassroom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ellenőrzések
    if (!name.trim()) {
      setError("Adjon meg egy nevet az osztálynak!");
      return;
    }
    if (!visibility) {
      setError("Válassza ki, hogy Public vagy Private legyen!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Ellenőrizzük, hogy létezik-e már ilyen név
      const checkRes = await fetch("http://localhost:8000/api/groups", { method: "GET", headers: { Authorization: `Bearer ${token}` } });
      const existing = await checkRes.json();
      const classrooms = existing.classrooms || [];
      const nameExists = classrooms.some(
        (group: any) => group.name.toLowerCase() === name.toLowerCase()
      );

      if (nameExists) {
        setError("Már létezik ilyen nevű csoport!");
        return;
      }

      // Random classroom_code generálása
      const generateCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const digits = "0123456789";
        const randomChar = (pool: string, n: number) =>
          Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
        return `${randomChar(letters, 2)}${randomChar(digits, 2)}${randomChar(letters, 2)}`;
      };

      const newClassroom = {
        name,
        visibility,
        classroom_code: generateCode(),
      };

      const res = await fetch("http://localhost:8000/api/teacher/classroom/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newClassroom),
      });

      if (!res.ok) {
        throw new Error("Sikertelen mentés az adatbázisba.");
      }

      setSuccess("Sikeres létrehozás!");
      setTimeout(() => {
        navigate("/teacher");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Hiba történt a classroom létrehozásakor.");
    }
  };

  return (
    <div className="create-classroom-page">
      <h1>Új Classroom létrehozása</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Classroom neve:
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pl.: 10.A Angol"
          />
        </label>

        <label className="form-label">
          Láthatóság:
          <select
            className="form-select"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">-- Válasszon --</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" className="btn btn-primary">
          Létrehozás
        </button>
      </form>
    </div>
  );
}
