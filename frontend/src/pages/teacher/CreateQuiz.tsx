import { useState, useEffect } from "react";
import "./CreateQuiz.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../../services/api";
import { useModal } from "../../context/ModalContext";

type CreateQuizProps = {
    existingQuiz?: any;
    onClose?: () => void;
};

export default function CreateQuizPage({ existingQuiz, onClose }: CreateQuizProps) {
    const navigate = useNavigate();
    const { groupId, quizId } = useParams();
    const location = useLocation();
    const { showModal } = useModal();
    const classroomIdState = location.state?.classroomId;

    const [quizName, setQuizName] = useState(existingQuiz?.name || "");
    const [allowBack, setAllowBack] = useState(existingQuiz?.allow_back || false);
    const [questions, setQuestions] = useState<any[]>(existingQuiz?.questions || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const blankQuestion = {
        question_text: "",
        max_points: 1,
        answers: ["", "", "", ""],
        correctIndices: [] as number[]
    };

    // State for the question currently being edited or added
    const [currentQuestion, setCurrentQuestion] = useState(blankQuestion);
    const [isAddingNew, setIsAddingNew] = useState(false);

    // Fetch data if accessed via route /quiz/edit/:quizId
    useEffect(() => {
        const fetchEditData = async () => {
            if (!existingQuiz && quizId) {
                try {
                    const cid = classroomIdState; // We need classroomId for editQuiz call? 
                    // Actually editQuiz spec says { quiz_id, classroom_id }.
                    // If we don't have classroomId, we try to fetch with just quizId if allowed or try 0/undefined fallback.
                    const data = await api.editQuiz({
                        quiz_id: parseInt(quizId),
                        classroom_id: cid ? parseInt(cid) : 0 // Fallback to 0 if undefined, or handle api gracefully if 0 is valid placeholder
                    });

                    const quiz = data.quiz || data;
                    setQuizName(quiz.name);
                    setAllowBack(Boolean(quiz.allow_back));

                    // Parse questions
                    if (quiz.questions) {
                        const parsedQuestions = quiz.questions.map((q: any) => {
                            const answers = [
                                q.answer_1 || "",
                                q.answer_2 || "",
                                q.answer_3 || "",
                                q.answer_4 || ""
                            ];

                            let correctIndices: number[] = [];
                            try {
                                let ca = q.correct_answers;
                                if (typeof ca === "string") {
                                    ca = JSON.parse(ca);
                                }
                                if (Array.isArray(ca)) {
                                    correctIndices = ca.map((ansStr: string) => {
                                        const match = ansStr.match(/answer_(\d+)/);
                                        return match ? parseInt(match[1]) - 1 : -1;
                                    }).filter(idx => idx !== -1);
                                }
                            } catch (e) {
                                console.error("Error parsing correct_answers", e);
                            }

                            return {
                                id: q.id,
                                question_text: q.question_text,
                                max_points: q.max_points,
                                answers,
                                correctIndices
                            };
                        });
                        setQuestions(parsedQuestions);
                    }
                } catch (err: any) {
                    console.error("Failed to load quiz data:", err);
                    showModal({ title: "Hiba", message: "Hiba a kvíz betöltésekor." });
                }
            }
        };
        fetchEditData();
    }, [quizId, existingQuiz, classroomIdState]);

    // Parse prop-based existingQuiz (legacy support or internal usage)
    useEffect(() => {
        if (existingQuiz && existingQuiz.questions) {
            // ... (keep existing parsing logic if passing props) ...
            const parsedQuestions = existingQuiz.questions.map((q: any) => {
                const answers = [
                    q.answer_1 || "",
                    q.answer_2 || "",
                    q.answer_3 || "",
                    q.answer_4 || ""
                ];
                let correctIndices: number[] = [];
                try {
                    let ca = q.correct_answers;
                    if (typeof ca === "string") ca = JSON.parse(ca);
                    if (Array.isArray(ca)) {
                        correctIndices = ca.map((ansStr: string) => {
                            const match = ansStr.match(/answer_(\d+)/);
                            return match ? parseInt(match[1]) - 1 : -1;
                        }).filter(idx => idx !== -1);
                    }
                } catch (e) { console.error(e); }
                return { id: q.id, question_text: q.question_text, max_points: q.max_points, answers, correctIndices };
            });
            setQuestions(parsedQuestions);
        }
    }, [existingQuiz]);


    const saveCurrentQuestion = () => {
        if (editingIndex !== null) {
            // Update existing
            const updated = [...questions];
            updated[editingIndex] = currentQuestion;
            setQuestions(updated);
            setEditingIndex(null);
        } else {
            // Add new
            setQuestions([...questions, currentQuestion]);
            setIsAddingNew(false);
        }
        setCurrentQuestion(blankQuestion);
    };

    const startEditQuestion = (index: number) => {
        setEditingIndex(index);
        setCurrentQuestion(questions[index]);
        setIsAddingNew(false); // Close add form if open
    };

    const startAddQuestion = () => {
        setCurrentQuestion(blankQuestion);
        setIsAddingNew(true);
        setEditingIndex(null); // Close other editors
    };

    const deleteQuestion = (index: number) => {
        showModal({
            title: "Törlés",
            message: "Biztosan törölni szeretnéd ezt a kérdést?",
            type: "confirm",
            onConfirm: () => {
                const updated = questions.filter((_, i) => i !== index);
                setQuestions(updated);
                // If we were editing this one, close editor
                if (editingIndex === index) {
                    setEditingIndex(null);
                    setCurrentQuestion(blankQuestion);
                }
            }
        });
    };

    const handleSaveQuiz = async () => {
        const classroomId = groupId ? parseInt(groupId) : (existingQuiz?.classroom_id || classroomIdState);

        if (!classroomId || isNaN(classroomId)) {
            // If navigating from edit link without state, trying to survive:
            // Maybe quizId fetch response had it? We didn't save it to state.
            // Assuming classroomIdState was passed properly.
            showModal({ title: "Hiba", message: "Hiba: Érvénytelen classroom ID! (Próbáld újra a csoport oldalról)" });
            return;
        }

        if (!quizName.trim()) {
            showModal({ title: "Hiba", message: "Adjon meg egy nevet a kvíznek!" });
            return;
        }

        if (questions.length === 0) {
            showModal({ title: "Hiba", message: "Legalább egy kérdést adjon hozzá!" });
            return;
        }

        // Validate answers...
        for (let i = 0; i < questions.length; i++) {
            // ... keep validation logic ...
            const q = questions[i];
            const ans1 = q.answers[0] || "";
            const ans2 = q.answers[1] || "";
            const ans3 = q.answers[2] || "";
            const ans4 = q.answers[3] || "";
            if (!ans1.trim() || !ans2.trim() || !ans3.trim() || !ans4.trim()) {
                showModal({ title: "Hiba", message: `Hiba a ${i + 1}. kérdésnél: Minden kérdéshez 4 válaszlehetőséget meg kell adni!` });
                return;
            }
            if (q.correctIndices.length === 0) {
                showModal({ title: "Hiba", message: `Hiba a ${i + 1}. kérdésnél: Jelöljön meg legalább egy helyes választ!` });
                return;
            }
        }

        const formattedQuestions = questions.map(q => {
            // ... keep mapping logic ...
            const specQ: any = {
                question_text: q.question_text,
                max_points: q.max_points,
                answer_1: q.answers[0] || "",
                answer_2: q.answers[1] || "",
                answer_3: q.answers[2] || "",
                answer_4: q.answers[3] || "",
                correct_answers: q.correctIndices.map((i: number) => `answer_${i + 1}`)
            };
            if (q.id) specQ.id = q.id;
            return specQ;
        });

        try {
            const qId = existingQuiz?.id || quizId;
            if (qId) {
                const payload = {
                    quiz_id: parseInt(qId),
                    classroom_id: parseInt(classroomId),
                    name: quizName,
                    allow_back: allowBack,
                    questions: formattedQuestions
                };
                console.log("Update Payload:", JSON.stringify(payload, null, 2));
                await api.updateQuiz(payload);
            } else {
                await api.createQuiz({
                    classroom_id: parseInt(classroomId),
                    name: quizName,
                    allow_back: allowBack,
                    questions: formattedQuestions
                });
            }

            showModal({
                title: "Siker",
                message: "Sikeres mentés!",
                onConfirm: () => {
                    if (onClose) onClose();
                    else navigate(-1);
                }
            });

        } catch (err: any) {
            console.error("API hiba:", err);
            showModal({ title: "Hiba", message: err.message || "Hiba történt a mentés során." });
        }
    };

    // Sub-render for Question Form
    const renderQuestionForm = () => (
        <div className="question-editor inline-editor">
            <h3>{editingIndex !== null ? "Kérdés módosítása" : "Új kérdés"}</h3>
            <input
                type="text"
                placeholder="Kérdés szövege"
                value={currentQuestion.question_text}
                onChange={e => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                className="question-text-input"
            />
            <div className="points-input">
                <label>Pontszám: </label>
                <input
                    type="number"
                    value={currentQuestion.max_points}
                    onChange={e => setCurrentQuestion({ ...currentQuestion, max_points: parseInt(e.target.value) })}
                />
            </div>

            <div className="answers-grid">
                {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="answer-input">
                        <input
                            type="text"
                            placeholder={`Válasz ${idx + 1}`}
                            value={currentQuestion.answers[idx]}
                            onChange={e => {
                                const newAnswers = [...currentQuestion.answers];
                                newAnswers[idx] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                            }}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={currentQuestion.correctIndices.includes(idx)}
                                onChange={e => {
                                    const newIndices = e.target.checked
                                        ? [...currentQuestion.correctIndices, idx]
                                        : currentQuestion.correctIndices.filter(i => i !== idx);
                                    setCurrentQuestion({ ...currentQuestion, correctIndices: newIndices });
                                }}
                            /> Helyes
                        </label>
                    </div>
                ))}
            </div>

            <div className="editor-actions">
                <button onClick={saveCurrentQuestion} className="save-q-btn">{editingIndex !== null ? "Frissítés" : "Hozzáadás"}</button>
                <button onClick={() => { setEditingIndex(null); setIsAddingNew(false); }} className="cancel-q-btn">Mégse</button>
            </div>
        </div>
    );

    return (
        <div className="create-quiz-page">
            <h1>{existingQuiz || quizId ? "Kvíz szerkesztése" : "Új Kvíz"}</h1>

            <div className="quiz-meta">
                <input
                    className="form-input"
                    type="text"
                    placeholder="Kvíz neve"
                    value={quizName}
                    onChange={e => setQuizName(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={allowBack}
                        onChange={e => setAllowBack(e.target.checked)}
                    />
                    Visszalépés engedélyezése
                </label>
            </div>

            <div className="questions-container">
                <h2>Kérdések ({questions.length})</h2>
                <ul className="questions-list">
                    {questions.map((q, i) => (
                        <div key={i} className="question-item-wrapper">
                            <li className="question-item">
                                <div className="q-preview">
                                    <strong>{i + 1}. {q.question_text}</strong> ({q.max_points} pont)
                                </div>
                                <div className="q-actions">
                                    <button className="btn btn-secondary" onClick={() => startEditQuestion(i)} disabled={editingIndex !== null}>Szerkeszt</button>
                                    <button className="btn btn-danger" onClick={() => deleteQuestion(i)}>Töröl</button>
                                </div>
                            </li>
                            {/* INLINE EDITOR */}
                            {editingIndex === i && (
                                <div className="inline-editor-container">
                                    {renderQuestionForm()}
                                </div>
                            )}
                        </div>
                    ))}
                </ul>

                {/* Add New Logic */}
                {!isAddingNew && editingIndex === null && (
                    <button onClick={startAddQuestion} className="btn btn-accent">+ Új kérdés hozzáadása</button>
                )}

                {isAddingNew && (
                    <div className="new-question-container">
                        {renderQuestionForm()}
                    </div>
                )}
            </div>

            <div className="actions footer-actions">
                <button onClick={handleSaveQuiz} className="btn btn-primary">Kvíz Mentése</button>
                <button className="btn btn-secondary" onClick={() => onClose ? onClose() : navigate(-1)}>Mégse</button>
            </div>
        </div>
    );
}