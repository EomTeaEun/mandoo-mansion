import React from 'react';
import { useGameStore } from './store';
import './Inventory.css';

const Inventory = ({ isVisible, onClose }) => {
  const { inventory } = useGameStore();

  if (!isVisible) return null;

  const getItemIcon = (type) => {
    switch (type) {
      case 'key':
        return '🔑';
      case 'tool':
        return '🔧';
      case 'document':
        return '📄';
      case 'special':
        return '✨';
      default:
        return '📦';
    }
  };

  return (
    <div className="inventory-overlay" onClick={onClose}>
      <div className="inventory-window" onClick={(e) => e.stopPropagation()}>
        <div className="inventory-header">
          <h2>🎒 인벤토리</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="inventory-content">
          {inventory.length === 0 ? (
            <div className="empty-inventory">
              <p>인벤토리가 비어있습니다.</p>
              <p>게임을 진행하며 아이템을 수집해보세요!</p>
            </div>
          ) : (
            <div className="inventory-grid">
              {inventory.map((item) => (
                <div key={item.id} className="inventory-item">
                  <div className="item-icon">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="inventory-footer">
          <p>ESC 키 또는 창 밖을 클릭하여 닫기</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
