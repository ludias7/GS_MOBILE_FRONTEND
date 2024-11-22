import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { LoginForm } from '../../components/auth/LoginForm';

export function Login() {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>

                    <LoginForm onSuccess={handleLoginSuccess} />

                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/register')}
                        sx={{ mt: 1 }}
                    >
                        Criar nova conta
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}