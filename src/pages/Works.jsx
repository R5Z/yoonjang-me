import { useState } from 'react';

const Works = () => {
  const gridItems = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="works-container">
      {/* 떠다니는 원들 */}
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>
      <div className="floating-circle circle-3"></div>
      
      <div className="works-grid">
        {gridItems.map((item) => (
          <div key={item} className="work-item">
            <div className="work-placeholder">
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;