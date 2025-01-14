export interface ActionImage {
  url: string;
  name: string;
  group: string;
  y: number;
}

interface VisualAttentionData {
  time: number; // Unix timestamp in seconds
  category?: string|null;
  object?: string|null;
}

interface VisualAttentionDataStack {
  time: string;
  counts: Record<VisualAttentionData.category, number>;
  totalCount: number;
}
