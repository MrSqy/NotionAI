import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(email, password, name);
      setAuth(res.data.user, res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">NotionAI</h1>
          <p className="text-muted-foreground mt-1">Yeni hesap oluştur</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">İsim</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Adın Soyadın"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Şifre</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kayıt Ol
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
