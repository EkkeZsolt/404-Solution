import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./tanarfelulet.scss";

interface QuizResult {
  id: number;
  name: string;
  score: number | null; // null, ha még nincs pont
}

export default function ClassroomDetails() {
  const { code } = useParams<{ code: string }>();

  const [classroom, setClassroom] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/classrooms/code/${code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Backend hiba:", res.status, text);
          return;
        }

        const data = await res.json();
        const payload = data.data ?? data;

        setClassroom(payload);
        setQuizResults(payload.quizResults ?? []);
      } catch (err) {
        console.error("Hiba a classroom adatainak lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (loading) {
    return <p className="loading-text">Adatok betöltése...</p>;
  }

  return (
    <div className="classroom-details-page">
      <div className="classroom-header">
        <p className="classroom-code">Kurzus kód: {classroom?.code ?? "ismeretlen"}</p>
        <h2 className="classroom-name">{classroom?.name ?? "ismeretlen csoport"}</h2>
      </div>

      <h3>Tesztek</h3>
      {quizResults.length === 0 ? (
        <p className="no-quizzes">Nincsenek elérhető tesztek.</p>
      ) : (
        <ul className="quiz-results-list">
          {quizResults.map((quiz) => (
            <li key={quiz.id} className="quiz-result-item">
              <span className="quiz-name">{quiz.name}</span>
              <span className="quiz-score">
                {quiz.score !== null ? `${quiz.score} pont` : "Nincs pontszám"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}