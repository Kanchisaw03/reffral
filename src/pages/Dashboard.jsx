import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';
import ScrollCard from '../components/ScrollCard';
// import { Zap, Globe, Image, Code } from 'lucide-react'; // Uncomment if using lucide icons

function StatWidget({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 bg-glass rounded-xl p-4 shadow-glow min-w-[160px]">
      {icon && <span className="text-2xl text-cyan-400">{icon}</span>}
      <div>
        <div className="text-sm text-cyan-200">{label}</div>
        <div className="font-heading text-xl text-white text-glow">{value}</div>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
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

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(true);
      setError('');
      if (u) {
        try {
          const docSnap = await getDoc(doc(db, 'users', u.uid));
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError('User profile not found. Please sign up again.');
            setUserData(null);
          }
        } catch (err) {
          setError('Failed to load user data.');
          setUserData(null);
        }
      } else {
        setError('You are not logged in.');
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4">
        <FrameWrapper>
          <div className="text-red-500 mb-4 text-center">{error}</div>
          <GlowButton onClick={handleLogout} className="w-full">Logout</GlowButton>
        </FrameWrapper>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/signup?ref=${userData.referralCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 relative">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto space-y-8">
        <FrameWrapper>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl text-glow">Welcome, {userData.name}</h2>
              <div className="text-cyan-200 mt-2">Your referral code:</div>
              <div className="font-heading text-xl text-neon mb-2">{userData.referralCode}</div>
              <GlowButton onClick={() => {navigator.clipboard.writeText(userData.referralCode); setCopied(true); setTimeout(()=>setCopied(false), 1200);}}>
                {copied ? 'Copied!' : 'Copy Code'}
              </GlowButton>
            </div>
            <div className="flex gap-4">
              <StatWidget label="Referrals" value={userData.referralCount || 0} icon="👥" />
              <StatWidget label="Rank" value={userData.rank || '-'} icon="🏆" />
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
            <a
              href={`https://wa.me/?text=Join%20using%20my%20referral%20code%3A%20${userData.referralCode}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </a>
            <GlowButton onClick={() => window.location.href = '/leaderboard'}>
              View Leaderboard
            </GlowButton>
            <GlowButton onClick={handleLogout}>
              Logout
            </GlowButton>
          </div>
        </FrameWrapper>
      </div>
    </div>
  );
}
