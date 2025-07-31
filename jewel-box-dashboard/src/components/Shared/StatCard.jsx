// src/components/Shared/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, change, isCurrency = false }) => {
  const formattedValue = isCurrency
    ? `Rs ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value.toLocaleString();

  const changeColorClass = change
    ? (parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600')
    : '';

  return (
    <div className="p-5 rounded-lg shadow-md flex flex-col justify-between transition-colors duration-200"
         style={{ backgroundColor: 'var(--bg-card)' }}>
      <p className="text-sm font-medium uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formattedValue}</h3>
        {change && (
          <span className={`text-xs font-semibold ${changeColorClass}`}>
            {change.startsWith('-') ? '' : '+'}{change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;