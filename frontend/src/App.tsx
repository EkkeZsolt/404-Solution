import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import './App.scss'
import './index.scss';
import Hero from './hero/Hero';
import LoginPage from './loginpages/login';
import RegisterPage from './loginpages/register';

function Header() {
  const navigate = useNavigate();

  return (
    <>
      <header className="site-header">
        <div className="logo">L</div>
        <nav className="auth">
          <button className="auth-btn" onClick={() => navigate("/login")}>Bejelentkezés/Regisztráció</button>
        </nav>
      </header>
    </>
  );
}

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}


export default App;
