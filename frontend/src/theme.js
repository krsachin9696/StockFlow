import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      dark: '#283593',
      light: '#7986cb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
    },
    error: { main: '#ef5350' },
    success: { main: '#66bb6a' },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.08)',
    '0 2px 8px rgba(0,0,0,0.10)',
    '0 4px 16px rgba(0,0,0,0.12)',
    '0 8px 24px rgba(0,0,0,0.14)',
    ...Array(20).fill('0 8px 32px rgba(0,0,0,0.16)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 22px', fontSize: '0.875rem' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: '#374151', backgroundColor: '#f8fafc', fontSize: '0.82rem', letterSpacing: 0.5, textTransform: 'uppercase' },
        body: { color: '#374151', fontSize: '0.9rem' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f0f4ff' },
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
