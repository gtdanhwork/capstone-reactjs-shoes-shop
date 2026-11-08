import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-dark" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="text-muted mt-2 fw-bold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;