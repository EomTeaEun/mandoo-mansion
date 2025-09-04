import { create } from 'zustand';

// 아이템 타입 정의
export const ITEM_TYPES = {
  KEY: 'key',
  TOOL: 'tool',
  DOCUMENT: 'document',
  SPECIAL: 'special'
};

// 게임 스토어
export const useGameStore = create((set, get) => ({
  // 인벤토리 아이템 목록
  inventory: [],
  
  // 게임 진행 상황 플래그
  gameFlags: {
    hasKitchenKey: false,
    hasStorageKey: false,
    storageUnlocked: false,
    kitchenUnlocked: false,
    goolbiDefeated: false,
    cellarUnlocked: false
  },
  
  // 아이템 추가
  addItem: (item) => {
    set((state) => ({
      inventory: [...state.inventory, item],
      gameFlags: {
        ...state.gameFlags,
        // 특정 아이템에 따른 플래그 업데이트
        ...(item.id === 'kitchen_key' && { hasKitchenKey: true }),
        ...(item.id === 'storage_key' && { hasStorageKey: true })
      }
    }));
    
    // 백엔드에 동기화
    fetch('http://127.0.0.1:8000/inventory/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item })
    }).catch(error => console.error('아이템 추가 동기화 실패:', error));
  },
  
  // 아이템 사용 (제거)
  useItem: (itemId) => {
    set((state) => {
      const item = state.inventory.find(item => item.id === itemId);
      const newInventory = state.inventory.filter(item => item.id !== itemId);
      
      // 아이템 사용에 따른 플래그 업데이트
      let newGameFlags = { ...state.gameFlags };
      if (itemId === 'kitchen_key') {
        newGameFlags.kitchenUnlocked = true;
        newGameFlags.hasKitchenKey = false;
      } else if (itemId === 'storage_key') {
        newGameFlags.storageUnlocked = true;
        newGameFlags.hasStorageKey = false;
      } else if (itemId === 'driver') {
        newGameFlags.cellarUnlocked = true;
      }
      
      return {
        inventory: newInventory,
        gameFlags: newGameFlags
      };
    });
    
    // 백엔드에 동기화
    fetch('http://127.0.0.1:8000/inventory/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId })
    }).catch(error => console.error('아이템 사용 동기화 실패:', error));
  },
  
  // 특정 아이템 보유 여부 확인
  hasItem: (itemId) => {
    return get().inventory.some(item => item.id === itemId);
  },
  
  // 게임 플래그 설정
  setGameFlag: (flagName, value) => {
    set((state) => ({
      gameFlags: {
        ...state.gameFlags,
        [flagName]: value
      }
    }));
  },
  
  // 백엔드에서 인벤토리 동기화
  syncInventoryFromBackend: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/inventory');
      const data = await response.json();
      
      set((state) => ({
        inventory: data.items || [],
        gameFlags: {
          ...state.gameFlags,
          hasKitchenKey: data.items?.some(item => item.id === 'kitchen_key') || false,
          hasStorageKey: data.items?.some(item => item.id === 'storage_key') || false
        }
      }));
    } catch (error) {
      console.error('인벤토리 동기화 실패:', error);
    }
  }
}));
