import React, { useState } from "react";
import { questions } from "../questions";
import { environment } from "../environment";
import "./quiz.css";

const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [userInput, setUserInput] = useState(Array(questions.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { question, choices, isMandatory, questionType } =
    questions[activeQuestion];

  const onClickPrevious = () => {
    setSelectedAnswer("");
    if (activeQuestion !== 0) {
      setActiveQuestion((prev) => prev - 1);
    } else {
      setActiveQuestion(0);
      setUserInput(Array(questions.length).fill(""));
    }
  };

  const onClickNext = () => {
    const updatedUserInput = [...userInput];
    updatedUserInput[activeQuestion] = selectedAnswer;
    setUserInput(updatedUserInput);
    setSelectedAnswerIndex(null);
    setSelectedAnswer("");
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      submitData(updatedUserInput);
      setActiveQuestion(0);
      setUserInput(Array(questions.length).fill(""));
      setIsFinish(true);
    }
  };

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    setSelectedAnswer(answer);
  };

  const onRadioBtnSelected = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  const submitData = async (userInput, e) => {
    try {
      let res = await fetch(environment.submitEndpoint, {
        method: "POST",
        body: JSON.stringify(userInput),
      });
      let resJson = await res.json();
      console.log(resJson);
      if (res.status === 200) {
        // Data submitted successfully
        setIsSubmitted(true);
      } else {
        // Data submitted unsuccessfully
        alert("Some error occured");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderMCQ = () => {
    return (
      <div>
        <ul>
          {choices.map((answer, index) => (
            <li
              onClick={() => onAnswerSelected(answer, index)}
              key={answer}
              className={
                selectedAnswerIndex === index ? "selected-answer" : null
              }
            >
              {answer}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderRadio = () => {
    return (
      <div>
        {choices.map((answer) => (
          <div onChange={onRadioBtnSelected}>
            <input
              type="radio"
              key={answer}
              name={questions.indexOf(question)}
              value={answer}
            />
            <label>{answer}</label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {!isFinish ? (
        <div>
          <div>
            <span className="active-question-no">
              {addLeadingZero(activeQuestion + 1)}
            </span>
            <span className="total-question">
              /{addLeadingZero(questions.length)}
            </span>
          </div>
          <h2>{question}</h2>
          {questionType === "MCQ" ? (
            renderMCQ()
          ) : questionType === "radio" ? (
            renderRadio()
          ) : (
            <>Unsupported: + {questionType}</>
          )}
          <div className={activeQuestion !== 0 ? "flex-space" : "flex-right"}>
            {activeQuestion !== 0 && (
              <button onClick={onClickPrevious}>PREVIOUS</button>
            )}
            <button
              onClick={onClickNext}
              disabled={isMandatory && selectedAnswer === ""}
            >
              {activeQuestion === questions.length - 1 ? "FINISH" : "NEXT"}
            </button>
          </div>
        </div>
      ) : (
        <div className="result">
          {isSubmitted ? (
            <>
              <h3>Thank You</h3>
              <p>Your response has been submitted successfully!</p>
            </>
          ) : (
            <>
              <h3>Sorry</h3>
              <p>
                An error encountered when submitting your response. Please try
                again.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
