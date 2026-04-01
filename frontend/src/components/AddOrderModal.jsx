import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Alert, CircularProgress,
  Typography, MenuItem, Select, InputLabel, FormControl,
  FormHelperText,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Validators } from '../utils/validators';

/**
 * AddOrderModal — MUI Dialog for placing a new order.
 * Validates customer name, stock selection, and qty (capped by available stock).
 */
const AddOrderModal = ({ open, onClose, onSave, stocks }) => {
  const [customer, setCustomer] = useState('');
  const [stockId,  setStockId]  = useState('');
  const [qty,      setQty]      = useState('');
  const [errors,   setErrors]   = useState({});
  const [apiErr,   setApiErr]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const selectedStock = stocks.find((s) => s._id === stockId);
  const available = selectedStock ? selectedStock.stockQty - selectedStock.orderQty : 0;

  const validate = () => {
    const e = {};
    const custErr = Validators.isRequired(customer, 'Customer Name');
    const stockErr = !stockId ? 'Please select a stock.' : null;
    const qtyErr   = Validators.isPositiveNumber(qty, 'Order Qty')
      || (selectedStock ? Validators.maxOrderQty(qty, available) : null);
    if (custErr)  e.customer = custErr;
    if (stockErr) e.stockId  = stockErr;
    if (qtyErr)   e.qty      = qtyErr;
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true); setApiErr('');
    try {
      await onSave(customer.trim(), stockId, Number(qty));
      handleClose();
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Failed to create order.');
    } finally { setLoading(false); }
  };

  const handleClose = () => {
    setCustomer(''); setStockId(''); setQty('');
    setErrors({}); setApiErr('');
    onClose();
  };

  // Reset qty when stock changes
  useEffect(() => {
    setQty('');
    setErrors((p) => ({ ...p, qty: null }));
  }, [stockId]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth id="add-order-modal">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6">Add Order</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            id="order-customer-input"
            label="Customer Name"
            value={customer}
            onChange={(e) => { setCustomer(e.target.value); setErrors((p) => ({ ...p, customer: null })); }}
            error={!!errors.customer}
            helperText={errors.customer}
            autoFocus
          />

          <FormControl fullWidth size="small" error={!!errors.stockId}>
            <InputLabel id="stock-select-label">Stock</InputLabel>
            <Select
              id="order-stock-select"
              labelId="stock-select-label"
              value={stockId}
              label="Stock"
              onChange={(e) => { setStockId(e.target.value); setErrors((p) => ({ ...p, stockId: null })); }}
            >
              {stocks.map((s) => {
                const avail = s.stockQty - s.orderQty;
                return (
                  <MenuItem key={s._id} value={s._id} disabled={avail === 0}>
                    {s.name}
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: avail > 0 ? 'success.main' : 'error.main' }}>
                      (avail: {avail})
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
            {errors.stockId && <FormHelperText>{errors.stockId}</FormHelperText>}
          </FormControl>

          <TextField
            id="order-qty-input"
            label={selectedStock ? `Order Qty (max: ${available})` : 'Order Qty'}
            type="number"
            value={qty}
            onChange={(e) => { setQty(e.target.value); setErrors((p) => ({ ...p, qty: null })); }}
            error={!!errors.qty}
            helperText={errors.qty}
            inputProps={{ min: 1, max: available || undefined }}
            disabled={!stockId}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button id="cancel-order-btn" onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          id="save-order-btn"
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderModal;
