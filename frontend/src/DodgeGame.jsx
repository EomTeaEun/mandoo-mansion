import React, { useState, useEffect, useRef } from 'react';
import './DodgeGame.css';

const DodgeGame = ({ isVisible, onSuccess, onFailure }) => {
  if (!isVisible) return null;
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 250 });
  const [bullets, setBullets] = useState([]);
  const [timeLeft, setTimeLeft] = useState(7);
  const [gameActive, setGameActive] = useState(true);
  const gameLoopRef = useRef();
  const bulletSpawnRef = useRef();
  const timerRef = useRef();

  // 게임 상수
  const PLAYER_SPEED = 15; // 10 -> 15로 증가
  const BULLET_SPEED = 3;
  const BULLET_SPAWN_RATE = 150; // 프레임당 확률 (총알 개수 더 줄임)
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  // 게임 초기화
  useEffect(() => {
    if (isVisible) {
      setPlayerPosition({ x: 50, y: 250 });
      setBullets([]);
      setTimeLeft(7);
      setGameActive(true);
    }
  }, [isVisible]);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameActive) return;

      setPlayerPosition(prev => {
        let newY = prev.y;
        
        switch (event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            newY = Math.max(50, prev.y - PLAYER_SPEED);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            newY = Math.min(GAME_HEIGHT - 100, prev.y + PLAYER_SPEED);
            break;
          default:
            return prev;
        }
        
        return { x: prev.x, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive]);

  // 총알 생성
  const spawnBullet = () => {
    if (Math.random() < 0.3) { // 30% 확률로 총알 생성
      const newBullet = {
        id: Date.now() + Math.random(),
        x: GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT - 100) + 50,
        speed: BULLET_SPEED + Math.random() * 2
      };
      
      setBullets(prev => [...prev, newBullet]);
    }
  };

  // 충돌 감지
  const checkCollision = (player, bullet) => {
    const playerRect = {
      left: player.x,
      right: player.x + 40,
      top: player.y,
      bottom: player.y + 40
    };
    
    const bulletRect = {
      left: bullet.x + 8, // 총알 충돌 범위 더 줄임
      right: bullet.x + 12,
      top: bullet.y + 8,
      bottom: bullet.y + 12
    };
    
    return playerRect.left < bulletRect.right &&
           playerRect.right > bulletRect.left &&
           playerRect.top < bulletRect.bottom &&
           playerRect.bottom > bulletRect.top;
  };

  // 게임 루프
  const gameLoop = () => {
    if (!gameActive) return;

    // 총알 업데이트
    setBullets(prev => {
      const updatedBullets = prev
        .map(bullet => ({
          ...bullet,
          x: bullet.x - bullet.speed
        }))
        .filter(bullet => bullet.x > -20); // 화면 밖으로 나간 총알 제거

      // 충돌 감지
      for (const bullet of updatedBullets) {
        if (checkCollision(playerPosition, bullet)) {
          setGameActive(false);
          onFailure();
          return [];
        }
      }

      return updatedBullets;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // 게임 시작
  useEffect(() => {
    if (gameActive) {
      // 총알 생성 타이머
      bulletSpawnRef.current = setInterval(spawnBullet, 100);
      
      // 게임 루프 시작
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      
      // 7초 타이머
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            onSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (bulletSpawnRef.current) {
        clearInterval(bulletSpawnRef.current);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameActive]);

  return (
    <div className="dodge-game-overlay">
      <div className="dodge-game-container">
        <div className="game-header">
          <h2>🎯 굴비의 총알 피하기 게임</h2>
          <div className="timer">⏰ 남은 시간: {timeLeft}초</div>
        </div>
        
        <div className="game-area">
          <div 
            className="player"
            style={{
              left: `${playerPosition.x}px`,
              top: `${playerPosition.y}px`
            }}
          >
            🧑‍💼
          </div>
          
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="bullet"
              style={{
                left: `${bullet.x}px`,
                top: `${bullet.y}px`
              }}
            >
              💥
            </div>
          ))}
        </div>
        
        <div className="game-instructions">
          <p>🎮 조작법: ↑↓ 방향키 또는 W/S 키로 움직이세요</p>
          <p>🎯 목표: 7초간 총알을 피하세요!</p>
        </div>
      </div>
    </div>
  );
};

export default DodgeGame;
