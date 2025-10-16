import React, { useState } from 'react';
import './Quiz.scss'; // 🎯 SCSS importálása

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const questions: Question[] = [
  {
    question: 'Mi a React fő célja?',
    options: ['Szerver-oldali keretrendszer', 'Frontend UI könyvtár', 'Adatbázis-kezelő', 'Mobil app fejlesztő eszköz'],
    correctAnswer: 'Frontend UI könyvtár',
  },
  {
    question: 'Mi a useState hook célja?',
    options: ['Stílus hozzáadása', 'Állapot kezelése', 'Routing kezelése', 'API hívás'],
    correctAnswer: 'Állapot kezelése',
  },
  {
    question: 'Mi a TypeScript fő előnye JavaScript-tel szemben?',
    options: ['Lassabb futás', 'Kisebb fájlméret', 'Típusellenőrzés', 'Nem kell fordítani'],
    correctAnswer: 'Típusellenőrzés',
  },
];

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // ne lehessen újra kattintani

    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
  };

  return (
    <div className="quiz-container">
      {isFinished ? (
        <div>
          <h2>Végeredmény: {score} / {questions.length}</h2>
          <button onClick={restartQuiz}>Újrakezdés</button>
        </div>
      ) : (
        <div className="quiz-box">
          <h2>{currentQuestion.question}</h2>
          <ul className="option-list">
            {currentQuestion.options.map((option) => {
              let className = 'option-item';
              if (selectedOption) {
                if (option === currentQuestion.correctAnswer) {
                  className += ' correct';
                } else if (option === selectedOption) {
                  className += ' incorrect';
                }
              }
              return (
                <li
                  key={option}
                  className={className}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
          <p>Kérdés {currentQuestionIndex + 1} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
