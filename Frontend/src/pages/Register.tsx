import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, NeurodiversityTag } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    neurodiversityTags: [] as NeurodiversityTag[],
  });

  const [loading, setLoading] = useState(false);

  const allTags: NeurodiversityTag[] = ['ADHD', 'Autism', 'Dyslexia', 'Multiple', 'Other'];

  const handleTagToggle = (tag: NeurodiversityTag) => {
    setFormData((prev) => ({
      ...prev,
      neurodiversityTags: prev.neurodiversityTags.includes(tag)
        ? prev.neurodiversityTags.filter((t) => t !== tag)
        : [...prev.neurodiversityTags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.neurodiversityTags.length === 0) {
      toast({
        title: 'Please select at least one tag',
        description: 'This helps us personalize your learning experience',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : undefined,
        neurodiversityTags: formData.neurodiversityTags,
      });

      toast({
        title: 'Welcome to NeuroPath! 🎉',
        description: 'Your account has been created successfully',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again',
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
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Let's get started on your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                min="1"
                max="100"
              />
            </div>

            <div className="space-y-3">
              <Label>Learning Profile *</Label>
              <p className="text-sm text-muted-foreground">
                Select all that apply (this helps us personalize your experience)
              </p>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={formData.neurodiversityTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label
                      htmlFor={tag}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
