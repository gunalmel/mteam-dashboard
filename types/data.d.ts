export interface ActionImage {
  url: string;
  name: string;
  group: string;
  y: number;
}

export interface GazeData {
  time: number; // Unix timestamp in seconds
  category?: string|null;
  object?: string|null;
}

export interface GazeDataStack {
  time: string;
  counts: Record<GazeData.category, number>;
  totalCount: number;
}
