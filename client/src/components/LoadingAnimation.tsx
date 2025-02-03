import React from 'react';

const LoadingAnimation: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <p className="loading-text">Thinking...</p>
        </div>
    );
};

export default LoadingAnimation; 