export interface Resource {
  name: string;
  url: string | undefined;
}

export interface VisualAttentionDataSource {
  teamLead: Resource;
  defib: Resource;
  compressor: Resource;
  airway: Resource;
}

export interface CognitiveLoadData extends VisualAttentionDataSource{
  average: Resource;
}

export interface DataSource {
  video: Resource;
  actions: Resource;
  cognitiveLoad: CognitiveLoadData;
  visualAttention: VisualAttentionDataSource;
}

export type DataSources = Record<string, DataSource>;
