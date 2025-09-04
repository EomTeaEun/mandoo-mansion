import { useEffect, useRef } from 'react';

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutRef = useRef();
  const callbackRef = useRef(callback);

  // callback이 변경될 때마다 ref 업데이트
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const setRandomTimeout = () => {
      // minDelay와 maxDelay 사이의 랜덤한 시간 계산
      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
        setRandomTimeout(); // 다음 랜덤 타이머 설정
      }, randomDelay);
    };

    setRandomTimeout();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minDelay, maxDelay]);

  // 타이머를 수동으로 정리할 수 있는 함수 반환
  const clearRandomInterval = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return clearRandomInterval;
};

export default useRandomInterval;
