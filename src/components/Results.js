import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/Results.css';


const Results = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const resultData = JSON.parse(localStorage.getItem('resultData'));

    if (!userData || !resultData) {
      navigate('/');
    }

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
  }, [navigate]);

  const handleExit = () => {
    localStorage.clear(); // Clear all items from localStorage
    navigate('/');
  };

  const resultData = JSON.parse(localStorage.getItem('resultData'));
  if (!resultData) return null;

  const { score, correctCount, wrongCount, skippedCount, percentageScore, timeTaken, notes } = resultData;
  const totalQuestions = resultData.questions.length;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="result-container">
      <div className="result-box">
        <div className="result-summary">
          <div className="score-time">
            <p>Score: <strong>{score} / {totalQuestions * 10}</strong></p>
            <p>Time Taken: <strong>{formatTime(timeTaken)}</strong></p>
          </div>
          <h2 style={{ color: '#2B7DF7' }}>{percentageScore.toFixed(2)}% <span>Total Score</span></h2>
        </div>
        <div className="result-charts">
          <div className="chart">
            <CircularProgressbar
              value={percentageScore}
              text={`${percentageScore.toFixed(2)}%`}
              styles={buildStyles({ textColor: "#2B7DF7", pathColor: "#2B7DF7" })}
            />
            <p>Final Score</p>
          </div>
          <div className="chart">
            <CircularProgressbar
              value={(correctCount / totalQuestions) * 100}
              text={`${correctCount}`}
              styles={buildStyles({ textColor: "#2B7DF7", pathColor: "#2B7DF7" })}
            />
            <p>Correct</p>
          </div>
          <div className="chart">
            <CircularProgressbar
              value={(wrongCount / totalQuestions) * 100}
              text={`${wrongCount}`}
              styles={buildStyles({ textColor: "#2B7DF7", pathColor: "#2B7DF7" })}
            />
            <p>Wrong</p>
          </div>
          <div className="chart">
            <CircularProgressbar
              value={(skippedCount / totalQuestions) * 100}
              text={`${skippedCount}`}
              styles={buildStyles({ textColor: "#2B7DF7", pathColor: "#2B7DF7" })}
            />
            <p>Skipped</p>
          </div>
        </div>
        <div className="result-notes">
          <h4>Your scribble notes:</h4>
          <p>{notes}</p>
        </div>
        <button className="btn btn-primary" onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
};

export default Results;
