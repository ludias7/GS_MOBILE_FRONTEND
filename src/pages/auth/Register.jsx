import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { RegisterForm } from '../../components/auth/RegisterForm';

export function Register() {
    const navigate = useNavigate();

    const handleRegisterSuccess = () => {
        navigate('/login');
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
                        Criar Conta
                    </Typography>

                    <RegisterForm onSuccess={handleRegisterSuccess} />

                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 1 }}
                    >
                        Já tem uma conta? Faça login
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}