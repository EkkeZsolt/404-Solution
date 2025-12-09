import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export default function TestRunner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ score: number, percent: number } | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tests/${id}/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setAnswers(Array(data.length).fill(-1));
      });
  }, [id]);

  const selectAnswer = (choice: number) => {
    const updated = [...answers];
    updated[index] = choice;
    setAnswers(updated);
  };

  const finishTest = () => {
    let score = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100);

    setResult({ score, percent });
    setFinished(true);
  };

  if (!questions.length) return <p>Betöltés...</p>;

  if (finished) {
    return (
      <div className="test-result">
        <h1>Eredmény</h1>
        <p>Pontszám: {result?.score}</p>
        <p>Százalék: {result?.percent}%</p>

        <button onClick={() => navigate("/tests")}>
          Vissza a tesztekhez
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="test-runner">
      <h2>{q.text}</h2>

      <div className="options">
        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`option ${answers[index] === i ? "selected" : ""}`}
            onClick={() => selectAnswer(i)}
          >
            {opt}
          </div>
        ))}
      </div>

      <div className="navigation">
        <button disabled={index === 0}
                onClick={() => setIndex(index - 1)}>Előző</button>

        {index === questions.length - 1 ? (
          <button onClick={finishTest}>Befejezés</button>
        ) : (
          <button onClick={() => setIndex(index + 1)}>Következő</button>
        )}
      </div>

      <style>{`
        .option {
          padding: 12px;
          border: 1px solid #333;
          margin-bottom: 8px;
          cursor: pointer;
        }
        .selected {
          background: #d0ffe0;
          border-color: green;
        }
      `}</style>
    </div>
  );
}