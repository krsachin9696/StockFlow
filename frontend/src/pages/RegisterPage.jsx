import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Link,
  Alert, CircularProgress, InputAdornment, IconButton, Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { Validators } from '../utils/validators';

/**
 * RegisterPage — Registration page with all required fields + email.
 */
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiErr,   setApiErr]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (Validators.isRequired(form.firstName, 'First Name')) e.firstName = Validators.isRequired(form.firstName, 'First Name');
    if (Validators.isRequired(form.lastName, 'Last Name'))   e.lastName  = Validators.isRequired(form.lastName, 'Last Name');
    const emailErr = Validators.isRequired(form.email, 'Email') || Validators.isValidEmail(form.email);
    if (emailErr) e.email = emailErr;
    const pwdErr = Validators.isRequired(form.password, 'Password') || Validators.minLength(form.password, 6, 'Password');
    if (pwdErr) e.password = pwdErr;
    const cPwdErr = Validators.isRequired(form.confirmPassword, 'Confirm Password') || Validators.passwordsMatch(form.password, form.confirmPassword);
    if (cPwdErr) e.confirmPassword = cPwdErr;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true); setApiErr('');
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const pwdAdornment = (show, toggle) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton size="small" onClick={toggle}>
          {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
        </IconButton>
      </InputAdornment>
    ),
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Left branding */}
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
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>📦 StockFlow</Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 340 }}>
          Join thousands of businesses managing inventory efficiently.
        </Typography>
      </Box>

      {/* Right register form */}
      <Box
        sx={{
          width: { xs: '100%', md: 520 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: '#fff',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420, py: 4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>Create account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to get started
          </Typography>

          {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="reg-firstname"
                  label="First Name"
                  value={form.firstName}
                  onChange={set('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="reg-lastname"
                  label="Last Name"
                  value={form.lastName}
                  onChange={set('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            <TextField
              id="reg-email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment> }}
            />

            <TextField
              id="reg-password"
              label="Password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              error={!!errors.password}
              helperText={errors.password || 'Minimum 6 characters'}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                ...pwdAdornment(showPwd, () => setShowPwd((p) => !p)),
              }}
            />

            <TextField
              id="reg-confirm-password"
              label="Confirm Password"
              type={showCPwd ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              size="small"
              sx={{ mt: 2, mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                ...pwdAdornment(showCPwd, () => setShowCPwd((p) => !p)),
              }}
            />

            <Button
              id="register-submit-btn"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.4, mb: 2, fontSize: '1rem' }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
