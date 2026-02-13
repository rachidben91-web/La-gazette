
export interface GazetteIssue {
  id: string;
  title: string;
  number: number;
  date: string;
  summary: string;
  imageUrl: string;
  content: string;
  isNew: boolean;
}

export interface ArticleSuggestion {
  id: string;
  user: string;
  topic: string;
  description: string;
  status: 'pending' | 'reviewed' | 'accepted';
  createdAt: string;
  aiFeedback?: string;
}

export type ViewState = 'home' | 'archive' | 'suggestions' | 'admin' | 'reader';
