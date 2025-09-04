// 게임의 모든 대화 데이터를 맵과 객체별로 정리
export const dialogues = {
  livingroom: {
    bookshelf: {
      lines: [
        '책장을 조사했다.',
        '책 사이에 무언가 끼어있다.',
        '부엌 열쇠를 발견했다!'
      ],
      item: 'kitchen_key'
    },
    storage: {
      lines: [
        ''
      ]
    },
    stairs: {
      lines: [
        '계단을 올라보았다.',
        '위층으로 올라갈 수 있다.'
      ]
    },
    carpet: {
      lines: [
        '탁자 위의 쪽지를 살펴보았다.',
        '"이 저택을 탈출해라!!"',
        '응..?'
      ]
    },
    plant: {
      lines: [
        '화분을 확인했다.',
        '잘 자란 식물이다.',
        '벌레가 8 마리나 있다..'
      ]
    },
    door: {
      lines: [
        '문을 확인했다.',
        '부엌으로 통하는 문이다.'
    
      ]
    }
  },
  kitchen: {
    stove: {
      lines: [
        '가스레인지를 확인했다.',
        '앗 뜨거!!!!',
        '주전자에 손을 데였다'
      ]
    },
    cabinet: {
      lines: [
        '부엌 찬장이다.',
        '잠겨있다. 열쇠가 필요하다.'
      ]
    },
    refrigerator: {
      lines: [
        '냉장고를 열어보았다.',
        '신선한 재료들이 가득하다.',
        '정말 맛있어 보이는 고기만두가 6개나 들어있다..'
      ]
    }
  },
  corridor: {
    stairs: {
      lines: [
        '계단을 올라보았다.',
        '위층으로 올라갈 수 있다.'
        
      ]
    },
    painting: {
      lines: [
        '벽에 걸린 그림을 살펴보았다.',
        '오래된 그림이다.'
        
      ]
    }
  },
  toilet: {
    mirror: {
      lines: [
        '거울을 보았다.',
        '자신의 모습이 비친다.'
      ]
    },
    sink: {
      lines: [
        '세면대를 확인했다.',
        '깨끗하게 정리되어 있다.'
      ]
    },
    bathtub: {
      lines: [
        '욕조이다.',
        '묘하게 만둣국 냄새가 난다..'
      ]
    }
  },
  bedroom: {
    bed: {
      lines: [
        '침대를 살펴보았다.',
        '편안해 보이는 침대다.'
      
      ]
    },
    closet: {
      lines: [
        '옷장을 열어보았다.',
        '옷들이 정리되어 있다.'
        
      ]
    },
    secretPanel: {
      lines: [
        '만두 모양의 상자다..',
        '숫자 입력기가 달려있다.',
        '비밀번호를 입력하세요.'
      ]
    }
  }
};

// 선택지가 포함된 대화 데이터 예시
export const choiceDialogues = {
  livingroom: {
    door: {
      lines: [
        '문이 잠겨있다.',
        '열쇠가 필요하다.',
        '부엌 열쇠를 사용하시겠습니까?'
      ],
      choices: [
        { text: '예', action: 'use_key', nextDialogue: 'livingroom_door_unlock' },
        { text: '아니오', action: 'close_dialogue' }
      ]
    },
    door_unlock: {
      lines: [
        '열쇠를 사용했다.',
        '문이 열렸다!',
        '부엌으로 들어갈 수 있다.'
      ]
    }
  },
  kitchen: {
    cabinet_unlocked: {
      lines: [
        '찬장을 열어보았더니 레시피책이 있다.',
        '"고기만두 비법재료 : 신선한 인육 4근?, 콩나물 100g, 고추장 1큰술, 대파 1대, 마늘 1큰술, 간장 1큰술, 설탕 1큰술, 참기름 1큰술"',
        '...(*책을 덮었다.)'
      ]
    }
  },
  bedroom: {
    password_correct: {
      lines: [
        '비밀번호가 맞다!',
        '패널이 열렸다.',
        '드라이버를 발견했다!'
      ],
      item: 'driver'
    },
    password_wrong: {
      lines: [
        '비밀번호가 틀렸다.',
        '다시 시도해보자.'
      ]
    },
    cellarPassage: {
      lines: [
        '지하실로 통하는 통로가 있다.',
        '드라이버가 필요해 보인다.',
        '드라이버를 사용하시겠습니까?'
      ],
      choices: [
        { text: '예', action: 'use_driver' },
        { text: '아니오', action: 'close_dialogue' }
      ]
    },
    driver_used: {
      lines: [
        '드라이버를 사용했다.',
        '통로가 열렸다!',
        '지하실로 갈 수 있다.'
      ]
    }
  }
};
