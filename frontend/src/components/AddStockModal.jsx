import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Alert, CircularProgress, Typography,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import { Validators } from '../utils/validators';

/**
 * AddStockModal — MUI Dialog for adding a new stock.
 * Validates name (required, duplicate handled by API) and qty (> 0).
 */
const AddStockModal = ({ open, onClose, onSave }) => {
  const [name,    setName]    = useState('');
  const [qty,     setQty]     = useState('');
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    const nameErr = Validators.isRequired(name, 'Stock Name');
    const qtyErr  = Validators.isPositiveNumber(qty, 'Stock Qty');
    if (nameErr) e.name = nameErr;
    if (qtyErr)  e.qty  = qtyErr;
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true); setApiErr('');
    try {
      await onSave(name.trim(), Number(qty));
      handleClose();
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Failed to add stock.');
    } finally { setLoading(false); }
  };

  const handleClose = () => {
    setName(''); setQty(''); setErrors({}); setApiErr('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth id="add-stock-modal">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon color="primary" />
          <Typography variant="h6">Add Stock</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            id="stock-name-input"
            label="Name"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: null })); }}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
          <TextField
            id="stock-qty-input"
            label="Qty"
            type="number"
            value={qty}
            onChange={(e) => { setQty(e.target.value); setErrors((p) => ({ ...p, qty: null })); }}
            error={!!errors.qty}
            helperText={errors.qty}
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button id="cancel-stock-btn" onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          id="save-stock-btn"
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

export default AddStockModal;
