import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import questionsData from '../questions.json';
import warningIcon from '../images/warning.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/TestPage.css';

const TestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const storedIndex = localStorage.getItem('currentQuestionIndex');
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem('answers');
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });
  const [notes, setNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTimeLeft = localStorage.getItem('timeLeft');
    return storedTimeLeft ? parseInt(storedTimeLeft, 10) : 300;
  });
  const [isUserValid, setIsUserValid] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Function to prevent back navigation
  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, null, window.location.pathname);
      });
    };

    preventBackNavigation();

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  const handleSubmit = useCallback(() => {
    const scoreData = calculateScore();
    const timeTaken = 300 - timeLeft;
    const resultData = {
      answers,
      questions,
      notes,
      ...scoreData,
      timeTaken,
    };
    localStorage.setItem('resultData', JSON.stringify(resultData));
    navigate('/results');
  }, [answers, questions, notes, timeLeft, navigate]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(storedUserData);
    const category = userData.category;
    const filteredQuestions = questionsData.filter(question => question.category === category).slice(0, 3);
    setQuestions(filteredQuestions);
    setIsUserValid(true);
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('timeLeft', timeLeft.toString());

    if (isUserValid) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          const newTimeLeft = prevTime - 1;
          localStorage.setItem('timeLeft', newTimeLeft.toString());
          return newTimeLeft;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isUserValid, timeLeft, handleSubmit]);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  const handleAnswerChange = (questionIndex, optionId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionId,
    }));

    localStorage.setItem('answers', JSON.stringify({
      ...answers,
      [questionIndex]: optionId,
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) {
      setShowExitModal(true);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSkip = () => {
    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const calculateScore = () => {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let answeredCount = 0;

    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        answeredCount++;
        if (answers[index] === question.correct_option) {
          score += 10;
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        skippedCount++;
      }
    });

    const totalQuestions = questions.length;
    const percentageScore = (score / (totalQuestions * 10)) * 100;

    return { score, correctCount, wrongCount, skippedCount, answeredCount, percentageScore };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    localStorage.clear();
    navigate('/');
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    handleSubmit();
  };

  if (!isUserValid) return null;

  if (questions.length === 0) {
    return <div>No questions available for this category.</div>;
  }

  return (
    <div className="container test-page">
      <div className="timer">Time left: {formatTime(timeLeft)}</div>
      <div className="main-content">
        <div className="question-section">
          <div className="question-count">Question {currentQuestionIndex + 1} of {questions.length}</div>
          <div className="question-text">{questions[currentQuestionIndex].question}</div>
          <ul className="options list-unstyled">
            {questions[currentQuestionIndex].options.map(option => (
              <li key={option.id} className="option">
                <label>
                  <input
                    type="radio"
                    name={`question_${currentQuestionIndex}`}
                    value={option.id}
                    checked={answers[currentQuestionIndex] === option.id}
                    onChange={() => handleAnswerChange(currentQuestionIndex, option.id)}
                  />
                  {option.value}
                </label>
              </li>
            ))}
          </ul>
          <div className="navigation-buttons">
            {currentQuestionIndex === 0 ? (
              <button className="btn btn-secondary" onClick={handleExit}>Exit</button>
            ) : (
              <button className="btn btn-secondary" onClick={handlePrevious}>Previous</button>
            )}
            <button className="btn btn-secondary" onClick={handleSkip}>Skip</button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button className="btn btn-success" onClick={() => setShowSubmitModal(true)}>Submit</button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>Next</button>
            )}
          </div>
        </div>
        <div className="notepad-section">
          <textarea
            className="form-control"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write your notes here..."
          />
        </div>
      </div>

      <Modal show={showExitModal} onHide={handleCancelExit} centered dialogClassName="custom-modal">
        <Modal.Body>
          <img src={warningIcon} alt="Warning" className="warning-icon" />
          <div className="warning-text">Warning</div>
          <div>Are you sure you want to exit the exam?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmExit}>Exit</Button>
          <Button variant="primary" onClick={handleCancelExit}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered dialogClassName="custom-modal">
        <Modal.Body>
          <img src={warningIcon} alt="Warning" className="warning-icon" />
          <div className="warning-text">Warning</div>
          <div>Are you sure you want to submit the exam?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmSubmit}>Submit</Button>
          <Button variant="primary" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestPage;
