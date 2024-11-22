import { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Box, 
    Alert,
    AppBar,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch
} from '@mui/material';
import { LogoutOutlined, Settings } from '@mui/icons-material';
import { StationCard } from '../../components/charging/StationCard';
import { stationService } from '../../services/station.service';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [openPreferences, setOpenPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        renewableOnly: false,
        preferredLocation: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        loadStations();
    }, [navigate]);

    const loadStations = async () => {
        try {
            const data = await stationService.getAllStations();
            setStations(data);
        } catch (err) {
            setError('Erro ao carregar estações');
        } finally {
            setLoading(false);
        }
    };

    const handleStartCharging = async (stationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            console.log('Iniciando carregamento para estação:', stationId);
            const response = await stationService.startCharging(stationId);
            console.log('Resposta do servidor:', response);
            await loadStations();
        } catch (err) {
            console.error('Erro detalhado:', err);
            if (err.response?.status === 401) {
                navigate('/login');
                return;
            }
            setError('Erro ao iniciar carregamento');
        }
    };

    const handleStopCharging = async (stationId) => {
        try {
            console.log('Buscando sessões ativas para estação:', stationId);
            const sessions = await stationService.getStationActiveSessions(stationId);
            console.log('Sessões encontradas:', sessions);
            
            if (sessions && sessions.length > 0) {
                const activeSession = sessions[0];
                console.log('Sessão ativa:', activeSession);
                
                const startTime = new Date(activeSession.start_time);
                const endTime = new Date();
                const hoursElapsed = (endTime - startTime) / (1000 * 60 * 60);
                const energyConsumed = hoursElapsed * activeSession.available_power;
                
                console.log('Parando carregamento:', {
                    sessionId: activeSession.id,
                    energyConsumed
                });
                
                await stationService.stopCharging(activeSession.id, energyConsumed);
                await loadStations();
            } else {
                console.log('Nenhuma sessão ativa encontrada');
            }
        } catch (err) {
            console.error('Erro ao parar carregamento:', err);
            setError('Erro ao parar carregamento');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSavePreferences = () => {
        // TODO: Implementar salvamento das preferências no backend
        setOpenPreferences(false);
    };

    if (loading) {
        return (
            <Container>
                <Box mt={4}>
                    <Typography>Carregando...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        EV Charging
                    </Typography>
                    <Button 
                        color="inherit" 
                        startIcon={<Settings />}
                        onClick={() => setOpenPreferences(true)}
                        sx={{ mr: 2 }}
                    >
                        Preferências
                    </Button>
                    <Button 
                        color="inherit"
                        startIcon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Box mt={4} mb={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Estações de Carregamento
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {stations.map(station => (
                            <Grid item xs={12} sm={6} md={4} key={station.id}>
                                <StationCard
                                    station={station}
                                    onStartCharging={handleStartCharging}
                                    onStopCharging={handleStopCharging}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            <Dialog open={openPreferences} onClose={() => setOpenPreferences(false)}>
                <DialogTitle>Preferências de Carregamento</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={preferences.renewableOnly}
                                onChange={(e) => setPreferences({
                                    ...preferences,
                                    renewableOnly: e.target.checked
                                })}
                                color="primary"
                            />
                        }
                        label="Apenas Energia Renovável"
                    />
                    <TextField
                        fullWidth
                        label="Localização Preferida"
                        value={preferences.preferredLocation}
                        onChange={(e) => setPreferences({
                            ...preferences,
                            preferredLocation: e.target.value
                        })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPreferences(false)}>Cancelar</Button>
                    <Button onClick={handleSavePreferences} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}