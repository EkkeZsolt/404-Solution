import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./ClassroomView.scss";
import { api } from "../../services/api";

interface QuizResult {
  id: number;
  name: string;
  score: number | null;
}

export default function ClassroomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [classroom, setClassroom] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await api.studentClassroom(parseInt(id));

        const payload = data.data ?? data;
        setClassroom(payload);
        setQuizResults(payload.quizResults ?? []);
      } catch (err) {
        console.error("Error fetching classroom data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const goToQuizPage = (quizId: number) => {
    navigate(`/student/quiz/${quizId}`);
  };


  if (loading) {
    return <p className="loading-text">{t("common.loading")}</p>;
  }

  return (
    <div className="classroom-details-page">
      <div className="classroom-header">
        <p className="classroom-code">{t("classroom.code")}: {classroom?.code ?? "?"}</p>
        <h2 className="classroom-name">{classroom?.name ?? "?"}</h2>
      </div>

      <h3>{t("quiz.tests")}</h3>
      {quizResults.length === 0 ? (
        <p className="no-quizzes">{t("quiz.noTests")}</p>
      ) : (
        <ul className="quiz-results-list">
          {quizResults.map((quiz) => (
            <li key={quiz.id} className="quiz-result-item" onClick={() => goToQuizPage(quiz.id)}>
              <span className="quiz-name">{quiz.name}</span>
              <span className="quiz-score">
                {quiz.score !== null ? `${quiz.score} ${t("quiz.points")}` : "-"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}