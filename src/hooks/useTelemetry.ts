import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useTelemetry = () => {
  const { currentProjectId, updateTelemetryStream, updatePCardTelemetry } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // Access store state directly to avoid being a dependency
      const state = useStore.getState();
      const pCards = state.pCards;

      // 1. Update Global Telemetry Stream (NSP)
      updateTelemetryStream({
        cpu: Math.floor(Math.random() * 30 + 10), // 10-40%
        memory: Math.floor(Math.random() * 20 + 40), // 40-60%
        network: Math.floor(Math.random() * 50 + 5), // 5-55 MB/s
        latency: Math.floor(Math.random() * 40 + 60), // 60-100ms
      });

      // 2. Update specific PCard telemetry if current project exists
      if (currentProjectId && pCards[currentProjectId]) {
        const topCard = pCards[currentProjectId][0];
        if (topCard && topCard.runtime.build_status === 'SUCCESS') {
          updatePCardTelemetry(
            currentProjectId,
            topCard.pcard_id,
            Math.floor(Math.random() * 50 + 80),
            Math.random() > 0.98 ? 1 : 0 // Rare error simulation
          );
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentProjectId, updateTelemetryStream, updatePCardTelemetry]);
};
