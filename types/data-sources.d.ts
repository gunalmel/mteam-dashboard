interface Resource {
  name: string;
  url: string | undefined;
}

interface VisualAttentionDataSource {
  teamLead: Resource;
  defib: Resource;
  compressor: Resource;
  airway: Resource;
}

interface CognitiveLoadDataSource extends VisualAttentionDataSource{
  average: Resource;
}

interface DataSource {
  video: Resource;
  actions: Resource;
  cognitiveLoad: CognitiveLoadDataSource;
  visualAttention: VisualAttentionDataSource;
}

export type DataSources = Record<string, DataSource>;
