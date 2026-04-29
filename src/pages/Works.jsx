import { useState } from 'react';

const Works = () => {
  const gridItems = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="works-container">
      <div className="works-grid">
        {gridItems.map((item) => (
          <div key={item} className="work-item">
            <div className="work-placeholder">
              <span className="coming-soon"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;