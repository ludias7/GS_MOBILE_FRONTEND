import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { EvStation, BatteryChargingFull } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export function StationCard({ station, onStartCharging, onStopCharging }) {
    const isAvailable = station.status === 'AVAILABLE';
    const isCharging = station.status === 'IN_USE';
    const [chargingProgress, setChargingProgress] = useState(0);

    useEffect(() => {
        let timer;
        if (isCharging && chargingProgress < 100) {
            timer = setInterval(() => {
                setChargingProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 1000);
        } else if (!isCharging) {
            setChargingProgress(0);
        }
        
        return () => clearInterval(timer);
    }, [isCharging, chargingProgress]);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                    <EvStation 
                        sx={{ mr: 1 }} 
                        color={isAvailable ? "success" : isCharging ? "warning" : "error"} 
                    />
                    <Typography variant="h6" component="div">
                        {station.name}
                    </Typography>
                </Box>

                <Typography color="text.secondary" gutterBottom>
                    Localização: {station.location}
                </Typography>

                <Typography 
                    color={isAvailable ? "success.main" : isCharging ? "warning.main" : "error.main"} 
                    gutterBottom
                >
                    Status: {isAvailable ? 'Disponível' : isCharging ? 'Em uso' : 'Indisponível'}
                </Typography>

                <Typography variant="body2" gutterBottom>
                    Potência: {station.available_power}kW
                </Typography>

                {station.isRenewable && (
                    <Typography variant="body2" color="success.main" gutterBottom>
                        ♻️ Energia Renovável
                    </Typography>
                )}

                {isCharging && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Progresso: {chargingProgress}%
                        </Typography>
                        <Box 
                            sx={{ 
                                width: '100%', 
                                height: 10, 
                                bgcolor: '#e0e0e0',
                                borderRadius: 5,
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${chargingProgress}%`,
                                    height: '100%',
                                    bgcolor: 'warning.main',
                                    transition: 'width 0.5s ease-in-out'
                                }}
                            />
                        </Box>
                    </Box>
                )}

                <Box mt={2}>
                    {isAvailable && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<BatteryChargingFull />}
                            onClick={() => onStartCharging(station.id)}
                            fullWidth
                        >
                            Iniciar Carregamento
                        </Button>
                    )}
                    {isCharging && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onStopCharging(station.id)}
                            fullWidth
                        >
                            Parar Carregamento
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}