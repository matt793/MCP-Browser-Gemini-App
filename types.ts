// Basic types, will be expanded later

export interface AnalysisResult {
  id: string;
  type: string;
  data: any;
  summary?: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  steps: any[]; // Define steps more concretely later
}

export interface PageContent {
  html: string;
  text: string;
  links: string[];
  images: string[];
}

export interface AppState {
  currentUrl: string;
  browserHistory: string[];
  historyIndex: number;
  isLoading: boolean;
  analysisResults: AnalysisResult[];
  extractedData: any[];
  automationTasks: AutomationTask[];
  pageContent?: PageContent; // Optional for now
}
