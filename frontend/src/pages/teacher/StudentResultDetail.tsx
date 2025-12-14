import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./StudentResultDetail.scss";

type Detail = {
    question_id: number;
    question_text: string;
    max_points: number;
    score_for_question: number;
    correct_answers: string[];
    student_answers: string[];
};

type UserResult = {
    student_id: number;
    student_name: string;
    total_score: number;
    details: Detail[];
};

export default function QuizUserResult() {
    const { quizId, userId } = useParams<{ quizId: string; userId: string }>();
    const [result, setResult] = useState<UserResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!quizId || !userId) return;
            try {
                setLoading(true);
                // Fetch all results for the quiz
                const data = await api.teacherClassroomQuiz(parseInt(quizId));

                // Find the specific student's result
                const targetStudentId = parseInt(userId);
                const studentResult = data.results?.find((r: any) => r.student_id === targetStudentId);

                if (studentResult) {
                    setResult(studentResult);
                } else {
                    setError("Nem található eredmény ehhez a diákhoz.");
                }
            } catch (err) {
                console.error("Hiba", err);
                setError("Hiba történt az adatok betöltésekor.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quizId, userId]);

    if (loading) return <div>Betöltés...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!result) return <div>Nincs megjeleníthető adat.</div>;

    // Calculate percentage
    const maxPointsTotal = result.details.reduce((sum, d) => sum + d.max_points, 0);
    const percentage = maxPointsTotal > 0 ? Math.round((result.total_score / maxPointsTotal) * 100) : 0;

    return (
        <div className="user-result-page">
            <h1>{result.student_name} eredménye</h1>

            <div className="score-box">
                <p><strong>Pontszám:</strong> {result.total_score} / {maxPointsTotal}</p>
                <p><strong>Százalék:</strong> {percentage}%</p>
            </div>

            <h2>Kérdések</h2>
            <ul className="question-list">
                {result.details.map((detail, index) => {
                    // Basic logic to determine if fully correct (simple comparison for UI color)
                    const isFullPoints = detail.score_for_question === detail.max_points;
                    const isZeroPoints = detail.score_for_question === 0;

                    let statusClass = "partial";
                    if (isFullPoints) statusClass = "correct";
                    if (isZeroPoints) statusClass = "wrong";

                    return (
                        <li key={detail.question_id || index} className={`question-item ${statusClass}`}>
                            <div className="question-header">
                                <span className="question-text"><strong>{index + 1}.</strong> {detail.question_text}</span>
                                <span className="points">
                                    {detail.score_for_question} / {detail.max_points} pont
                                </span>
                            </div>

                            <div className="answers-box">
                                <div className="answer-section">
                                    <strong>Diák válasza(i):</strong>
                                    {detail.student_answers && detail.student_answers.length > 0 ? (
                                        <ul>
                                            {detail.student_answers.map((ans, i) => <li key={i}>{ans}</li>)}
                                        </ul>
                                    ) : (
                                        <p><em>Nem válaszolt</em></p>
                                    )}
                                </div>
                                <div className="answer-section">
                                    <strong>Helyes válasz(ok):</strong>
                                    <ul>
                                        {detail.correct_answers.map((ans, i) => <li key={i}>{ans}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}