import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './authentication/LoginPage.jsx';
import SignupForm from './authentication/SignupPage.jsx';
import Home from './pages/Home.jsx';
import WelcomePage from './pages/Welcome.jsx';
import { getProfile } from './services/api/user.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { COLORS } from './util/colors.js';

const appTheme = createTheme({
  palette: {
    primary: {
      main: COLORS.navy,
      dark: COLORS.navyDark,
      light: COLORS.navyHover,
    },
    secondary: {
      main: COLORS.cyan,
    },
    background: {
      default: COLORS.bgSoft,
      paper: '#FFFFFF',
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await getProfile();

        if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
          navigate('/home');
        }
      } catch (err) {
        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
