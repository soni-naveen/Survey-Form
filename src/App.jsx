import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const questions = [
  {
    id: 1,
    text: "How satisfied are you with our products?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    id: 2,
    text: "How fair are the prices compared to similar retailers?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    id: 3,
    text: "How satisfied are you with the value for money of your purchase?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    id: 4,
    text: "On a scale of 1-10 how would you recommend us to your friends and family?",
    type: "rating",
    min: 1,
    max: 10,
  },
  {
    id: 5,
    text: "What could we do to improve our service?",
    type: "text",
  },
];

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (currentScreen === "survey" && !sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem("currentSessionId", newSessionId);
    }
  }, [currentScreen, sessionId]);

  const handleStartSurvey = () => {
    setCurrentScreen("survey");
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    saveAnswer(questionId, answer);
  };

  const saveAnswer = (questionId, answer) => {
    const answerData = {
      sessionId,
      questionId,
      answer,
      timestamp: new Date().toISOString(),
    };
    const existingAnswers = JSON.parse(
      localStorage.getItem("surveyAnswers") || "[]"
    );
    existingAnswers.push(answerData);
    localStorage.setItem("surveyAnswers", JSON.stringify(existingAnswers));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentScreen("thankYou");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    return (
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-3xl w-full">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p className="text-gray-700 mb-10">{question.text}</p>
        {question.type === "rating" ? (
          <div className="flex justify-center space-x-3 mb-10">
            {[...Array(question.max - question.min + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index + question.min)}
                className={`w-10 h-10 rounded-full focus:outline-none transition-colors duration-200 ${
                  answers[question.id] === index + question.min
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                }`}
              >
                {index + question.min}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows={3}
          />
        )}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {currentScreen === "welcome" && (
        <div className="bg-white rounded-lg shadow-lg max-w-4xl px-8 py-16 w-full text-center">
          <h1 className="text-4xl font-bold mb-5">
            Welcome to our Customer Survey
          </h1>
          <p className="text-gray-600 mb-10">
            We value your feedback! Please take a moment to answer a few
            questions.
          </p>
          <button
            onClick={handleStartSurvey}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Start Survey
          </button>
        </div>
      )}
      {currentScreen === "survey" && renderQuestion()}
      {currentScreen === "thankYou" && (
        <div className="bg-white rounded-lg shadow-lg max-w-4xl px-8 py-20 w-full text-center">
          <h1 className="text-4xl text-green-600 font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600 text-lg">
            We appreciate your feedback. Have a great day!
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
