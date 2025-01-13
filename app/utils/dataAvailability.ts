import {DataSources} from '@/types';

export const checkDataAvailability = (dataSources: DataSources, date: string) => {
  const simulationData = dataSources[date];
  if (!dataSources || !dataSources[date]) return { hasActions: false, hasCognitiveLoad: false, hasVisualAttention: false, hasAllData: false };

  const hasActions = simulationData.actions.url !== undefined;
  const hasCognitiveLoad = Object.values(simulationData.cognitiveLoad).every(
    source => !!source.url
  );
  const hasVisualAttention = Object.values(simulationData.visualAttention).every(
    source => !! source.url
  );

  return {
    hasActions,
    hasCognitiveLoad,
    hasVisualAttention,
    hasAllData: hasActions && hasCognitiveLoad && hasVisualAttention
  };
};
