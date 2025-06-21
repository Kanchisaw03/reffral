import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';
import SigilInput from '../components/SigilInput';

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button
      className="absolute top-4 right-4 bg-glass rounded-full p-2 shadow-glow"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black relative px-4">
      <ThemeToggle />
      <FrameWrapper className="w-full max-w-md">
        <h1 className="font-heading text-3xl text-glow mb-6 text-center">Login</h1>
        {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <SigilInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <SigilInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <GlowButton type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Logging in...' : 'Login'}
          </GlowButton>
        </form>
        <div className="border-t border-cyan-400/10 my-6"></div>
        <GlowButton
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign in with Google'}
        </GlowButton>
        <div className="mt-6 text-center">
          <span className="text-cyan-200">Don't have an account? </span>
          <Link to="/signup" className="underline text-neon">Sign up</Link>
        </div>
      </FrameWrapper>
    </div>
  );
} 