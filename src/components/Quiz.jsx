import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css'
import { quizFullStackData, quizFrontendData, quizBackendData } from '../data/data'
import { useParams } from 'react-router-dom';
import Timer from './Timer';

// _____________________________________________________

// Here i want to add loader component :

// import styled from 'styled-components';
// const LoaderWrapper = styled.div`
//    display: flex;
//    justify-content: center;
// `;

// const Loader = styled.div`
//    padding: 10px;
//    border: 6px solid ${colors.primary};
//    border-bottom-color: transparent;
//    border-radius: 22px;
//    animation: ${rotate} 1s infinite linear;
//    height: 0;
//    width: 0;
// `;

// const rotate = keyframes`
//   from {
//     transform: rotate(0deg);
//   }

//   to {
//     transform: rotate(360deg);
//   }
// `;
// _____________________________________________________

const Quiz = () => {

    // Retrieve the stored JSON string from localStorage
    const userDataString = localStorage.getItem('formData');

    // Check if the data exists in localStorage
    // if (userDataString) {
    // Convert the JSON string to a JavaScript object
    const userData = JSON.parse(userDataString);

    // Access and log the first name
    const firstName = userData.firstName;
    // console.log(firstName);
    // } else {
    // console.log('No user data found in localStorage :(');
    // }



    // To get the category selected from URL Params
    const { selectedCategory } = useParams();
    // Log selectedCategory only if it exists
    // useEffect(() => {
    //     if (selectedCategory) {
    //         console.log(selectedCategory);
    //     }
    // }, [selectedCategory]);

    // _____________________________________________________

    // const allTimeLimit = 10 * 60 // 10 min
    const questionTimeLimit = 59 // 5 secs
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(questionTimeLimit); // : to store time limit
    // const [allTimer, setAllTimer] = useState(allTimeLimit); // : to store all time limit
    const [timerProgress, setTimerProgress] = useState(100); // : Initialize to 100%

    // console.log(timer)
    // _____________________________________________________

    // Choose questions based on the selected category
    const questions = selectedCategory === 'Fullstack'
        ? quizFullStackData
        : selectedCategory === 'Frontend'
            ? quizFrontendData
            : selectedCategory === 'Backend'
                ? quizBackendData
                : [];

    // _____________________________________________________

    // To rerender component
    useEffect(() => {
        let countdown;

        if (currentQuestion < questions.length && !showScore) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    const newProgress = (prevTimer / questionTimeLimit) * 100;
                    setTimerProgress(newProgress);

                    if (prevTimer <= 0) {
                        handleNextQuestion();
                        return questionTimeLimit;
                    } else {
                        return prevTimer - 1;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(countdown); // To clear countdown var

    }, [currentQuestion, showScore]);

    // _____________________________________________________

    const handleAnswerOptionClick = (isCorrect) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        handleNextQuestion();
    };

    // _____________________________________________________

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimer(questionTimeLimit); // Réinitialise le minuteur pour la nouvelle question
        } else {
            setShowScore(true);
        }
    };

    // _____________________________________________________

    return (
        <>
            <div className='wrapped-section' >
                {
                    selectedCategory && (
                        <div className='quiz-section'>
                            {showScore ? (
                                <div className='score-section'>
                                    Hello {firstName} You scored {score} out of {questions.length}
                                </div>
                            ) : (
                                <>
                                    <div className='question-section'>
                                        <div className='question-count'>
                                            <span>Question {currentQuestion + 1}</span>/{questions.length}
                                        </div>
                                        <div className='question-text'>{questions[currentQuestion].questionText}</div>
                                        {/* <div className='question-count timer'>
                                        <span>Timer {allTimer}</span>
                                    </div> */}
                                    </div>
                                    <div className='answer-section'>
                                        <div className='timer'>
                                            <progress value={timerProgress} max="100"></progress>
                                        </div>
                                        {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                                            <button key={index} onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                }

            </div>
            <Timer />
        </>

    )
}

export default Quiz;