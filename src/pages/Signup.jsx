import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-500', 'bg-yellow-400', 'bg-accent'];

  if (!password) return null;
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score - 1] : 'bg-navBorder'}`} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.pass ? 'text-accent' : 'text-muted'}`}>
            <CheckCircle2 className={`w-3 h-3 ${c.pass ? 'opacity-100' : 'opacity-30'}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/10 blur-[180px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface/80 backdrop-blur-2xl border border-navBorder rounded-3xl p-8 shadow-2xl space-y-7">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-black font-display font-black text-3xl shadow-[0_0_30px_rgba(232,255,0,0.4)] hover:scale-105 transition-transform">
              V
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-display font-black">Create your account</h1>
              <p className="text-muted text-sm mt-1">Join 100,000+ gamers on GameVault — it's free</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your gamer tag"
                  className="w-full bg-card border border-navBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-card border border-navBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-card border border-navBorder rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 placeholder:text-muted transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 placeholder:text-muted transition-colors ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                      : 'border-navBorder focus:border-accent/60 focus:ring-accent/30'
                  }`}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full gap-2 font-bold mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Account</>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2 pt-1">
            <Link to="/" className="block text-sm text-muted hover:text-text transition-colors">
              Browse without signing up <span className="underline underline-offset-2">→</span>
            </Link>
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
