import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/api';

export type NeurodiversityTag = 'ADHD' | 'Autism' | 'Dyslexia' | 'ASD' | 'Multiple' | 'Other';

interface EnrichedUser extends api.User {
  neuroFlags: string[]; // Use neuroFlags from backend
  neurodiversityTags?: NeurodiversityTag[]; // Keep for backward compatibility
}

interface AuthContextType {
  user: EnrichedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    neurodiversityTags: NeurodiversityTag[];
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'neuropath_user';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<EnrichedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.success && res.user) {
      // Use neuroFlags from backend, fallback to neuroType for backward compatibility
      const neuroFlags = res.user.neuroFlags || (res.user.neuroType ? [res.user.neuroType] : []);
      const enriched: EnrichedUser = {
        ...res.user,
        neuroFlags,
        neurodiversityTags: neuroFlags as NeurodiversityTag[], // Keep for backward compatibility
      };
      setUser(enriched);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      return;
    }
    throw new Error(res.message || 'Invalid credentials');
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    neurodiversityTags: NeurodiversityTag[];
  }) => {
    // Convert neurodiversityTags to neuroFlags array for backend
    const neuroFlags = data.neurodiversityTags.length > 0 
      ? data.neurodiversityTags.map(tag => tag === 'Autism' ? 'ASD' : tag) // Map 'Autism' to 'ASD'
      : [];
    const res = await api.register(data.name, data.email, data.password, neuroFlags);
    if (res.success && res.user) {
      // Use neuroFlags from backend response, fallback to what we sent
      const flags = res.user.neuroFlags || neuroFlags;
      const enriched: EnrichedUser = {
        ...res.user,
        neuroFlags: flags,
        neurodiversityTags: data.neurodiversityTags.length ? data.neurodiversityTags : (flags as NeurodiversityTag[]),
      };
      setUser(enriched);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      return;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
