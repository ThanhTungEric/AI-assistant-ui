import { Box, Typography, Button } from '@mui/material';
import VGULogo from '../assets/VGU-Logo.png';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '@util/colors';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{

                minHeight: '100vh',
                bgcolor: COLORS.bgSoft,
                color: COLORS.textPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >

            <Box
                sx={{
                    position: 'absolute',
                    width: { xs: 150, md: 250 },
                    height: { xs: 150, md: 250 },
                    bgcolor: COLORS.cyan,
                    borderRadius: '50%',
                    opacity: 0.2,
                    filter: 'blur(50px)',
                    animation: 'moveBlob 15s infinite cubic-bezier(0.4, 0, 0.6, 1)',
                    zIndex: -1,
                    '&:nth-of-type(1)': { top: '10%', left: '15%', animationDelay: '0s' },
                    '&:nth-of-type(2)': { bottom: '20%', right: '10%', animationDelay: '5s' },
                    '&:nth-of-type(3)': { top: '50%', right: '25%', animationDelay: '10s' },
                }}
            />

            <style>
                {`
        @keyframes moveBlob {
            0% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30vw, -10vh) scale(1.2); }
            50% { transform: translate(-20vw, 20vh) scale(0.9); }
            75% { transform: translate(10vw, -15vh) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
        }
        @media (min-width: 768px) {
            .animated-blob {
                width: 250px;
                height: 250px;
                filter: blur(80px);
            }
        }
        `}
            </style>


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: { xs: 400, md: 600 },
                    textAlign: 'center',
                    zIndex: 10,
                }}
            >

                <Box
                    component="img"
                    src={VGULogo}
                    alt="VGU Logo"
                    sx={{
                        height: { xs: 60, md: 96 },
                        objectFit: 'contain',
                        mb: 4,
                    }}
                />
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: COLORS.navy,
                        mb: { xs: 2, md: 4 },
                        fontSize: { xs: '2rem', md: '3rem' },
                    }}
                >
                    Welcome to VGU Admissions Assistant
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        color: 'text.secondary',
                        maxWidth: '400px',
                        mx: 'auto',
                        mb: { xs: 4, md: 8 },
                    }}
                >
                    Your personal assistant for admissions, study programs, and career opportunities at Vietnamese-German University.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        width: '100%',
                        justifyContent: 'center',
                        gap: { xs: 2, md: 4 },
                    }}
                >
                    <Button
                        onClick={() => navigate('/login')}
                        variant="contained"
                        sx={{
                            width: { xs: '100%', md: 'auto' },
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                            transition: 'transform 0.3s ease-in-out',
                            bgcolor: COLORS.navy,
                            color: COLORS.textOnNavy,
                            '&:hover': {
                                transform: 'scale(1.05)',
                                bgcolor: COLORS.navyHover,
                            },
                        }}
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => navigate('/register')}
                        variant="outlined"
                        sx={{
                            width: { xs: '100%', md: 'auto' },
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            border: `2px solid ${COLORS.navy}`,
                            transition: 'transform 0.3s ease-in-out',
                            color: COLORS.navy,
                            '&:hover': {
                                transform: 'scale(1.05)',
                                border: `2px solid ${COLORS.navyHover}`,
                                color: COLORS.navyHover,
                            },
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default WelcomePage;
