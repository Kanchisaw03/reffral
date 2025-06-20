import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';
import ScrollCard from '../components/ScrollCard';
// import { Zap, Globe, Image, Code } from 'lucide-react'; // Uncomment if using lucide icons

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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] px-4 md:px-8">
        <FrameWrapper>
          <div className="text-red-500 mb-4 text-center">{error}</div>
          <GlowButton onClick={handleLogout} className="w-full">Logout</GlowButton>
        </FrameWrapper>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/signup?ref=${userData.referralCode}`;

  const features = [
    {
      icon: '⚡', // Replace with <Zap className="w-6 h-6 text-blue-400" /> if using lucide
      title: 'Task Automation',
      description: 'Automate and simplify your workflow.',
    },
    {
      icon: '🌐',
      title: 'Multi-language Support',
      description: 'Ask and answer in any language.',
    },
    {
      icon: '🖼️',
      title: 'Image Generation',
      description: 'Generate creative visuals on demand.',
    },
    {
      icon: '💻',
      title: 'Code Snippets',
      description: 'Get instant code solutions.',
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] px-4 md:px-8">
      <FrameWrapper>
        <ScrollCard className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <div className="text-lg text-muted font-semibold uppercase tracking-wide mb-1">User</div>
              <div className="text-2xl text-white font-bold">{userData.name}</div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-lg text-muted font-semibold uppercase tracking-wide mb-1">Referrals</div>
              <div className="text-2xl text-blue-400 font-bold">{userData.referralCount}</div>
            </div>
          </div>
          <div className="border-t border-muted/40 my-4"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="text-lg text-muted font-semibold uppercase tracking-wide mb-1">Referral Code</div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-muted/30 px-3 py-1 rounded text-lg text-white tracking-wider">{userData.referralCode}</span>
                <GlowButton
                  className="px-2 py-1 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(userData.referralCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </GlowButton>
              </div>
            </div>
            <a
              href={`https://wa.me/?text=Join%20using%20my%20referral%20code%3A%20${userData.referralCode}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </a>
          </div>
        </ScrollCard>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <GlowButton
            onClick={() => window.location.href = '/leaderboard'}
            className="w-full md:w-auto"
          >
            View Leaderboard
          </GlowButton>
          <GlowButton
            onClick={handleLogout}
            className="w-full md:w-auto"
          >
            Logout
          </GlowButton>
        </div>
      </FrameWrapper>
    </div>
  );
}
