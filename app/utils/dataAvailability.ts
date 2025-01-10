import PlotsFileSource from '@/app/utils/plotSourceProvider';

export const checkDataAvailability = (date: string) => {
  const simulationData = PlotsFileSource[date];
  if (!simulationData) return { hasActions: false, hasCognitiveLoad: false, hasVisualAttention: false, hasAllData: false };

  const hasActions = simulationData.actions.url !== undefined;
  const hasCognitiveLoad = Object.values(simulationData.cognitiveLoad).every(
    source => source.url !== undefined
  );
  const hasVisualAttention = Object.values(simulationData.visualAttention).every(
    source => source.url !== undefined
  );

  return {
    hasActions,
    hasCognitiveLoad,
    hasVisualAttention,
    hasAllData: hasActions && hasCognitiveLoad && hasVisualAttention
  };
}; 