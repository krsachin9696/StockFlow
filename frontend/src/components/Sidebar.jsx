import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

/**
 * Sidebar — Left navigation panel with Stock and Order tabs.
 */
const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { key: 'stock', label: 'Stock', icon: <InventoryIcon /> },
    { key: 'order', label: 'Order', icon: <ShoppingCartIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 200,
        minHeight: '100%',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: '#fff', fontWeight: 800, letterSpacing: 0.5, fontSize: '1.1rem' }}
        >
          📦 StockFlow
        </Typography>
        <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
          Management System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Nav items */}
      <List sx={{ mt: 1, px: 1, flex: 1 }}>
        {navItems.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <ListItemButton
              key={key}
              id={`sidebar-${key}-tab`}
              onClick={() => onTabChange(key)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive ? '#fff' : '#9e9e9e',
                backgroundColor: isActive ? 'rgba(63,81,181,0.85)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive
                    ? 'rgba(63,81,181,0.9)'
                    : 'rgba(255,255,255,0.07)',
                  color: '#fff',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
