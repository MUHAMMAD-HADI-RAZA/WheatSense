import React from 'react';

function ResultCard({ result }) {
  return (
    <div className="result-card">
      <h2>Prediction: {result.disease_name}</h2>
      <p><strong>Symptoms:</strong> {result.symptoms}</p>
      <p><strong>Prevention:</strong> {result.prevention}</p>
    </div>
  );
}

export default ResultCard;
