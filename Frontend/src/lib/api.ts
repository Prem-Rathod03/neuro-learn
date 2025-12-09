const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export interface User {
  name: string;
  email: string;
  neuroFlags?: string[]; // e.g. ["ADHD", "Dyslexia", "ASD"]
  neuroType?: string; // kept for backward compatibility
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// ---------- AUTH ----------

export async function register(
  name: string,
  email: string,
  password: string,
  neuroFlags: string[]
): Promise<AuthResponse> {
  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000); // 3 second timeout for registration
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, neuroFlags }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || errorData.detail || `Registration failed: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      throw new Error('Registration request timeout - backend may be unavailable');
    }
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Cannot connect to backend server. Please check if the server is running.');
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 3000); // 3 second timeout for login
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || errorData.detail || `Login failed: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      throw new Error('Login request timeout - backend may be unavailable');
    }
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Cannot connect to backend server. Please check if the server is running.');
    }
    throw error;
  }
}

// ---------- ACTIVITY ----------

// Import new ActivityItem type
import type { ActivityItem } from '@/types/activity';

// Legacy Activity interface for backward compatibility
export interface Activity {
  activityId: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  modality: 'text' | 'audio' | 'visual' | string;
  question: string;
  passage?: string;
  options?: string[];
}

// New ActivityItem-based endpoint with timeout
export async function getNextActivity(): Promise<ActivityItem> {
  // Add timeout to prevent hanging - use AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 1000); // 1 second timeout - fail fast
  
  try {
    const res = await fetch(`${BASE_URL}/api/activity/next`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch activity: ${res.statusText} (${res.status})`);
    }
    
    const data = await res.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      throw new Error('Request timeout - backend may be unavailable');
    }
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Cannot connect to backend server');
    }
    throw error;
  }
}

export interface SubmitPayload {
  activityId: string;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
  difficultyRating: number; // 1–5
  focusRating: number; // 1–5
  feedbackText?: string;
  attentionScore?: number;
}

export async function submitActivity(payload: SubmitPayload) {
  const res = await fetch(`${BASE_URL}/api/activity/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ---------- PROGRESS ----------

export interface ProgressResponse {
  overallAccuracy: number;
  attempts: number;
}

export async function getProgress(): Promise<ProgressResponse> {
  const res = await fetch(`${BASE_URL}/api/progress`);
  return res.json();
}

// ---------- REPHRASE ----------

export interface RephraseRequest {
  question: string;
  options?: string[];
  difficulty?: string;
  neuroType?: string;
  confusionFlag?: boolean;
}

export interface RephraseResponse {
  simplifiedQuestion: string;
  simplifiedOptions?: string[];
}

export async function rephrase(payload: RephraseRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/rephrase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Rephrase failed' }));
    throw new Error(error.detail || error.message || 'Rephrase failed');
  }
  
  const data: RephraseResponse = await res.json();
  return data.simplifiedQuestion;
}


