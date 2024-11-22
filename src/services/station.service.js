import api from './api';

export const stationService = {
    getAllStations: async () => {
        const response = await api.get('/stations');
        return response.data;
    },

    startCharging: async (stationId) => {
        const response = await api.post('/sessions/start', { stationId });
        return response.data;
    },

    stopCharging: async (sessionId, energyConsumed) => {
        const response = await api.post('/sessions/stop', { sessionId, energyConsumed });
        return response.data;
    },

    getStationActiveSessions: async (stationId) => {
        const response = await api.get(`/sessions/station/${stationId}/active`);
        return response.data;
    }
};