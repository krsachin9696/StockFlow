import { useState, useCallback } from 'react';
import { orderApi } from '../api/orderApi';

/**
 * useOrders — Custom hook managing order state, CRUD, and client-side sorting.
 */
const useOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders.');
    } finally { setLoading(false); }
  }, []);

  const addOrder = useCallback(async (customerName, stockId, orderQty) => {
    const order = await orderApi.create(customerName, stockId, orderQty);
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const deleteOrder = useCallback(async (id) => {
    await orderApi.remove(id);
    setOrders((prev) => prev.filter((o) => o._id !== id));
  }, []);

  // Client-side sorting
  const requestSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
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
    orders: sortedOrders,
    loading, error, sortConfig,
    fetchOrders, addOrder, deleteOrder, requestSort,
  };
};

export default useOrders;
