import { useState } from 'react';
import { User } from '../App';
import { UtensilsCrossed } from 'lucide-react';

type LoginPageProps = {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
};

// Mock users untuk demo
const MOCK_USERS = [
  { id: '1', name: 'Budi Santoso', email: 'budi@email.com', password: 'password', role: 'buyer' as const },
  { id: '2', name: 'Siti Aminah', email: 'siti@email.com', password: 'password', role: 'buyer' as const },
];

export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl mb-4">
            <UtensilsCrossed className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-orange-600">eatZone</h1>
          <p className="text-gray-600">Pesan Makanan Kantin Kampus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-orange-600 hover:text-orange-700"
            >
              Daftar sekarang
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-blue-800">Demo Login:</p>
          <p className="text-blue-600">Email: budi@email.com</p>
          <p className="text-blue-600">Password: password</p>
        </div>
      </div>
    </div>
  );
}
