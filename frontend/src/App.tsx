import { useState } from 'react'
import Quiz from './quiz-app/Quiz'
import Footer from './footer/Footer'
import FrontWords from './front-words/FrontWords'
import Header from './header/Header'
import './App.scss'
import Hero from './hero/Hero'

function App() {


  return (
    <>
      <div>
        <Header/>
        <Hero/>
         <Quiz />
         <FrontWords/>
         <Footer/>
      </div>
    </>
  )
}

export default App
