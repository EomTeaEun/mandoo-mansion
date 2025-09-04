import { useState, useEffect } from 'react';
import useCharacterMovement from './useCharacterMovement';
import useRandomInterval from './useRandomInterval';
import DialogueBox from './DialogueBox';
import Inventory from './Inventory';
import DodgeGame from './DodgeGame';
import { dialogues, choiceDialogues } from './dialogues';
import { useGameStore } from './store';
import startImg from './assets/start.png';
import livingroomImg from './assets/livingroom.png';
import kitchenImg from './assets/kitchen.png';
import corridorImg from './assets/corridor.png';
import toiletImg from './assets/toilet.png';
import bedroomImg from './assets/bedroom.png';
import cellarImg from './assets/cellar.png';
import goolbeaImg from './assets/goolbea.png';
import escapeImg from './assets/escape.png';
import happyEndingImg from './assets/happyending2.png';
import badEndingImg from './assets/badending.jpeg';
import charFrontImg from './assets/char_front.png';
import charBackImg from './assets/char_back.png';
import charLeftImg from './assets/char_left.png';
import charRightImg from './assets/char_right.png';
import mandooImg from './assets/mandoo.png';
import './Game.css';

const Game = () => {
  // 게임 상태 관리
  const [gameState, setGameState] = useState('start'); // 'start' 또는 'playing'
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // 맵 상태 관리
  const [currentMap, setCurrentMap] = useState('livingroom');
  
  // 맵 전환 효과 상태
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 대화창 상태 관리
  const [dialogueData, setDialogueData] = useState(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState(false);
  
  // 인벤토리 상태 관리
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  
  // 미니게임 상태 관리
  const [isDodgeGameVisible, setIsDodgeGameVisible] = useState(false);
  
  // 엔딩 상태 관리
  const [currentEnding, setCurrentEnding] = useState(null); // 'escape', 'bad', 'happy'
  const [showEndingPage, setShowEndingPage] = useState(false);
  
  // 안경만두 상태 관리
  const [mandooPosition, setMandooPosition] = useState({ x: 0, y: 0 });
  const [isMandooVisible, setIsMandooVisible] = useState(false);
  const [mandooTarget, setMandooTarget] = useState({ x: 0, y: 0 });
  const [mandooTimer, setMandooTimer] = useState(null);
  const [isMandooSpawning, setIsMandooSpawning] = useState(false); // 스폰 중복 방지용
  
  // 게임 스토어 사용
  const { addItem, hasItem, setGameFlag } = useGameStore();
  
  // 캐릭터 상태 관리 - 게임 화면 중앙에서 시작
  const [position, setPosition] = useState({ x: 400, y: 250 });
  const [direction, setDirection] = useState('front');

  // 맵별 캐릭터 시작 위치
  const mapStartPositions = {
    livingroom: { x: 400, y: 250 },
    kitchen: { x: 100, y: 250 },
    corridor: { x: 420, y: 460 }, // 복도로 이동했을 때 위치
    toilet: { x: 400, y: 250 },
    bedroom: { x: 400, y: 250 },
    cellar: { x: 550, y: 465 }
  };

  // 맵별 배경 이미지
  const mapImages = {
    livingroom: livingroomImg,
    kitchen: kitchenImg,
    corridor: corridorImg,
    toilet: toiletImg,
    bedroom: bedroomImg,
    cellar: cellarImg
  };

  // 맵 이동 함수 (부드러운 전환 효과 포함)
  const changeMap = (newMap) => {
    setIsTransitioning(true);
    
    // 맵 이동 시 안경만두 사라짐
    setIsMandooVisible(false);
    setIsMandooSpawning(false);
    if (mandooTimer) {
      clearTimeout(mandooTimer);
      setMandooTimer(null);
    }
    
    // 0.5초 후 맵 변경
    setTimeout(() => {
      setCurrentMap(newMap);
      setPosition(mapStartPositions[newMap]);
      setIsTransitioning(false);
      
      // 허용된 맵에서만 안경만두 재시작
      const allowedMaps = ['livingroom', 'toilet', 'kitchen', 'corridor', 'bedroom'];
      if (allowedMaps.includes(newMap)) {
        scheduleNextMandoo();
      }
    }, 500);
  };

  // 이미지 프리로딩
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [
        startImg, livingroomImg, kitchenImg, corridorImg, 
        toiletImg, bedroomImg, cellarImg, goolbeaImg, 
        escapeImg, happyEndingImg, badEndingImg,
        charFrontImg, charBackImg, charLeftImg, charRightImg, mandooImg
      ];
      
      let loadedCount = 0;
      const totalImages = imageUrls.length;
      
      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.src = url;
      });
    };
    
    preloadImages();
  }, []);


  // 맵 이동 감지 및 처리
  useEffect(() => {
    if (gameState !== 'playing') return;

    // 디버깅을 위한 로그
    console.log(`현재 맵: ${currentMap}, 위치: X:${position.x}, Y:${position.y}`);

    // 거실 -> 부엌 이동
    if (currentMap === 'livingroom' && position.x > 1150) {
      console.log('거실 → 부엌으로 이동!');
      changeMap('kitchen');
    }
    
    // 거실 -> 복도 이동 (계단 위쪽으로) - 조건을 더 넓게
    if (currentMap === 'livingroom' && 
        position.x >= 500 && position.x <= 1320 && 
        position.y <= 150) {
      console.log('거실 → 복도로 이동!');
      changeMap('corridor');
    }
    
    //-----이동 코드-----
    // 복도 -> 화장실 이동
    if (currentMap === 'corridor' && 
        position.x >= 285 && position.x <= 440 && 
        position.y >= 220 && position.y <= 310) {
      console.log('복도 → 화장실로 이동!');
      changeMap('toilet');
    }
    
    // 화장실 -> 복도 이동 (문을 통해)
    if (currentMap === 'toilet' && 
        position.x >= 400 && position.x <= 600 && 
        position.y >= 600) {
      console.log('화장실 → 복도로 이동!');
      changeMap('corridor');
    }
    
    // 복도 -> 침실 이동
    if (currentMap === 'corridor' && 
        position.x >= 675 && position.x <= 810 && 
        position.y >= 220 && position.y <= 310) {
      console.log('복도 → 침실로 이동!');
      changeMap('bedroom');
    }
    
    // 침실 -> 복도 이동 (새로 추가)
    if (currentMap === 'bedroom' && 
        position.x >= 340 && position.x <= 550 && 
        position.y >= 600 && position.y <= 700) {
      console.log('침실 → 복도로 이동!');
      changeMap('corridor');
    }
    
    // 침실 -> 지하실 이동 (새로 추가)
    if (currentMap === 'bedroom' && 
        position.x >= 80 && position.x <= 190 && 
        position.y >= 10 && position.y <= 80) {
      console.log('침실 → 지하실로 이동!');
      changeMap('cellar');
    }
    
    // 부엌 -> 거실 이동 (왼쪽 끝으로)
    if (currentMap === 'kitchen' && position.x <= 50) {
      console.log('부엌 → 거실로 이동!');
      changeMap('livingroom');
    }
    
    // 복도 -> 거실 이동 (계단 아래로)
    if (currentMap === 'corridor' && 
        position.x >= 500 && position.x <= 1320 && 
        position.y >= 500) {
      console.log('복도 → 거실로 이동!');
      changeMap('livingroom');
    }
  }, [position, currentMap, gameState]);

  // 커스텀 훅 사용 (게임 중일 때만)
  useCharacterMovement(position, setPosition, setDirection, gameState === 'playing', currentMap);
  
  // 키보드 이벤트 처리 (인벤토리 열기)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState === 'playing' && event.key === 'E' || event.key === 'e') {
        setIsInventoryVisible(true);
      }
      if (event.key === 'Escape') {
        setIsInventoryVisible(false);
        setIsDialogueVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // 방향에 따른 캐릭터 이미지 선택
  const getCharacterImage = () => {
    switch (direction) {
      case 'front':
        return charFrontImg;
      case 'back':
        return charBackImg;
      case 'left':
        return charLeftImg;
      case 'right':
        return charRightImg;
      default:
        return charFrontImg;
    }
  };

  // 안경만두 출현 함수
  const spawnMandoo = () => {
    // 허용된 맵에서만 출현
    const allowedMaps = ['livingroom', 'toilet', 'kitchen', 'corridor', 'bedroom'];
    
    if (gameState !== 'playing' || isDodgeGameVisible || showEndingPage || !allowedMaps.includes(currentMap)) {
      return;
    }
    
    // 이미 만두가 보이거나 스폰 중인 상태라면 출현하지 않음
    if (isMandooVisible || isMandooSpawning) {
      return;
    }
    
    // 스폰 시작 표시
    setIsMandooSpawning(true);
    
    // 50,50 - 1000,1000 범위에서 랜덤 출현
    const x = Math.random() * (1000 - 50) + 50;
    const y = Math.random() * (1000 - 50) + 50;
    
    setMandooPosition({ x, y });
    setMandooTarget({ x: position.x, y: position.y });
    setIsMandooVisible(true);
    
    // 10초 후 안경만두 사라짐
    setTimeout(() => {
      setIsMandooVisible(false);
      setIsMandooSpawning(false);
    }, 10000);
  };

  // 다음 안경만두 출현 스케줄링
  const scheduleNextMandoo = () => {
    if (mandooTimer) {
      clearTimeout(mandooTimer);
    }
    
    const delay = Math.random() * (20000 - 15000) + 15000; // 15-20초 랜덤
    
    const timer = setTimeout(() => {
      spawnMandoo();
      scheduleNextMandoo(); // 다음 출현 스케줄링
    }, delay);
    
    setMandooTimer(timer);
  };

  // 안경만두 이동 및 충돌 감지
  useEffect(() => {
    if (!isMandooVisible) return;

    const moveInterval = setInterval(() => {
      setMandooPosition(prevPos => {
        // 플레이어 위치를 목표로 천천히 이동
        const dx = mandooTarget.x - prevPos.x;
        const dy = mandooTarget.y - prevPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) return prevPos; // 목표에 도달했으면 정지
        
        const speed = 7; // 속도 7로 설정
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;
        
        const newPos = {
          x: Math.max(50, Math.min(1030, prevPos.x + moveX)), // 50-1030 범위 제한
          y: Math.max(190, Math.min(550, prevPos.y + moveY))  // 190-550 범위 제한
        };
        
        // 충돌 감지
        const playerRect = {
          left: position.x,
          right: position.x + 40,
          top: position.y,
          bottom: position.y + 40
        };
        
        const mandooRect = {
          left: newPos.x,
          right: newPos.x + 80,
          top: newPos.y,
          bottom: newPos.y + 80
        };
        
        // 충돌 체크
        if (playerRect.left < mandooRect.right &&
            playerRect.right > mandooRect.left &&
            playerRect.top < mandooRect.bottom &&
            playerRect.bottom > mandooRect.top) {
          // 충돌 발생 - 배드엔딩 페이지로 이동 후 대화창 표시
          setIsMandooVisible(false);
          setIsMandooSpawning(false);
          setCurrentEnding('bad');
          setShowEndingPage(true);
          
          // 배드엔딩 페이지에서 대화창 표시
          setTimeout(() => {
            setDialogueData({
              lines: [
                '안경만두에게 잡혀 만두소가 되어버렸다...',
                '게임 오버...',
                '페이지를 새로고침 하여 다시 하세요.'
              ]
            });
            setIsDialogueVisible(true);
          }, 100); // 배드엔딩 페이지가 렌더링된 후 대화창 표시
          
          return prevPos;
        }
        
        return newPos;
      });
    }, 50); // 50ms마다 이동

    return () => clearInterval(moveInterval);
  }, [isMandooVisible, mandooTarget, position]);


  // 게임 시작 함수
  const startGame = () => {
    setGameState('playing');
    setCurrentMap('livingroom');
    setPosition(mapStartPositions.livingroom);
    
    // 게임 시작 시 자동으로 대사 표시
    setDialogueData({
      lines: [
        '으윽 여기가 어디지..',
        '분명 달콩이와 함께 자고 있었는데..',
        '이 만두냄새 나는 저택은 뭐지?',
        '조금 돌아다녀 볼까..?',
        '게임룰',
        '랜덤으로 출현하는 안경만두를 피해 저택을 탈출하라.',
        '반드시 꼼꼼히 살펴 볼 것!'
      ],
      onComplete: () => {
        // 대사가 모두 끝난 후 3초 뒤에 안경만두 등장
        setTimeout(() => {
          spawnMandoo();
          scheduleNextMandoo(); // 이후 20-30초 랜덤 출현
        }, 3000);
      }
    });
    setIsDialogueVisible(true);
  };

  // 상호작용 영역 클릭 핸들러
  const handleInteraction = (areaName) => {
    console.log(`${areaName}와 상호작용!`);
    
    // 특별한 상호작용 처리
    if (areaName === '거실 책장') {
      handleBookshelfInteraction();
      return;
    }
    
    if (areaName === '거실 수납장') {
      handleStorageInteraction();
      return;
    }
    
    if (areaName === '지하실 구울비') {
      handleGoolbiInteraction();
      return;
    }
    
    if (areaName === '침실 지하실 통로') {
      handleCellarPassageInteraction();
      return;
    }
    
    if (areaName === '부엌 찬장') {
      handleKitchenCabinetInteraction();
      return;
    }
    
    // 일반 대화 데이터 찾기
    let dialogue = null;
    
    // 일반 대화에서 찾기
    if (dialogues[currentMap]) {
      // 한국어 이름을 영어 키로 변환
      const areaKey = getAreaKey(areaName);
      if (areaKey && dialogues[currentMap][areaKey]) {
        dialogue = dialogues[currentMap][areaKey];
      }
    }
    
    // 선택지 대화에서 찾기
    if (!dialogue && choiceDialogues[currentMap]) {
      const areaKey = getAreaKey(areaName);
      if (areaKey && choiceDialogues[currentMap][areaKey]) {
        dialogue = choiceDialogues[currentMap][areaKey];
      }
    }
    
    if (dialogue) {
      setDialogueData(dialogue);
      setIsDialogueVisible(true);
    } else {
      // 기본 대화가 없으면 간단한 메시지 표시
      setDialogueData({
        lines: [`${areaName}를 조사했다.`, '특별한 것은 보이지 않는다.']
      });
      setIsDialogueVisible(true);
    }
  };
  
  // 책장 상호작용 처리
  const handleBookshelfInteraction = () => {
    // 부엌 찬장 열쇠 획득
    const kitchenKey = {
      id: 'kitchen_key',
      name: '찬장 열쇠',
      description: '부엌 찬장을 열 수 있는 열쇠다.',
      type: 'key'
    };
    
    addItem(kitchenKey);
    setDialogueData({
      lines: [
        '책장을 조사했다.',
        '책 사이에 무언가 끼어있다.',
        '찬장 열쇠를 발견했다!'
      ]
    });
    setIsDialogueVisible(true);
  };
  
  // 찬장 상호작용 처리
  const handleStorageInteraction = () => {
    if (hasItem('storage_key')) {
      // 열쇠가 있으면 선택지 표시
      setDialogueData({
        lines: [
          '찬장을 확인했다.',
          '잠겨있다.',
          '찬장 열쇠를 사용하시겠습니까?'
        ],
        choices: [
          { text: '예', action: 'use_storage_key' },
          { text: '아니오', action: 'close_dialogue' }
        ]
      });
    } else {
      // 열쇠가 없으면 잠겨있다는 메시지
      setDialogueData({
        lines: [
          '찬장을 확인했다.',
          '잠겨있다.',
          '열쇠가 필요하다.'
        ]
      });
    }
    setIsDialogueVisible(true);
  };
  
  // 한국어 이름을 영어 키로 변환하는 함수
  const getAreaKey = (areaName) => {
    const areaMap = {
      '거실 책장': 'bookshelf',
      '거실 수납장': 'storage',
      '거실 계단': 'stairs',
      '거실 양탄자': 'carpet',
      '거실 화분': 'plant',
      '거실 문': 'door',
      '부엌 조리대': 'stove',
      '부엌 찬장': 'cabinet',
      '부엌 냉장고': 'refrigerator',
      '복도 벽': 'painting',
      '화장실 세면대': 'sink',
      '화장실 욕조': 'bathtub',
      '침실 침대': 'bed',
      '침실 비밀번호 패널': 'secretPanel',
      '침실 지하실 통로': 'cellarPassage',
      '지하실 구울비': 'goolbea'
    };
    return areaMap[areaName];
  };
  
  // 대화창 닫기
  const closeDialogue = () => {
    setIsDialogueVisible(false);
    setDialogueData(null);
  };
  
  // 굴비 상호작용 처리
  const handleGoolbiInteraction = () => {
    setDialogueData({
      lines: [
        '지하실 가운데에 무언가가 있다.',
        '구울비가 서 있다.',
        '구울비가 말을 건다: "제법이네... 여기까지 왔구나..."',
        '구울비: "그렇다면 나와 매력도 대결을 해서 이겨봐라!"',
        '구울비: "쉽지 않을걸!"'
      ],
      onComplete: () => {
        // 대화가 끝나면 미니게임 시작
        setIsDodgeGameVisible(true);
      }
    });
    setIsDialogueVisible(true);
  };

  // 미니게임 성공 처리 (엔딩 시스템)
  const handleDodgeGameSuccess = () => {
    setIsDodgeGameVisible(false);
    setGameFlag('goolbiDefeated', true);
    
    // 첫 번째 대사: 매력 대결 승리 + 굴비의 반응
    setDialogueData({
      lines: [
        '🎉 매력 대결 승리!',
        '구울비: "와... 정말 대단하네! 반할 것 같아!!"',
        '구울비: "크윽... 갑자기 머리가..." (*굴비의 안경이 벗겨진다)',
        '구울비: "네 덕에 빨간 안경의 세뇌에서 벗어날 수 있었어..."',
        '구울비: "나도 너와 같이 탈출하겠어 !!"',
        '구울비: "안경만두가 다시 오기 전에 빨리 이 망할 맨션에서 나가자!"',
        '구울비: "날 따라오면 비밀통로가 나와!"'
      ],
      onComplete: () => {
        // escape 이미지로 전환
        setCurrentEnding('escape');
        setShowEndingPage(true);
        // 2.3초 후 happy ending 페이지로 전환
        setTimeout(() => {
          setCurrentEnding('happy');
          setDialogueData({
            lines: [
              '*사건의 전말은 은행동에서 빨간 안경을 잘못 산 태은이와 한나가',
              '*안경만두에게 세뇌 당하여 가을이를 제물로 바친 것 이었다.',
              '*그렇게 굴비와 함께 맨션을 탈출한 가을은 즐거운 생일파티를 하였다.',
              '태은, 한나, 굴비 : 가을아 생일축하해!',
              '태은, 한나 : 널 제물로 바쳐서 미안미안~ 헤헤..',
              '자두 : 캬엉캬옹!',
              '(가을아 행복한 생일 보내~)',
              '(내년엔 더 잘 만들어줄게!! 완벽한 만두 맨션으로..ㅋ)'
            ]
          });
          setIsDialogueVisible(true);
        }, 2400);
      }
    });
    setIsDialogueVisible(true);
  };

  // 미니게임 실패 처리 (새드 엔딩)
  const handleDodgeGameFailure = () => {
    setIsDodgeGameVisible(false);
    
    // 패배 대사: 굴비의 승리 + 새드 엔딩
    setDialogueData({
      lines: [
        '💥 총알에 맞았다!',
        '구울비: "하하하! 아직 부족해!"',
        '구울비: "내가 이겼다!"',
        '구울비: "이제 네가 안경만두님의 고기소가 될 차례야!"',
        '구울비: "영원히 이 맨션에서 나갈 수 없을 거야!"',
        '구울비: "하하하하하!!!"'
      ],
      onComplete: () => {
        // bad ending 페이지로 전환
        setCurrentEnding('bad');
        setShowEndingPage(true);
        setDialogueData({
          lines: [
            '게임 오버...',
            '페이지를 새로고침 하여 다시 하세요.'
          ]
        });
        setIsDialogueVisible(true);
      }
    });
    setIsDialogueVisible(true);
  };

  // 지하실 통로 상호작용 처리
  const handleCellarPassageInteraction = () => {
    if (hasItem('driver')) {
      // 드라이버가 있으면 선택지 표시
      setDialogueData({
        lines: [
          '지하실로 통하는 통로가 있다.',
          '드라이버가 필요해 보인다.',
          '드라이버를 사용하시겠습니까?'
        ],
        choices: [
          { text: '예', action: 'use_driver' },
          { text: '아니오', action: 'close_dialogue' }
        ]
      });
    } else {
      // 드라이버가 없으면 필요하다는 메시지
      setDialogueData({
        lines: [
          '지하실로 통하는 통로가 있다.',
          '드라이버가 필요해 보인다.',
          '드라이버를 찾아야 한다.'
        ]
      });
    }
    setIsDialogueVisible(true);
  };

  // 부엌 찬장 상호작용 처리
  const handleKitchenCabinetInteraction = () => {
    if (hasItem('kitchen_key')) {
      // 찬장 열쇠가 있으면 선택지 표시
      setDialogueData({
        lines: [
          '부엌 찬장이다.',
          '찬장 열쇠를 사용하시겠습니까?'
        ],
        choices: [
          { text: '예', action: 'use_kitchen_key' },
          { text: '아니오', action: 'close_dialogue' }
        ]
      });
    } else {
      // 찬장 열쇠가 없으면 잠겨있다는 메시지
      setDialogueData({
        lines: [
          '부엌 찬장이다.',
          '잠겨있다. 열쇠가 필요하다.'
        ]
      });
    }
    setIsDialogueVisible(true);
  };

  // 선택지 처리
  const handleChoice = (choice) => {
    console.log('선택지 선택:', choice);
    
    if (choice.action === 'use_storage_key') {
      // 찬장 열쇠 사용
      const { useItem } = useGameStore.getState();
      useItem('storage_key');
      setGameFlag('storageUnlocked', true);
      
      // 찬장이 열린 후의 대화
      setDialogueData({
        lines: [
          '열쇠를 사용했다.',
          '찬장이 열렸다!',
          '안에서 중요한 문서를 발견했다.'
        ]
      });
      setIsDialogueVisible(true);
    } else if (choice.action === 'use_kitchen_key') {
      // 부엌 찬장 열쇠 사용
      const { useItem } = useGameStore.getState();
      useItem('kitchen_key');
      setGameFlag('kitchenUnlocked', true);
      
      // 찬장이 열린 후의 대화
      setDialogueData({
        lines: [
          '찬장 열쇠를 사용했다.',
          '찬장을 열어보았더니 레시피책이 있다.',
          '"고기만두 비법재료 : 신선한 인육 4근?, 콩나물 100g, 고추장 1큰술, 대파 1대, 마늘 1큰술, 간장 1큰술, 설탕 1큰술, 참기름 1큰술"',
          '...(*책을 덮었다.)'
        ]
      });
      setIsDialogueVisible(true);
    } else if (choice.action === 'enter_password_486') {
      // 비밀번호 486 입력
      const driver = {
        id: 'driver',
        name: '드라이버',
        description: '지하실 통로를 열 수 있는 드라이버다.',
        type: 'tool'
      };
      
      addItem(driver);
      setDialogueData({
        lines: [
          '비밀번호가 맞다!',
          '패널이 열렸다.',
          '드라이버를 발견했다!'
        ]
      });
      setIsDialogueVisible(true);
    } else if (choice.action === 'enter_wrong_password') {
      // 잘못된 비밀번호
      setDialogueData({
        lines: [
          '이 비밀번호가 아닌 것 같다..'
        ]
      });
      setIsDialogueVisible(true);
    } else if (choice.action === 'use_driver') {
      // 드라이버 사용
      const { useItem } = useGameStore.getState();
      useItem('driver');
      setGameFlag('cellarUnlocked', true);
      
      // 지하실로 이동
      setDialogueData({
        lines: [
          '드라이버를 사용했다.',
          '통로가 열렸다!',
          '지하실로 갈 수 있다.'
        ],
        onComplete: () => {
          changeMap('cellar');
        }
      });
      setIsDialogueVisible(true);
    } else if (choice.action === 'close_dialogue') {
      closeDialogue();
    }
  };

  // 시작 화면
  if (gameState === 'start') {
    return (
      <div className="game-container start-screen">
        <div 
          className="start-background"
          style={{ backgroundImage: `url(${startImg})` }}
        >
          <div className="start-overlay">
            {!imagesLoaded ? (
              <div className="loading-screen">
                <div className="loading-text">이미지 로딩 중...</div>
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <button className="start-button" onClick={startGame}>
                🎮 게임 시작하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div className={`game-container playing-screen ${showEndingPage ? 'ending-active' : ''}`}>
      {/* 맵 전환 효과 */}
      {isTransitioning && (
        <div className="map-transition-overlay">
        </div>
      )}
      
      {/* 엔딩 페이지 */}
      {showEndingPage && currentEnding === 'escape' && (
        <div className="ending-page">
          <img src={escapeImg} alt="Escape" className="ending-fullscreen-image" />
        </div>
      )}
      
      {showEndingPage && currentEnding === 'happy' && (
        <div className="ending-page">
          <img src={happyEndingImg} alt="Happy Ending" className="ending-fullscreen-image" />
        </div>
      )}
      
      {showEndingPage && currentEnding === 'bad' && (
        <div className="ending-page">
          <img src={badEndingImg} alt="Bad Ending" className="ending-fullscreen-image" />
        </div>
      )}
      
      {/* 게임 배경 */}
      <div 
        className="game-background"
        style={{ backgroundImage: `url(${mapImages[currentMap]})` }}
      >
        {/* 캐릭터 */}
        <div 
          className="character"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <img 
            src={getCharacterImage()} 
            alt="캐릭터"
            className="character-sprite"
          />
        </div>

        {/* 안경만두 */}
        {isMandooVisible && (
          <div 
            className="mandoo"
            style={{
              left: `${mandooPosition.x}px`,
              top: `${mandooPosition.y}px`,
            }}
          >
            <img 
              src={mandooImg} 
              alt="안경만두"
              className="mandoo-sprite"
            />
          </div>
        )}

        {/* 상호작용 영역들 */}
        {currentMap === 'livingroom' && (
          <>
            {/* 거실 책장 */}
            <div 
              className="interaction-area bookshelf"
              style={{
                left: '385px',
                top: '80px',
                width: '135px',
                height: '170px'
              }}
              onClick={() => handleInteraction('거실 책장')}
            />

            {/* 거실 계단 */}
            <div 
              className="interaction-area stairs"
              style={{
                left: '1200px',
                top: '50px',
                width: '120px',
                height: '200px'
              }}
              onClick={() => handleInteraction('거실 계단')}
            />

            {/* 거실 양탄자 */}
            <div 
              className="interaction-area carpet"
              style={{
                left: '140px',
                top: '345px',
                width: '305px',
                height: '210px'
              }}
              onClick={() => handleInteraction('거실 양탄자')}
            />
            {/* 거실 화분 */}
            <div 
              className="interaction-area plant"
              style={{
                left: '475px',
                top: '365px',
                width: '60px',
                height: '135px'
              }}
              onClick={() => handleInteraction('거실 화분')}
            />
            {/* 거실 문 */}
            <div 
              className="interaction-area door"
              style={{
                left: '1300px',
                top: '300px',
                width: '80px',
                height: '150px'
              }}
              onClick={() => handleInteraction('거실 문')}
            />
          </>
        )}

        {currentMap === 'kitchen' && (
          <>
            {/* 부엌 상호작용 영역들 */}
            <div 
              className="interaction-area kitchen-counter"
              style={{
                left: '390px',
                top: '260px',
                width: '401px',
                height: '80px'
              }}
              onClick={() => handleInteraction('부엌 조리대')}
            />
            {/* 부엌 찬장 */}
            <div 
              className="interaction-area kitchen-cabinet"
              style={{
                left: '160px',
                top: '120px',
                width: '180px',
                height: '250px'
              }}
              onClick={() => handleInteraction('부엌 찬장')}
            />
            {/* 부엌 냉장고 */}
            <div 
              className="interaction-area refrigerator"
              style={{
                left: '850px',
                top: '180px',
                width: '150px',
                height: '250px'
              }}
              onClick={() => handleInteraction('부엌 냉장고')}
            />
          </>
        )}

        {currentMap === 'corridor' && (
          <>
            {/* 복도 상호작용 영역들 */}
            {/* 복도 벽 상호작용 영역 제거 */}
          </>
        )}

        {currentMap === 'toilet' && (
          <>
            {/* 화장실 상호작용 영역들 */}
            <div 
              className="interaction-area toilet-sink"
              style={{
                left: '270px',
                top: '230px',
                width: '100px',
                height: '80px'
              }}
              onClick={() => handleInteraction('화장실 세면대')}
            />
            {/* 화장실 욕조 */}
            <div 
              className="interaction-area bathtub"
              style={{
                left: '530px',
                top: '290px',
                width: '400px',
                height: '150px'
              }}
              onClick={() => handleInteraction('화장실 욕조')}
            />
          </>
        )}

        {currentMap === 'bedroom' && (
          <>
            {/* 침실 상호작용 영역들 */}
            <div 
              className="interaction-area bed"
              style={{
                left: '300px',
                top: '280px',
                width: '180px',
                height: '150px'
              }}
              onClick={() => handleInteraction('침실 침대')}
            />
            {/* 비밀번호 입력 패널 */}
            <div 
              className="interaction-area secret-panel"
              style={{
                left: '675px',
                top: '180px',
                width: '145px',
                height: '120px'
              }}
              onClick={() => handleInteraction('침실 비밀번호 패널')}
            />
            {/* 침실 지하실 통로 (이동됨) */}
            <div 
              className="interaction-area cellar-passage"
              style={{
                left: '270px',
                top: '50px',
                width: '110px',
                height: '70px'
              }}
              onClick={() => handleCellarPassageInteraction()}
            />
          </>
        )}

        {currentMap === 'cellar' && (
          <>
            {/* 지하실 상호작용 영역들 */}
            <div 
              className="interaction-area cellar-passage"
              style={{
                left: '200px',
                top: '200px',
                width: '150px',
                height: '100px'
              }}
              onClick={() => handleInteraction('지하실 통로')}
            />
            {/* 지하실에서 침실로 돌아가는 통로 */}
            <div 
              className="interaction-area bedroom-passage"
              style={{
                left: '80px',
                top: '10px',
                width: '110px',
                height: '70px'
              }}
              onClick={() => {
                console.log('침실로 돌아가는 통로 클릭!');
                changeMap('bedroom');
              }}
            />
            {/* 지하실 가운데 아래쪽 goolbea */}
            <div 
              className="interaction-area goolbea"
              style={{
                left: '300px',
                top: '350px',
                width: '200px',
                height: '150px'
              }}
              onClick={() => handleInteraction('지하실 구울비')}
            >
              <img 
                src={goolbeaImg} 
                alt="굴비" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* 대화창 */}
      <DialogueBox
        dialogue={dialogueData}
        isVisible={isDialogueVisible}
        onClose={closeDialogue}
        onChoice={handleChoice}
        onComplete={dialogueData?.onComplete}
        currentMap={currentMap}
        showEndingPage={showEndingPage}
      />
      
      {/* 인벤토리 */}
      <Inventory
        isVisible={isInventoryVisible}
        onClose={() => setIsInventoryVisible(false)}
      />
      
      {/* 총알 피하기 미니게임 */}
      <DodgeGame
        isVisible={isDodgeGameVisible}
        onSuccess={handleDodgeGameSuccess}
        onFailure={handleDodgeGameFailure}
      />
      
      {/* 좌표 표시 (오른쪽 모서리) */}
      <div className="coordinates-display">
        X: {position.x}, Y: {position.y}
      </div>
    </div>
  );
};

export default Game;
