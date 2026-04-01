import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Snackbar, Alert, Tooltip, Chip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DevicesIcon from '@mui/icons-material/Devices';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StockTable from '../components/StockTable';
import OrderTable from '../components/OrderTable';
import AddStockModal from '../components/AddStockModal';
import AddOrderModal from '../components/AddOrderModal';
import useStocks from '../hooks/useStocks';
import useOrders from '../hooks/useOrders';

/**
 * DashboardPage — Main application page.
 * Combines Sidebar navigation, Stock/Order tables, and Add modals.
 * Manages shared state between stock and order hooks (qty sync after order ops).
 */
const DashboardPage = () => {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const [activeTab,       setActiveTab]       = useState('stock');
  const [stockModalOpen,  setStockModalOpen]  = useState(false);
  const [orderModalOpen,  setOrderModalOpen]  = useState(false);
  const [anchorEl,        setAnchorEl]        = useState(null);
  const [snack,           setSnack]           = useState({ open: false, msg: '', severity: 'success' });

  const {
    stocks, rawStocks, loading: stocksLoading, error: stocksError,
    sortConfig: stockSort, fetchStocks, addStock, deleteStock, requestSort: sortStocks,
  } = useStocks();

  const {
    orders, loading: ordersLoading, error: ordersError,
    sortConfig: orderSort, fetchOrders, addOrder, deleteOrder, requestSort: sortOrders,
  } = useOrders();

  // Load data when tab becomes active
  useEffect(() => { fetchStocks(); }, []);
  useEffect(() => { if (activeTab === 'order') fetchOrders(); }, [activeTab]);

  const showSnack = useCallback((msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
  }, []);

  // ── Stock handlers ────────────────────────────────────────
  const handleAddStock = async (name, qty) => {
    await addStock(name, qty);
    showSnack(`Stock "${name}" added successfully.`);
  };

  const handleDeleteStock = async (id) => {
    const stock = rawStocks.find((s) => s._id === id);
    await deleteStock(id);
    showSnack(`Stock "${stock?.name}" deleted.`);
  };

  // ── Order handlers ────────────────────────────────────────
  const handleAddOrder = async (customerName, stockId, orderQty) => {
    await addOrder(customerName, stockId, orderQty);
    // Re-fetch stocks to update orderQty display
    await fetchStocks();
    showSnack(`Order for "${customerName}" created successfully.`);
  };

  const handleDeleteOrder = async (id) => {
    await deleteOrder(id);
    // Re-fetch stocks to revert orderQty display
    await fetchStocks();
    showSnack('Order deleted. Stock quantity restored.', 'info');
  };

  // ── Auth handlers ─────────────────────────────────────────
  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleLogoutAll = async () => {
    setAnchorEl(null);
    await logoutAll();
    navigate('/login', { replace: true });
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* ── Sidebar ────────────────────────────────────────── */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Main content ───────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: '#fff',
            borderBottom: '1px solid #e8eaf0',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px !important' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {activeTab === 'stock' ? 'Stock Management' : 'Order Management'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Welcome back, {user?.firstName} {user?.lastName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={activeTab === 'stock' ? `${stocks.length} stocks` : `${orders.length} orders`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Tooltip title="Account menu" arrow>
                <Box
                  id="user-menu-btn"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#f5f5f5' },
                    transition: 'background 0.2s',
                  }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #3f51b5, #283593)',
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {user?.firstName}
                  </Typography>
                  <KeyboardArrowDownIcon fontSize="small" color="action" />
                </Box>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* User dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 200, mt: 0.5 } }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem id="logout-btn" onClick={handleLogout} sx={{ gap: 1.5, py: 1.2 }}>
            <LogoutIcon fontSize="small" color="action" />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
          <MenuItem id="logout-all-btn" onClick={handleLogoutAll} sx={{ gap: 1.5, py: 1.2 }}>
            <DevicesIcon fontSize="small" color="error" />
            <Typography variant="body2" color="error.main">Logout from All Devices</Typography>
          </MenuItem>
        </Menu>

        {/* ── Tab content ──────────────────────────────────── */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'stock' ? (
            <StockTable
              stocks={stocks}
              loading={stocksLoading}
              error={stocksError}
              sortConfig={stockSort}
              onSort={sortStocks}
              onDelete={handleDeleteStock}
              onAdd={() => setStockModalOpen(true)}
            />
          ) : (
            <OrderTable
              orders={orders}
              loading={ordersLoading}
              error={ordersError}
              sortConfig={orderSort}
              onSort={sortOrders}
              onDelete={handleDeleteOrder}
              onAdd={() => setOrderModalOpen(true)}
            />
          )}
        </Box>
      </Box>

      {/* ── Modals ───────────────────────────────────────────── */}
      <AddStockModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSave={handleAddStock}
      />
      <AddOrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSave={handleAddOrder}
        stocks={rawStocks}
      />

      {/* ── Snackbar notifications ───────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, boxShadow: 4 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
