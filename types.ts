export interface Country {
  code: string;
  name: string;
  flag: string;
}

export type SearchType = 'TOURIST' | 'RESIDENT';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  markdown: string;
  sources: GroundingChunk[];
}
