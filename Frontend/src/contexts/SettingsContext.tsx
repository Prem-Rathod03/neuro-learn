import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark';

interface Settings {
  fontSize: FontSize;
  theme: Theme;
  distractionFreeDefault: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateFontSize: (size: FontSize) => void;
  updateTheme: (theme: Theme) => void;
  toggleDistractionFreeDefault: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

const defaultSettings: Settings = {
  fontSize: 'medium',
  theme: 'light',
  distractionFreeDefault: false,
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('neuropath_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    // Apply font size
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith('text-size-'))
      .join(' ');
    document.body.classList.add(`text-size-${settings.fontSize}`);

    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('neuropath_settings', JSON.stringify(settings));
  }, [settings]);

  const updateFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const toggleDistractionFreeDefault = () => {
    setSettings(prev => ({ ...prev, distractionFreeDefault: !prev.distractionFreeDefault }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateFontSize,
        updateTheme,
        toggleDistractionFreeDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
