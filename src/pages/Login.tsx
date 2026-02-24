import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useStore';
import type { FormEvent } from 'react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setAuth(data.user, data.token);
        navigate(data.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-emerald-900/5 border border-emerald-900/5"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold mb-2">
            {isRegister ? 'Join Gusto' : 'Welcome Back'}
          </h2>
          <p className="text-emerald-900/50 text-sm">
            {isRegister ? 'Create an account to start ordering' : 'Sign in to access your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-3 bg-emerald-50/50 border border-emerald-900/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3 bg-emerald-50/50 border border-emerald-900/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3 bg-emerald-50/50 border border-emerald-900/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4"
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-emerald-600 font-medium hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Join Us"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
