import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuizUserResult.scss";

type Answer = {
    id: number;
    text: string;
    is_correct: boolean;
};

type Question = {
    id: number;
    title: string;
    answers: Answer[];
};

type ChosenAnswer = {
    id: number;
    question: Question;
    answer: Answer;
};

type UserResult = {
    score: number;
    percentage: number;
    user: { name: string };
    chosen_answers: ChosenAnswer[];
};

export default function QuizUserResult() {
    const { quizId, userId } = useParams();
    const [result, setResult] = useState<UserResult | null>(null);
    const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

    useEffect(() => {
        axios
            .get(`/api/quizzes/${quizId}/results/${userId}`)
            .then((res) => setResult(res.data));
    }, [quizId, userId]);

    if (!result) return <div>Betöltés...</div>;

    return (
        <div className="user-result-page">
            <h1>{result.user.name} eredménye</h1>

            <div className="score-box">
                <p><strong>Pontszám:</strong> {result.score}</p>
                <p><strong>Százalék:</strong> {result.percentage}%</p>
            </div>

            <h2>Kérdések</h2>
            <ul className="question-list">
                {result.chosen_answers.map((qa) => {
                    const correct = qa.answer.is_correct;

                    return (
                        <li
                            key={qa.id}
                            className={`question-item ${correct ? "correct" : "wrong"}`}
                            onClick={() =>
                                setOpenQuestionId(
                                    openQuestionId === qa.question.id ? null : qa.question.id
                                )
                            }
                        >
                            <div className="question-header">
                                <span>{qa.question.title}</span>
                                <span className="status">
                                    {correct ? "Jó" : "Rossz"}
                                </span>
                            </div>

                            {openQuestionId === qa.question.id && (
                                <div className="answers-expanded">
                                    {qa.question.answers.map((ans) => {
                                        const isChosen = ans.id === qa.answer.id;
                                        const isCorrect = ans.is_correct;

                                        return (
                                            <div
                                                key={ans.id}
                                                className={`answer-row
                                                    ${isCorrect ? "green" : ""}
                                                    ${isChosen && !isCorrect ? "red" : ""}
                                                    ${isChosen && isCorrect ? "green chosen" : ""}
                                                `}
                                            >
                                                <span className="bullet">•</span>
                                                <span>{ans.text}</span>
                                                {isChosen && <span className="chosen-tag"> (Te jelölted)</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}