import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';
import SigilInput from '../components/SigilInput';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] flex items-center justify-center px-4 md:px-8">
      <FrameWrapper>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <SigilInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <SigilInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <GlowButton type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </GlowButton>
        </form>
        <div className="border-t border-muted/40 my-6"></div>
        <GlowButton
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign in with Google'}
        </GlowButton>
        <div className="mt-6 text-center">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </div>
      </FrameWrapper>
    </div>
  );
} 