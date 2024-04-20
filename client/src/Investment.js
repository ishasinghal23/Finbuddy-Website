import React from 'react';
import './Investment.css'; // Import the CSS file

const Investment = () => {
  const redirectToPredictionPage = () => {
    window.open('https://stockpricepredictor-capstone.streamlit.app/', '_blank');
  };

  const redirectToPredictionPage2 = () => {
    window.open('https://crypto-price-prediction-ibd2.onrender.com/', '_blank');
  };


  return (
    <div className="investment-container">
      <div className="split-background">
        <div className="split-left">
        <div className="animate-box" onClick={redirectToPredictionPage}>
            <h2>Stock Price Prediction</h2>
          </div>
        </div>
        <div className="split-right"> 
        <div className="animate-box" onClick={() => redirectToPredictionPage2('https://crypto-price-prediction-ibd2.onrender.com/')}>
            <h2>Crypto Price Prediction</h2>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default Investment;
