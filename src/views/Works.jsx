import { useState } from 'react';

const Works = () => {
  const [selectedWork, setSelectedWork] = useState(null);

  const works = [
    {
      id: 1,
      position: 'top-left',
      title: "",
      description: "",
      image: ""
    },
    {
      id: 2,
      position: 'top-right',
      title: "",
      description: "",
      image: ""
    },
    {
      id: 3,
      position: 'bottom-left',
      title: "",
      description: "",
      image: ""
    },
    {
      id: 4,
      position: 'bottom-right',
      title: "",
      description: "",
      image: ""
    }
  ];

  const handleWorkClick = (work) => {
    if (selectedWork?.id === work.id) {
      setSelectedWork(null); // 같은 칸 다시 클릭하면 닫기
    } else {
      setSelectedWork(work);
    }
  };

  // 선택된 위치에 따라 그리드 템플릿 결정
  const getGridStyle = () => {
    if (!selectedWork) {
      return {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr'
      };
    }

    switch (selectedWork.position) {
      case 'top-left':
        return {
          gridTemplateColumns: '5fr 1fr',
          gridTemplateRows: '5fr 1fr'
        };
      case 'top-right':
        return {
          gridTemplateColumns: '1fr 5fr',
          gridTemplateRows: '5fr 1fr'
        };
      case 'bottom-left':
        return {
          gridTemplateColumns: '5fr 1fr',
          gridTemplateRows: '1fr 5fr'
        };
      case 'bottom-right':
        return {
          gridTemplateColumns: '1fr 5fr',
          gridTemplateRows: '1fr 5fr'
        };
      default:
        return {};
    }
  };

  return (
    <div className="works-container">
      {/* 떠다니는 원들 */}
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>
      <div className="floating-circle circle-3"></div>
      
      <div 
        className="works-grid" 
        style={getGridStyle()}
      >
        {works.map((work) => (
          <div 
            key={work.id} 
            className={`work-item ${selectedWork?.id === work.id ? 'expanded' : ''}`}
            onClick={() => handleWorkClick(work)}
          >
            {selectedWork?.id === work.id ? (
              <div className="work-expanded-content">
                <div className="work-expanded-image">
                  {work.image ? (
                    <img src={work.image} alt={work.title} />
                  ) : (
                    <span className="coming-soon-large">Coming Soon</span>
                  )}
                </div>
                <div className="work-expanded-text">
                  <h2 className="work-expanded-title">{work.title}</h2>
                  <p className="work-expanded-description">{work.description}</p>
                </div>
              </div>
            ) : (
              <div className="work-placeholder">
                <span className="coming-soon"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;