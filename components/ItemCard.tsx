import React from 'react';
import type { Item } from '../types';
import { TrashIcon, CrownIcon } from './icons';

interface ItemCardProps {
  item: Item;
  itemNumber: number;
  isBestDeal: boolean;
  onUpdate: (id: string, field: keyof Item, value: string) => void;
  onRemove: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, itemNumber, isBestDeal, onUpdate, onRemove }) => {
  const handleInputChange = (field: keyof Item) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, field, e.target.value);
  };

  const formattedUnitPrice = item.unitPrice !== null
    ? `¥ ${item.unitPrice.toFixed(2)} /g`
    : '---';

  const cardBorderClass = isBestDeal
    ? 'border-best-deal ring-2 ring-best-deal/50'
    : 'border-secondary';

  return (
    <div className={`relative bg-surface rounded-xl shadow-lg border transition-all duration-300 ${cardBorderClass}`}>
      {isBestDeal && (
        <div className="absolute -top-3 -left-3 bg-best-deal text-background p-2 rounded-full shadow-lg transform rotate-[-15deg]">
          <CrownIcon className="w-6 h-6" />
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
           <input
              type="text"
              value={item.name}
              onChange={handleInputChange('name')}
              placeholder={`商品 ${itemNumber}`}
              aria-label={`商品 ${itemNumber} の品名`}
              className="flex-grow bg-transparent text-lg font-bold text-on-surface focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors duration-200 mr-2"
            />
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
            aria-label="商品を削除"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-300 mb-1">
              価格 (円)
            </label>
            <input
              id={`price-${item.id}`}
              type="number"
              value={item.price}
              onChange={handleInputChange('price')}
              placeholder="例: 1000"
              className="w-full bg-secondary border border-gray-600 rounded-md px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition"
              inputMode="decimal"
            />
          </div>
          <div>
            <label htmlFor={`weight-${item.id}`} className="block text-sm font-medium text-gray-300 mb-1">
              内容量 (g)
            </label>
            <input
              id={`weight-${item.id}`}
              type="number"
              value={item.weight}
              onChange={handleInputChange('weight')}
              placeholder="例: 250"
              className="w-full bg-secondary border border-gray-600 rounded-md px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>
      <div className="bg-secondary/50 rounded-b-xl px-5 py-4 mt-4">
        <p className="text-sm text-gray-400">グラム単価</p>
        <p className={`text-2xl font-bold transition-colors duration-300 ${isBestDeal ? 'text-best-deal' : 'text-on-surface'}`}>
          {formattedUnitPrice}
        </p>
      </div>
    </div>
  );
};
