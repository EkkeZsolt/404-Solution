import React from 'react'
import { useState } from 'react'
import Quiz from './quiz-app/Quiz'
import Footer from './footer/Footer'
import FrontWords from './front-words/FrontWords'
import Header from './header/Header'
import './App.scss'
import './index.css';
import Hero from './hero/Hero';

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
