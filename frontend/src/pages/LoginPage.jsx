import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button,
  Link, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { Validators } from '../utils/validators';

/**
 * LoginPage — Sign-in page with email/password fields and validation.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiErr,   setApiErr]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const e = {};
    const emailErr = Validators.isRequired(email, 'Email') || Validators.isValidEmail(email);
    const pwdErr   = Validators.isRequired(password, 'Password');
    if (emailErr) e.email    = emailErr;
    if (pwdErr)   e.password = pwdErr;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true); setApiErr('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Left branding panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
        }}
      >
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>
          📦 StockFlow
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 340 }}>
          Manage your inventory and orders with ease. Real-time tracking, zero hassle.
        </Typography>
      </Box>

      {/* Right login form */}
      <Box
        sx={{
          width: { xs: '100%', md: 480 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: '#fff',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your StockFlow account
          </Typography>

          {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: null })); }}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>
                ),
              }}
            />
            <TextField
              id="login-password"
              label="Password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })); }}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd((p) => !p)}>
                      {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              id="login-submit-btn"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.4, mb: 2, fontSize: '1rem' }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
