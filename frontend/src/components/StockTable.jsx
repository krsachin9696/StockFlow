import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, IconButton,
  Tooltip, Chip, TableSortLabel, CircularProgress, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

/**
 * StockTable — Displays sortable stock list with Add and Delete actions.
 * Delete is disabled when orderQty > 0.
 */
const StockTable = ({ stocks, loading, error, sortConfig, onSort, onDelete, onAdd }) => {
  const columns = [
    { key: 'name',      label: 'Stock Name' },
    { key: 'stockQty',  label: 'Stock Qty'  },
    { key: 'orderQty',  label: 'Order Qty'  },
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
          <Typography variant="h5" color="text.primary">Stock Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {stocks.length} stock{stocks.length !== 1 ? 's' : ''} available
          </Typography>
        </Box>
        <Button
          id="add-stock-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ boxShadow: 3 }}
        >
          Add Stock
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
              ) : stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    No stocks found. Add your first stock!
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock) => {
                  const canDelete = stock.orderQty === 0;
                  return (
                    <TableRow key={stock._id}>
                      <TableCell sx={{ fontWeight: 600 }}>{stock.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={stock.stockQty}
                          size="small"
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stock.orderQty}
                          size="small"
                          sx={{
                            bgcolor: stock.orderQty > 0 ? '#fff3e0' : '#f5f5f5',
                            color: stock.orderQty > 0 ? '#e65100' : '#757575',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={canDelete ? 'Delete stock' : 'Cannot delete: stock has active orders'}
                          arrow
                        >
                          <span>
                            <IconButton
                              id={`delete-stock-${stock._id}`}
                              size="small"
                              color="error"
                              disabled={!canDelete}
                              onClick={() => onDelete(stock._id)}
                              sx={{
                                '&:not(:disabled):hover': { bgcolor: '#ffebee' },
                                opacity: canDelete ? 1 : 0.35,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StockTable;
