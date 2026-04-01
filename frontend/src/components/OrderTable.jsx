import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, IconButton,
  Tooltip, Chip, TableSortLabel, CircularProgress, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

/**
 * OrderTable — Displays sortable order list with Add and Delete actions.
 */
const OrderTable = ({ orders, loading, error, sortConfig, onSort, onDelete, onAdd }) => {
  const columns = [
    { key: 'customerName', label: 'Customer'   },
    { key: 'stockName',    label: 'Stock Name'  },
    { key: 'orderQty',     label: 'Order Qty'   },
  ];

  const SortLabel = ({ colKey, children }) => (
    <TableSortLabel
      active={sortConfig.key === colKey}
      direction={sortConfig.key === colKey ? sortConfig.direction : 'asc'}
      onClick={() => onSort(colKey)}
    >
      {children}
    </TableSortLabel>
  );

  return (
    <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" color="text.primary">Order Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </Typography>
        </Box>
        <Button
          id="add-order-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ boxShadow: 3 }}
        >
          Add Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <SortLabel colKey={col.key}>{col.label}</SortLabel>
                  </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    No orders yet. Create your first order!
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell sx={{ fontWeight: 600 }}>{order.customerName}</TableCell>
                    <TableCell>{order.stockName}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderQty}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete order (restores stock qty)" arrow>
                        <IconButton
                          id={`delete-order-${order._id}`}
                          size="small"
                          color="error"
                          onClick={() => onDelete(order._id)}
                          sx={{ '&:hover': { bgcolor: '#ffebee' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderTable;
