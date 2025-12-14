import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./TeacherDashboard.scss";
import { api } from "../../services/api";

interface Quiz {
  id: number;
  name: string;
  results_count: number;
}

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const groupInfo = location.state?.group;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const classroomId = parseInt(id);
        const data = await api.teacherClassroom(classroomId);
        console.log("Fetched quizzes:", data);

        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          console.error("Unexpected response format:", data);
          setQuizzes([]);
        }
      } catch (err) {
        console.error("Error fetching classroom data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNewQuiz = () => {
    navigate(`/teacher/classroom/${id}/quiz/create`);
  };

  if (loading) {
    return <p className="loading-text">{t("common.loading")}</p>;
  }

  return (
    <div className="group-details-page">
      <div className="group-details-header">
        <div className="group-info">
          <p className="classroom-code">{t("classroom.code")}: {groupInfo?.classroom_code ?? "?"}</p>
          <h2>{groupInfo?.name ?? "?"}</h2>
        </div>

        <div className="header-buttons">
          <button className="btn btn-primary" onClick={handleNewQuiz}>
            {t("quiz.newQuiz")}
          </button>
        </div>
      </div>

      <h3>{t("quiz.quizzes")}</h3>
      {quizzes.length === 0 ? (
        <p className="no-quiz">{t("quiz.noQuizzes")}</p>
      ) : (
        <table className="quiz-table">
          <thead>
            <tr>
              <th>{t("classroom.name")}</th>
              <th>{t("quiz.submissions")}</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="quiz-row"
                onClick={() => navigate(`/teacher/quiz/${quiz.id}`, { state: { classroomId: id } })}
                style={{ cursor: "pointer" }}
              >
                <td>{quiz.name}</td>
                <td>{quiz.results_count} {t("quiz.submissions")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
