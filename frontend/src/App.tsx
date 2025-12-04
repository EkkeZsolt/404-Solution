import './App.scss';
import './index.scss';
import Hero from './hero/Hero';
import LoginPage from './loginpages/login';
import RegisterPage from './loginpages/register';
import CreateClassroom from './TanarFelulet/CreateClassroom';
import GroupDetails from './TanarFelulet/GroupDetails';
import TanarFelulet from "./TanarFelulet/tanarfelulet";
import DiakFelulet from "./DiakFelulet/diakfelulet";
import JoinClassroom from "./DiakFelulet/JoinClassroom";
import CreateQuiz from "./TanarFelulet/CreateQuiz";
import QuizNezet from "./TanarFelulet/QuizNezet";
import QuizUserResult from "./TanarFelulet/ReszletDiakNezet";
import { Routes, Route} from 'react-router-dom';
import FrontWords from './front-words/FrontWords'; // <-- Fontos import!

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
      <header className="site-header">
        <h1 className="header-title">Kezdőlap</h1>
        <nav className="auth">
          <button className="auth-btn">Bejelentkezés/Regisztráció</button>
        </nav>
      </header>

      <main>
        <Hero />
        <FrontWords /> {/* <-- Hozzáadva a második szekció */}
      </main>
    </>
    }
    />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/CreateClassroom" element={<CreateClassroom />} />
      <Route path="/GroupDetails/:id" element={<GroupDetails />} />
      <Route path="/tanarFelulet" element={<TanarFelulet />} />
      <Route path="/diakFelulet" element={<DiakFelulet />} />
      <Route path="/JoinClassroom" element={<JoinClassroom />} />
      <Route path="/QuizNezet" element={<QuizNezet />} />
      <Route path="/group/:groupId/quiz/create" element={<CreateQuiz />} />
      <Route path="/quiz/:quizId/user/:userId" element={<QuizUserResult />} />
      </Routes>
  );
}

export default App;
