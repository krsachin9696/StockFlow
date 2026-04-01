import { useState, useCallback } from 'react';
import { stockApi } from '../api/stockApi';

/**
 * useStocks — Custom hook managing stock state, CRUD, and client-side sorting.
 */
const useStocks = () => {
  const [stocks,  setStocks]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const fetchStocks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await stockApi.getAll();
      setStocks(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load stocks.');
    } finally { setLoading(false); }
  }, []);

  const addStock = useCallback(async (name, qty) => {
    const stock = await stockApi.create(name, qty);
    setStocks((prev) => [stock, ...prev]);
    return stock;
  }, []);

  const deleteStock = useCallback(async (id) => {
    await stockApi.remove(id);
    setStocks((prev) => prev.filter((s) => s._id !== id));
  }, []);

  // Update a single stock's qty in state after order create/delete
  const updateStockInState = useCallback((updatedStock) => {
    setStocks((prev) =>
      prev.map((s) => (s._id === updatedStock._id ? updatedStock : s))
    );
  }, []);

  // Client-side sorting
  const requestSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedStocks = [...stocks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return {
    stocks: sortedStocks,
    rawStocks: stocks,
    loading, error, sortConfig,
    fetchStocks, addStock, deleteStock, updateStockInState, requestSort,
  };
};

export default useStocks;
