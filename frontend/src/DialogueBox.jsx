import React, { useState, useEffect } from 'react';
import './DialogueBox.css';

const DialogueBox = ({ 
  dialogue, 
  isVisible, 
  onClose, 
  onChoice, 
  onComplete,
  currentMap,
  showEndingPage 
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  // 대화창이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isVisible) {
      setCurrentLineIndex(0);
      setPasswordInput('');
      setShowPasswordInput(false);
    }
  }, [isVisible]);
  
  if (!isVisible || !dialogue) {
    return (
      <div className={`${showEndingPage ? "dialogue-overlay-no-bg" : "dialogue-overlay"} hidden`}>
      </div>
    );
  }
  
  const { lines, choices, item } = dialogue;
  const currentLine = lines[currentLineIndex];
  const isLastLine = currentLineIndex === lines.length - 1;
  const hasChoices = choices && choices.length > 0;
  
  // 비밀번호 입력이 필요한 대화인지 확인
  const needsPasswordInput = currentLine && currentLine.includes('비밀번호를 입력하세요');
  
  // 비밀번호 입력 처리
  const handlePasswordSubmit = () => {
    if (passwordInput === '486') {
      // 올바른 비밀번호
      onChoice({ action: 'enter_password_486' });
    } else {
      // 잘못된 비밀번호
      onChoice({ action: 'enter_wrong_password' });
    }
    setPasswordInput('');
    setShowPasswordInput(false);
  };
  
  // 비밀번호 입력 취소
  const handlePasswordCancel = () => {
    setPasswordInput('');
    setShowPasswordInput(false);
    onClose();
  };
  
  const handleNext = () => {
    if (isLastLine) {
      if (needsPasswordInput) {
        // 비밀번호 입력이 필요한 경우
        setShowPasswordInput(true);
        return;
      } else if (hasChoices) {
        // 선택지가 있으면 선택지를 표시
        return;
      } else {
        // 선택지가 없으면 대화창 닫기
        onClose();
        setCurrentLineIndex(0);
        // onComplete 콜백이 있으면 호출
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      setCurrentLineIndex(prev => prev + 1);
    }
  };
  
  const handleChoice = (choice) => {
    if (choice.action === 'close_dialogue') {
      onClose();
      setCurrentLineIndex(0);
    } else if (choice.action === 'use_key') {
      // 열쇠 사용 로직
      onChoice(choice);
      onClose();
      setCurrentLineIndex(0);
    } else if (choice.action === 'use_driver') {
      // 드라이버 사용 로직 - onComplete 콜백을 위해 대화창을 닫지 않음
      onChoice(choice);
      // onClose()를 호출하지 않음 - onComplete에서 처리됨
    } else if (choice.action === 'use_kitchen_key') {
      // 부엌 찬장 열쇠 사용 로직 - onComplete 콜백을 위해 대화창을 닫지 않음
      onChoice(choice);
      // onClose()를 호출하지 않음 - onComplete에서 처리됨
    } else if (choice.action === 'enter_wrong_password') {
      // 잘못된 비밀번호 - 대화창을 닫지 않고 새로운 대사 표시
      onChoice(choice);
      setCurrentLineIndex(0); // 새로운 대사를 위해 인덱스 리셋
      // onClose()를 호출하지 않음 - Game.jsx에서 새로운 대사 설정
    } else {
      // 다른 액션 처리
      onChoice(choice);
      onClose();
      setCurrentLineIndex(0);
    }
  };
  
  return (
    <div className={showEndingPage ? "dialogue-overlay-no-bg" : "dialogue-overlay"}>
      <div className="dialogue-box" onClick={handleNext}>
        <div className="dialogue-content">
          <p className="dialogue-text">{currentLine}</p>
          
          {/* 아이템 획득 메시지 */}
          {item && isLastLine && !hasChoices && (
            <div className="item-obtained">
              <span className="item-icon">🔑</span>
              <span className="item-text">{item} 획득!</span>
            </div>
          )}
          
          {/* 선택지 표시 */}
          {hasChoices && isLastLine && (
            <div className="choice-buttons" onClick={(e) => e.stopPropagation()}>
              {choices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-button"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
          
          {/* 비밀번호 입력 필드 */}
          {showPasswordInput && (
            <div className="password-input-container" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="password-input"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
              <div className="password-buttons">
                <button 
                  className="password-submit-button"
                  onClick={handlePasswordSubmit}
                >
                  확인
                </button>
                <button 
                  className="password-cancel-button"
                  onClick={handlePasswordCancel}
                >
                  취소
                </button>
              </div>
            </div>
          )}
          
          {/* 다음 대사로 넘어가는 화살표 (선택지가 없고 비밀번호 입력이 아닐 때만) */}
          {!hasChoices && !showPasswordInput && (
            <div className="next-arrow" onClick={handleNext}>
              ▼
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
