import { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { StationCard } from '../../components/charging/StationCard';
import { stationService } from '../../services/station.service';

export function Stations() {
    const [stations, setStations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStations();
    }, []);

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
        <Container>
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Estações de Carregamento
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {stations.map(station => (
                    <StationCard
                        key={station.id}
                        station={station}
                    />
                ))}
            </Box>
        </Container>
    );
}
