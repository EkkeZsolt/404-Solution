<<<<<<< HEAD
import './App.scss'
import './index.scss';
import Hero from './hero/Hero';
=======
import React from 'react'
import { useState } from 'react'
import Quiz from './QuizApp/Quiz'
import './App.scss'
import Hero from './components/Hero';
import './index.css';
>>>>>>> 82f1200 (fix: nem működik még mindig valamiért a reac, azt próbálom megcsinálni, a main.tsx.-ben rossz elérési út volt megadva az index.scss-nek)

function App() {
  return (
    <>
      <header className="site-header">
        <div className="logo">L</div>
        <nav className="auth">
          <button className="auth-btn">Bejelentkezés/Regisztráció</button>
        </nav>
      </header>

      <main>
        <Hero />
      </main>
    </>
  );
}

export default App;
