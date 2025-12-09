import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { Settings as SettingsIcon, Type, Palette, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { settings, updateFontSize, updateTheme, toggleDistractionFreeDefault } = useSettings();
  const { toast } = useToast();

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateFontSize(size);
    toast({
      title: 'Font size updated',
      description: `Text size set to ${size}`,
    });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateTheme(theme);
    toast({
      title: 'Theme updated',
      description: `Switched to ${theme} mode`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-3xl">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Settings & Accessibility
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your learning experience
          </p>
        </div>

        {/* Font Size Settings */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Text Size</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Choose a comfortable reading size
            </p>

            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={settings.fontSize === 'small' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('small')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-xs mb-1">A</p>
                  <p className="text-sm">Small</p>
                </div>
              </Button>
              <Button
                variant={settings.fontSize === 'medium' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('medium')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-base mb-1">A</p>
                  <p className="text-sm">Medium</p>
                </div>
              </Button>
              <Button
                variant={settings.fontSize === 'large' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('large')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-lg mb-1">A</p>
                  <p className="text-sm">Large</p>
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Theme</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Choose between light and dark mode
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
                className="h-auto py-6"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <p className="text-sm">Light Mode</p>
                </div>
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
                className="h-auto py-6"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌙</div>
                  <p className="text-sm">Dark Mode</p>
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Distraction-Free Mode */}
        <Card className="p-6 shadow-card animate-in fade-in duration-700 delay-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Distraction-Free Mode</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Enable by default when starting activities. This hides navigation and other UI elements to help you focus.
              </p>
            </div>
            <Switch
              checked={settings.distractionFreeDefault}
              onCheckedChange={() => {
                toggleDistractionFreeDefault();
                toast({
                  title: 'Setting updated',
                  description: `Distraction-free mode ${settings.distractionFreeDefault ? 'disabled' : 'enabled'} by default`,
                });
              }}
            />
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 shadow-card bg-primary-soft/30 animate-in fade-in duration-700 delay-400">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="text-xl">💡</span>
              Accessibility Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Larger text makes reading easier and more comfortable</li>
              <li>Dark mode reduces eye strain in low-light environments</li>
              <li>Distraction-free mode helps maintain focus during activities</li>
              <li>You can change these settings anytime</li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
