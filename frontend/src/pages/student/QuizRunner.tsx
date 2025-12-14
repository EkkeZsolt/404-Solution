import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import "./QuizRunner.scss";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct_indices: number[];
  correct_count: number;
}

export default function TestRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  // Store array of selected indices for each question
  const [answers, setAnswers] = useState<number[][]>([]);

  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ score: number, percent: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");



  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return;
      try {
        const data = await api.studentQuiz(parseInt(id));
        const qs = data.questions || [];
        setQuestions(qs);
        // Initialize answers with empty arrays
        setAnswers(Array(qs.length).fill([]));

      } catch (err) {
        console.error("Error", err);
        setError(t("common.error"));
      }
    };
    fetchQuestions();
  }, [id]);

  const selectAnswer = (choiceIndex: number) => {
    const currentQ = questions[index];
    const isMulti = currentQ.correct_count > 1;

    const currentAnswers = [...answers];
    const questionAnswers = [...currentAnswers[index]];

    if (isMulti) {
      // Toggle selection
      if (questionAnswers.includes(choiceIndex)) {
        // Remove if already selected
        const newArr = questionAnswers.filter(i => i !== choiceIndex);
        currentAnswers[index] = newArr;
      } else {
        // Add if not selected
        currentAnswers[index] = [...questionAnswers, choiceIndex];
      }
    } else {
      // Single select: replace
      currentAnswers[index] = [choiceIndex];
    }

    setAnswers(currentAnswers);
  };

  const finishTest = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    setLoading(true);

    const formattedAnswers = questions.map((q, i) => {
      const selectedIndices = answers[i];
      // Map indices to actual text values (e.g. "Answer text") or keys? 
      // Backend expects text in 'answers' array if it didn't change logic significantly.
      // Looking at backend `postUploadResolute` -> `DetailedResult` -> it stores json_encoded answers.
      // Teacher view maps `answer_1`... keys to text. 
      // Wait, did I change backend to expect KEYS or TEXT?
      // TeacherController lines 120+ map keys (answer_1) to text.
      // So I should probably send KEYS (answer_1, answer_2 etc) OR Text.
      // Let's check TeacherController again... 
      // It compares `array_intersect($answers, $correct)`.
      // $correct comes from DB `correct_answers` column which stores keys ["answer_1", "answer_3"].
      // So I MUST SEND KEYS ["answer_1", "answer_2"] etc.

      const keyMap = ["answer_1", "answer_2", "answer_3", "answer_4"];
      const selectedKeys = selectedIndices.map(idx => keyMap[idx]);

      return {
        question_id: q.id,
        answers: selectedKeys
      };
    });

    try {
      await api.studentQuizUpload({
        quiz_id: parseInt(id),
        // student_id removed
        answers: formattedAnswers
      });

      // Calculate local score
      let score = 0;
      questions.forEach((q, i) => {
        const selected = answers[i].sort();
        const correct = q.correct_indices.sort();

        // Exact match check
        if (JSON.stringify(selected) === JSON.stringify(correct)) {
          score++;
        }
      });

      const percent = Math.round((score / questions.length) * 100);
      setResult({ score, percent });
      setFinished(true);

    } catch (err) {
      console.error("Upload error", err);
      setError("Hiba a feltöltés során.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="error-text">{error}</div>;
  if (!questions.length) return <p>{t("common.loading")}</p>;

  if (finished) {
    return (
      <div className="test-result">
        <h1 style={{ color: "#10b981" }}>{t("quiz.success")}</h1>
        <div className="result-card">
          <p>{t("quiz.score")}: <strong>{result?.score} / {questions.length}</strong></p>
          <p>{t("quiz.percent")}: <strong>{result?.percent}%</strong></p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/student")}>
          {t("quiz.backToHome")}
        </button>
      </div>
    );
  }

  const q = questions[index];
  const currentSelections = answers[index];
  // Calculate isMulti inside render to ensure it updates with index
  const isMulti = (q.correct_count ?? 0) > 1;

  return (
    <div className="test-runner">
      <div className="question-header">
        <span className="q-number">{index + 1} / {questions.length}</span>
        <span className={`mode-badge ${isMulti ? "multi" : "single"}`}>
          {isMulti ? t("quiz.multiSelect") : t("quiz.singleSelect")}
        </span>
      </div>

      <h2>{q.text}</h2>

      <div className="options">
        {q.options.map((opt, i) => {
          const isSelected = currentSelections.includes(i);
          return (
            <div
              key={i}
              className={`option ${isSelected ? "selected" : ""}`}
              onClick={() => selectAnswer(i)}
            >
              <div className={`checkbox ${isMulti ? "square" : "round"}`}>
                {isSelected && <span>✔</span>}
              </div>
              <span className="opt-text">{opt}</span>
            </div>
          );
        })}
      </div>

      <div className="navigation">
        <button className="btn btn-secondary" disabled={index === 0}
          onClick={() => setIndex(index - 1)}>{t("quiz.previous")}</button>

        {index === questions.length - 1 ? (
          <button className="btn btn-primary" onClick={finishTest} disabled={loading}>
            {loading ? t("quiz.sending") : t("quiz.finish")}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>{t("quiz.next")}</button>
        )}
      </div>

      <style>{`
        .test-class-nav { margin-bottom: 20px; }
        .test-runner { max-width: 600px; margin: 40px auto; font-family: sans-serif; position: relative; }
        .question-header { display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center; }
        .mode-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .mode-badge.multi { background: #e0f7fa; color: #006064; }
        .mode-badge.single { background: #fff3e0; color: #e65100; }
        
        .options { margin-top: 20px; }
        .option {
          display: flex; align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          margin-bottom: 10px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .option:hover { background: #f9f9f9; border-color: #bbb; }
        .option.selected { background: #e6fffa; border-color: #00bfa5; }
        .checkbox {
            width: 20px; height: 20px; border: 2px solid #ccc; margin-right: 15px;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: white;
        }
        .option.selected .checkbox { background: #00bfa5; border-color: #00bfa5; }
        .checkbox.round { border-radius: 50%; }
        .checkbox.square { border-radius: 4px; }
        
        .navigation { display: flex; justify-content: space-between; margin-top: 30px; gap: 10px; }
        
        .test-result { text-align: center; margin-top: 50px; }
        .result-card { background: #f0f0f0; padding: 30px; border-radius: 12px; display: inline-block; margin-bottom: 20px; }
        .error-text { color: red; text-align: center; margin-top: 20px; }
      `}</style>
    </div >
  );
}