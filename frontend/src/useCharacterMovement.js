import { useEffect } from 'react';

const useCharacterMovement = (position, setPosition, setDirection, isPlaying, currentMap) => {
  useEffect(() => {
    // 게임 중이 아닐 때는 움직임 비활성화
    if (!isPlaying) {
      return;
    }

    const handleKeyDown = (event) => {
      const step = 20; // 한 번에 15px씩 움직임 (더 부드럽게)
      
      // 맵별 경계값 설정
      const boundaries = {
        livingroom: { xMin: 50, xMax: 1360, yMin: 50, yMax: 550 },
        kitchen: { xMin: 50, xMax: 750, yMin: 50, yMax: 550 },
        corridor: { xMin: 50, xMax: 1320, yMin: 50, yMax: 600 }, // 복도는 더 넓게
        toilet: { xMin: 50, xMax: 750, yMin: 50, yMax: 700 }, // 화장실은 더 아래로
        bedroom: { xMin: 50, xMax: 750, yMin: 50, yMax: 750 },
        cellar: { xMin: 50, xMax: 750, yMin: 50, yMax: 550 }
      };
      
      const currentBoundary = boundaries[currentMap] || boundaries.livingroom;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setPosition(prev => ({ 
            ...prev, 
            y: Math.max(currentBoundary.yMin, prev.y - step) 
          }));
          setDirection('back');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setPosition(prev => ({ 
            ...prev, 
            y: Math.min(currentBoundary.yMax, prev.y + step) 
          }));
          setDirection('front');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPosition(prev => ({ 
            ...prev, 
            x: Math.max(currentBoundary.xMin, prev.x - step) 
          }));
          setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPosition(prev => ({ 
            ...prev, 
            x: Math.min(currentBoundary.xMax, prev.x + step) 
          }));
          setDirection('right');
          break;
        default:
          break;
      }
    };

    // 키보드 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);

    // 클린업 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPosition, setDirection, isPlaying, currentMap]);

  return null; // 이 훅은 부작용만 있으므로 아무것도 반환하지 않음
};

export default useCharacterMovement;
