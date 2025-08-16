import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, SoldItem, ListingInfo } from '@/types';

interface UseInventoryReturn {
  inventoryItems: InventoryItem[];
  soldItems: SoldItem[];
  addToInventory: (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'status'>) => void;
  updateItem: (item: InventoryItem) => void;
  markAsListed: (itemId: string, listing: ListingInfo) => void;
  markAsSold: (itemId: string, soldPrice: number, platform: string, buyerNotes?: string) => void;
  deleteItem: (itemId: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  getTotalInventoryValue: () => number;
  getTotalProfit: () => number;
}

/**
 * Custom hook for managing inventory items
 * Persists data to localStorage for persistence
 */
export const useInventory = (): UseInventoryReturn => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem('fliplab-inventory');
      const savedSoldItems = localStorage.getItem('fliplab-sold-items');
      
      if (savedInventory) {
        setInventoryItems(JSON.parse(savedInventory));
      }
      
      if (savedSoldItems) {
        setSoldItems(JSON.parse(savedSoldItems));
      }
    } catch (error) {
      console.error('Failed to load inventory from localStorage:', error);
    }
  }, []);

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('fliplab-inventory', JSON.stringify(inventoryItems));
    } catch (error) {
      console.error('Failed to save inventory to localStorage:', error);
    }
  }, [inventoryItems]);

  // Save sold items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fliplab-sold-items', JSON.stringify(soldItems));
    } catch (error) {
      console.error('Failed to save sold items to localStorage:', error);
    }
  }, [soldItems]);

  const addToInventory = useCallback((item: Omit<InventoryItem, 'id' | 'dateAdded' | 'status'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      status: 'inventory',
      listings: []
    };
    
    setInventoryItems(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((updatedItem: InventoryItem) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  }, []);

  const markAsListed = useCallback((itemId: string, listing: ListingInfo) => {
    const newListing: ListingInfo = {
      ...listing,
      id: generateId(),
      dateListed: new Date().toISOString(),
      status: 'active'
    };

    setInventoryItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: 'listed',
            listings: [...(item.listings || []), newListing]
          };
        }
        return item;
      })
    );
  }, []);

  const markAsSold = useCallback((itemId: string, soldPrice: number, platform: string, buyerNotes?: string) => {
    setInventoryItems(prev => {
      const itemToSell = prev.find(item => item.id === itemId);
      if (!itemToSell) return prev;

      const soldItem: SoldItem = {
        ...itemToSell,
        soldDate: new Date().toISOString(),
        soldPrice,
        actualProfit: soldPrice - itemToSell.userCost,
        platform,
        buyerNotes,
        status: 'sold'
      };

      // Remove from inventory and add to sold items
      setSoldItems(prevSold => [...prevSold, soldItem]);
      return prev.filter(item => item.id !== itemId);
    });
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const getItemById = useCallback((id: string) => {
    return inventoryItems.find(item => item.id === id);
  }, [inventoryItems]);

  const getTotalInventoryValue = useCallback(() => {
    return inventoryItems.reduce((total, item) => {
      return total + (item.suggestedListingPrice * item.quantity);
    }, 0);
  }, [inventoryItems]);

  const getTotalProfit = useCallback(() => {
    return soldItems.reduce((total, item) => total + item.actualProfit, 0);
  }, [soldItems]);

  return {
    inventoryItems,
    soldItems,
    addToInventory,
    updateItem,
    markAsListed,
    markAsSold,
    deleteItem,
    getItemById,
    getTotalInventoryValue,
    getTotalProfit
  };
};

/**
 * Generate a unique ID for inventory items
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
