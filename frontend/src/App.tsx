import './App.scss';
import './index.scss';
import Hero from './hero/Hero';
import FrontWords from './front-words/FrontWords'; // <-- Fontos import!

function App() {
  return (
    <>
      <header className="site-header">
        {}
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
  );
}

export default App;