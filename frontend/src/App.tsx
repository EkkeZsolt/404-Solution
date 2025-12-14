import './App.scss';
import './index.scss';
import Hero from './components/common/Hero';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateClassroom from './pages/teacher/CreateClassroom';
import ClassroomDetails from './pages/teacher/ClassroomDetails';
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import JoinClassroom from "./pages/student/JoinClassroom";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import QuizPreview from "./pages/teacher/QuizPreview";
import StudentResultDetail from "./pages/teacher/StudentResultDetail";
import QuizRunner from "./pages/student/QuizRunner";
import ClassroomView from "./pages/student/ClassroomView";
import { Routes, Route } from 'react-router-dom';
import FrontWords from './components/common/FrontWords';
import Layout from './components/common/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={
          <>
            <main>
              <Hero />
              <FrontWords />
            </main>
          </>
        }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/create-classroom" element={<CreateClassroom />} />
        <Route path="/teacher/classroom/:id" element={<ClassroomDetails />} />
        <Route path="/teacher/classroom/:groupId/quiz/create" element={<CreateQuiz />} />
        <Route path="/teacher/quiz/:quizId" element={<QuizPreview />} />
        <Route path="/teacher/quiz/:quizId/edit" element={<CreateQuiz />} />
        <Route path="/teacher/quiz/:quizId/student/:userId" element={<StudentResultDetail />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/join-classroom" element={<JoinClassroom />} />
        <Route path="/student/classroom/:id" element={<ClassroomView />} />
        <Route path="/student/quiz/:id" element={<QuizRunner />} />
      </Route>
    </Routes>
  );
}

export default App;
