import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import FrameWrapper from '../components/FrameWrapper';
import ScrollCard from '../components/ScrollCard';
import GlowButton from '../components/GlowButton';

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

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('referralCount', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        setUsers(querySnapshot.docs.map(doc => doc.data()));
      } catch (err) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 relative">
      <ThemeToggle />
      <div className="max-w-3xl mx-auto">
        <FrameWrapper>
          <h2 className="font-heading text-2xl text-glow mb-6 text-center">Leaderboard</h2>
          <div className="space-y-4">
            {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
            {users.length === 0 && !error ? (
              <div className="text-center text-cyan-200 font-semibold bg-cyan-400/10 rounded-lg py-4 mb-4">No users yet.</div>
            ) : (
              users.map((user, idx) => (
                <ScrollCard key={user.referralCode} className={`flex items-center justify-between border ${idx === 0 ? 'border-neon animate-pulse' : 'border-cyan-400/10'}`}>
                  <span className={`font-heading text-lg text-white text-glow flex items-center gap-2`}>
                    {idx === 0 && <span className="text-2xl animate-pulse">🏆</span>}#{idx + 1} {user.name}
                  </span>
                  <span className="font-heading text-neon">{user.referralCount} referrals</span>
                </ScrollCard>
              ))
            )}
          </div>
          <div className="border-t border-cyan-400/10 my-6"></div>
          <GlowButton
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </GlowButton>
        </FrameWrapper>
      </div>
    </div>
  );
} 