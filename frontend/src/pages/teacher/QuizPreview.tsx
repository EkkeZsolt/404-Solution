import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./QuizPreview.scss";
import { api } from "../../services/api";

type Detail = { max_points: number };
type UserResult = {
  student_id: number;
  student_name: string;
  total_score: number;
  details: Detail[]
};
// We keep Quiz type loose or update it if needed, but primarily we need to fix the results rendering.
// Quiz type removed as unused


export default function QuizDetails() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const classroomIdFromState = location.state?.classroomId;


  // The backend response is { quiz_id, quiz_name, results: [...] }
  // We can map this to our local state.
  const [quizName, setQuizName] = useState<string>("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [quizData, setQuizData] = useState<any>(null); // Store full response for "Edit" prop if needed


  useEffect(() => {
    const fetchQuizDate = async () => {
      try {
        if (!quizId) {
          return;
        }
        const data = await api.teacherClassroomQuiz(parseInt(quizId));
        console.log("Quiz details response:", data);

        if (data.quiz_name) {
          setQuizName(data.quiz_name);
        }

        // Ensure quizData is set for editing immediately
        setQuizData(data.quiz || data);

        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Hiba", err);
      }
    };
    fetchQuizDate();
  }, [quizId]);

  if (!quizName && results.length === 0) return <div>Betöltés...</div>;

  return (
    <div className="quiz-details-page">
      <h1>{quizName}</h1>
      <button className="btn btn-secondary" onClick={() => navigate(`/teacher/quiz/${quizId}/edit`, { state: { classroomId: classroomIdFromState || quizData?.classroom_id } })}>
        Szerkesztés
      </button>

      <h2>Kitöltők eredményei</h2>
      <table>
        <thead>
          <tr>
            <th>Tanuló neve</th>
            <th>Pont</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => {
            // Calculate max points from details
            const maxPoints = r.details.reduce((sum, d) => sum + d.max_points, 0);
            const percentage = maxPoints > 0 ? Math.round((r.total_score / maxPoints) * 100) : 0;

            return (
              <tr key={r.student_id || index} onClick={() => navigate(`/teacher/quiz/${quizId}/student/${r.student_id}`)}>
                <td>{r.student_name}</td>
                <td>{r.total_score} / {maxPoints}</td>
                <td>{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}