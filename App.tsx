
import React, { useState, useCallback } from 'react';
import { ItemCard } from './components/ItemCard';
import { PlusIcon, RefreshIcon } from './components/icons';
import type { Item } from './types';

const App: React.FC = () => {
  const createNewItem = (): Item => ({
    id: crypto.randomUUID(),
    name: '',
    price: '',
    weight: '',
    unitPrice: null,
  });

  const [items, setItems] = useState<Item[]>([createNewItem()]);
  const [bestDealId, setBestDealId] = useState<string | null>(null);

  const recalculateAndSetState = useCallback((currentItems: Item[]) => {
    let minUnitPrice = Infinity;
    let newBestDealId: string | null = null;

    const calculatedItems = currentItems.map(item => {
      const price = parseFloat(String(item.price));
      const weight = parseFloat(String(item.weight));

      if (!isNaN(price) && price > 0 && !isNaN(weight) && weight > 0) {
        const unitPrice = price / weight;
        if (unitPrice < minUnitPrice) {
          minUnitPrice = unitPrice;
        }
        return { ...item, unitPrice };
      }
      return { ...item, unitPrice: null };
    });

    if (minUnitPrice !== Infinity) {
      const bestItem = calculatedItems.find(item => item.unitPrice === minUnitPrice);
      if (bestItem) {
        newBestDealId = bestItem.id;
      }
    }
    
    setItems(calculatedItems);
    setBestDealId(newBestDealId);
  }, []);

  const handleUpdateItem = useCallback((id: string, field: keyof Item, value: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    recalculateAndSetState(newItems);
  }, [items, recalculateAndSetState]);

  const handleAddItem = useCallback(() => {
    const newItems = [...items, createNewItem()];
    recalculateAndSetState(newItems);
  }, [items, recalculateAndSetState]);

  const handleRemoveItem = useCallback((id: string) => {
    if (items.length > 1) {
      const newItems = items.filter(item => item.id !== id);
      recalculateAndSetState(newItems);
    } else {
      handleReset();
    }
  }, [items, recalculateAndSetState]);

  const handleReset = useCallback(() => {
    const newItems = [createNewItem()];
    recalculateAndSetState(newItems);
  }, [recalculateAndSetState]);
  

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-surface shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
            グラム単価 比較ツール
          </h1>
          <button
            onClick={handleReset}
            className="p-2 rounded-full text-gray-400 hover:bg-secondary hover:text-white transition-colors duration-200"
            aria-label="リセット"
          >
            <RefreshIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              itemNumber={index + 1}
              isBestDeal={item.id === bestDealId && item.unitPrice !== null}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <PlusIcon className="w-6 h-6" />
            <span>商品を追加</span>
          </button>
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; 2024 Unit Price Calculator</p>
      </footer>
    </div>
  );
};

export default App;
