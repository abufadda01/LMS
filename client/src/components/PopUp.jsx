// PopUp.js
import React from 'react';
import "../style/PopUp.css";

const PopUp = ({ message, onClose }) => {
    return (
        <div className="popup-container">
            <div className="popup">
                <div className="popup-message">
                    <p>Activity submitted successfully.</p>
                    <p>Your score: {message.userScore}</p>
                    <p>You {message.passed ? "passed" : "failed"} this exam</p>
                    <p>Time spent {message.spentTime}</p>
                </div>
                <button className="popup-close" onClick={onClose}>close</button>
            </div>
        </div>
    );
};

export default PopUp;
