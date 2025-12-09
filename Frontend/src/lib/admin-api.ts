// Admin API client for ML/NLP analytics

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8030';

export interface MLLog {
  _id: string;
  userId: string | null;
  timestamp: string;
  features: Record<string, number>;
  prediction: {
    topic: string;
    difficulty: string;
    modality: string;
  };
}

export interface NLPLog {
  _id: string;
  userId: string | null;
  timestamp: string;
  text: string;
  sentiment_score: number;
  confusion_flag: boolean;
}

export interface AccuracyTrend {
  date: string;
  accuracy: number;
  total: number;
  correct: number;
}

export interface UserStat {
  userId: string;
  totalActivities: number;
  correctAnswers: number;
  accuracy: number;
  avgTime: number;
  avgDifficulty: number;
  avgFocus: number;
  lastActivity: string | null;
}

export async function getMLLogs(userId?: string, limit: number = 50) {
  const url = userId 
    ? `${BASE_URL}/api/admin/ml-logs?userId=${userId}&limit=${limit}`
    : `${BASE_URL}/api/admin/ml-logs?limit=${limit}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ML logs');
  return res.json() as Promise<{ total: number; logs: MLLog[] }>;
}

export async function getNLPLogs(userId?: string, limit: number = 50) {
  const url = userId 
    ? `${BASE_URL}/api/admin/nlp-logs?userId=${userId}&limit=${limit}`
    : `${BASE_URL}/api/admin/nlp-logs?limit=${limit}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch NLP logs');
  return res.json() as Promise<{ total: number; logs: NLPLog[] }>;
}

export async function getAccuracyTrends(userId?: string, days: number = 7) {
  const url = userId 
    ? `${BASE_URL}/api/admin/accuracy-trends?userId=${userId}&days=${days}`
    : `${BASE_URL}/api/admin/accuracy-trends?days=${days}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch accuracy trends');
  return res.json() as Promise<{ period_days: number; trends: AccuracyTrend[] }>;
}

export async function getUserStats() {
  const res = await fetch(`${BASE_URL}/api/admin/user-stats`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json() as Promise<{ total_users: number; users: UserStat[] }>;
}

export async function getModelPerformance() {
  const res = await fetch(`${BASE_URL}/api/admin/model-performance`);
  if (!res.ok) throw new Error('Failed to fetch model performance');
  return res.json();
}

export async function getRecentActivity(limit: number = 20) {
  const res = await fetch(`${BASE_URL}/api/admin/recent-activity?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recent activity');
  return res.json();
}

