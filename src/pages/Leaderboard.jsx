import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import FrameWrapper from '../components/FrameWrapper';
import ScrollCard from '../components/ScrollCard';
import GlowButton from '../components/GlowButton';

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] px-4 md:px-8">
      <FrameWrapper>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Leaderboard</h2>
        {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
        {users.length === 0 && !error ? (
          <div className="text-center text-muted font-semibold bg-muted/10 rounded-lg py-4 mb-4">No users yet.</div>
        ) : (
          users.map((user, idx) => (
            <ScrollCard key={user.referralCode} className="flex items-center justify-between">
              <span className="text-white font-semibold text-lg">{user.name}</span>
              <span className="text-blue-400 font-mono text-lg">{user.referralCount}</span>
            </ScrollCard>
          ))
        )}
        <div className="border-t border-muted/40 my-6"></div>
        <GlowButton
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </GlowButton>
      </FrameWrapper>
    </div>
  );
} 