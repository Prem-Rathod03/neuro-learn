import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login...');
      await login(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard...');
      toast({
        title: 'Welcome back! 👋',
        description: "Let's continue your learning journey",
      });
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Welcome
        </Button>

        <Card className="p-8 shadow-elevated">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🧠</div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">Login to continue your learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
