import api from './api';

export const sessionService = {
    async startCharging(stationId) {
        const response = await api.post('/sessions/start', { stationId });
        return response.data;
    },

    async stopCharging(sessionId) {
        const response = await api.post('/sessions/stop', { sessionId });
        return response.data;
    },

    async getUserSessions() {
        const response = await api.get('/sessions/user');
        return response.data;
    }
};