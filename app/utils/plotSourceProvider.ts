import {CognitiveLoadDataSource, DataSources, VisualAttentionDataSource} from '@/types';

const baseUrl = 'https://dl.dropboxusercontent.com/scl/fi';

const sourceFiles = `${baseUrl}/0zl1h0wpjr96pohwf3bj1/mteam-dashboard-source-file-index.json?rlkey=o7epwww8iuq18pmrrm8dobnyj&st=rj9blmdf&dl=0`;

//TODO: Melih - instead of helper fn, better to have a class. Need to refactor
const prependBaseUrl = (simulationDataSet: DataSources, baseUrl: string): DataSources => {
  for (const key in simulationDataSet){
    for (const innerKey in simulationDataSet[key]) {
      const simData = simulationDataSet[key];
      if ((innerKey == 'video' || innerKey == 'actions') ) {
        if (simData && simData[innerKey].url) {
          simulationDataSet[key][innerKey].url = `${baseUrl}${simulationDataSet[key][innerKey].url}`;
        }
      }
      else{
        const simData = simulationDataSet[key][innerKey as 'cognitiveLoad' | 'visualAttention'] as CognitiveLoadDataSource | VisualAttentionDataSource;
        for (const innerInnerKey in simData) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if(simData[innerInnerKey].url) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            simData[innerInnerKey].url = `${baseUrl}/${simData[innerInnerKey].url}`;
          }
        }
      }
    }
  }
  return simulationDataSet;
};

export const fetchDataSources = async (): Promise<DataSources> => {
  const response = await fetch(sourceFiles);
  const dataSources = await response.json();
  return prependBaseUrl(dataSources, baseUrl);
};
