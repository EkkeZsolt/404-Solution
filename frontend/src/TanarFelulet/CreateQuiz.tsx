import React, { useState, useEffect } from "react";
import "./CreateQuiz.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

    type Answer = { text: string; is_correct: boolean };
    type Question = { id: number; title: string; max_points: number; answers: Answer[] };
    type Quiz = { id: number; name: string; allow_back: boolean; questions: Question[] };

    type CreateQuizProps = {
        existingQuiz?: Quiz;
        onClose: () => void;
    };
export default function CreateQuizPage({ existingQuiz, onClose }: CreateQuizProps) {
    const navigate = useNavigate();
    const { groupId } = useParams();

    const [quizName, setQuizName] = useState("");
    const [allowBack, setAllowBack] = useState(false);
    const [quizId, setQuizId] = useState<number | null>(null);

    const [questions, setQuestions] = useState<any[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

    const blankQuestion = {
        title: "",
        max_points: 1,
        answers: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
        ]
    };

    const [newQuestion, setNewQuestion] = useState(blankQuestion);

    const createQuiz = async () => {
        try {
            const res = await axios.post("/api/quizzes", {
                name: quizName,
                allow_back: allowBack,
                group_id: groupId
            });

            setQuizId(res.data.quiz.id);
        } catch (err) {
            alert("Hiba: nem hozható létre a kvíz. Lehet, hogy név ütközés.");
        }
    };

    const saveQuestion = async () => {
        if (!quizId) return alert("Előbb hozd létre a kvízt!");

        try {
            const res = await axios.post(`/api/quizzes/${quizId}/questions`, newQuestion);
            setQuestions([...questions, res.data.question]);
            setNewQuestion(blankQuestion);
        } catch (err) {
            alert("Hiba a kérdés mentésekor.");
        }
    };

    const openEdit = async (question: any) => {
        setEditingQuestion(question);
    };

    const saveEdit = async () => {
        try {
            await axios.put(`/api/questions/${editingQuestion.id}`, editingQuestion);
            setEditingQuestion(null);
        } catch (err) {
            alert("Hiba a módosítás közben.");
        }
    };

    const finish = () => {
        navigate(`/group/${groupId}`);
    };

    return (
        <div className="create-quiz-page">
            <h1>Kvíz létrehozása</h1>
            <button onClick={onClose}>Bezár</button>
            <div className="quiz-header">
                <input
                    type="text"
                    placeholder="Kvíz neve"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                />

                <label className={allowBack ? "toggle active" : "toggle"}>
                    <input
                        type="checkbox"
                        checked={allowBack}
                        onChange={() => setAllowBack(!allowBack)}
                    />
                    Engedélyezett visszalépés
                </label>

                <button onClick={createQuiz} className="btn-create">
                    Create
                </button>
            </div>

            {quizId && (
                <>
                    <h2>Kérdések</h2>

                    <div className="question-list">
                        {questions.map(q => (
                            <div
                                key={q.id}
                                className="question-item"
                                onClick={() => openEdit(q)}
                            >
                                {q.title} ({q.max_points} pont)
                            </div>
                        ))}
                    </div>

                    <h3>Új kérdés</h3>

                    <div className="new-question">
                        <input
                            type="text"
                            placeholder="Kérdés címe"
                            value={newQuestion.title}
                            onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        />

                        <input
                            type="number"
                            min={1}
                            placeholder="Max pont"
                            value={newQuestion.max_points}
                            onChange={e => setNewQuestion({ ...newQuestion, max_points: Number(e.target.value) })}
                        />

                        {newQuestion.answers.map((a, i) => (
                            <div key={i} className="answer-row">
                                <input
                                    type="text"
                                    placeholder={`Válasz ${i + 1}`}
                                    value={a.text}
                                    onChange={e => {
                                        const updated = [...newQuestion.answers];
                                        updated[i].text = e.target.value;
                                        setNewQuestion({ ...newQuestion, answers: updated });
                                    }}
                                />
                                <input
                                    type="radio"
                                    checked={a.is_correct}
                                    onChange={() => {
                                        const updated = newQuestion.answers.map((ans, idx) => ({
                                            ...ans,
                                            is_correct: idx === i
                                        }));
                                        setNewQuestion({ ...newQuestion, answers: updated });
                                    }}
                                />
                            </div>
                        ))}

                        <button onClick={saveQuestion} className="btn-save">Mentés</button>
                    </div>

                    <button onClick={finish} className="btn-finish">
                        Vissza a csoporthoz
                    </button>
                </>
            )}

            {editingQuestion && (
                <div className="edit-modal">
                    <div className="edit-box">
                        <h2>Kérdés módosítása</h2>

                        <input
                            type="text"
                            value={editingQuestion.title}
                            onChange={e => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                        />

                        <input
                            type="number"
                            min={1}
                            value={editingQuestion.max_points}
                            onChange={e => setEditingQuestion({ ...editingQuestion, max_points: Number(e.target.value) })}
                        />

                        <button onClick={saveEdit} className="btn-save">Mentés</button>
                        <button onClick={() => setEditingQuestion(null)} className="btn-cancel">Mégse</button>
                    </div>
                </div>
            )}
        </div>
    );
}