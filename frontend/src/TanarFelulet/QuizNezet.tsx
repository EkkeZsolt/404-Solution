import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateQuiz from "./CreateQuiz";
import "./QuizDetails.scss";

type Answer = { text: string; is_correct: boolean };
type Question = { id: number; title: string; max_points: number; answers: Answer[] };
type Quiz = { id: number; name: string; allow_back: boolean; questions: Question[] };
type UserResult = { id: number; user: { name: string }; score: number; percentage: number };

interface CreateQuizProps {
  existingQuiz?: Quiz; 
  onClose?: () => void; 
}

export default function QuizDetails() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<UserResult[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get(`/api/quizzes/${quizId}`).then(res => setQuiz(res.data));
    axios.get(`/api/quizzes/${quizId}/results`).then(res => setResults(res.data));
  }, [quizId]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="quiz-details-page">
      <h1>{quiz.name}</h1>
      <button onClick={() => setEditing(true)}>Szerkesztés</button>

      {editing && (
        <CreateQuiz
          existingQuiz={quiz}
          onClose={() => setEditing(false)}
        />
      )}

      <h2>Kitöltők eredményei</h2>
      <table>
        <thead>
          <tr>
            <th>Felhasználó</th>
            <th>Pont</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td>{r.user.name}</td>
              <td>{r.score}</td>
              <td>{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}