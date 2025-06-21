import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';
import SigilInput from '../components/SigilInput';

// ThemeToggle component for dark mode
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

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) setReferralInput(ref);
  }, [location.search]);

  const waitForAuth = () => {
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          resolve(user);
        }
      });
    });
  };

  const handleSignup = async (e, provider = null) => {
    e && e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let userCredential;
      if (provider === 'google') {
        userCredential = await signInWithPopup(auth, googleProvider);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      const referralCode = user.uid.slice(0, 6).toUpperCase();
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: name || user.displayName || '',
          referralCode,
          referralCount: 0,
        });
      }
      if (referralInput && referralInput !== referralCode) {
        const refDocRef = doc(db, 'referrals', referralInput);
        const refDocSnap = await getDoc(refDocRef);
        if (!refDocSnap.exists()) {
          setError('Invalid referral code.');
          setLoading(false);
          return;
        }
        const refData = refDocSnap.data();
        const usedBy = refData.usedBy || [];
        if (refData.referrerUserId === user.uid) {
          setError('You cannot refer yourself.');
          setLoading(false);
          return;
        }
        if (usedBy.includes(user.uid)) {
          setError('You have already used this referral code.');
          setLoading(false);
          return;
        }
        try {
          await updateDoc(refDocRef, {
            usedBy: arrayUnion(user.uid),
          });
          await updateDoc(doc(db, 'users', refData.referrerUserId), {
            referralCount: increment(1),
          });
        } catch (err) {
          setError(`Referral write failed: ${err.message}`);
          setLoading(false);
          return;
        }
      }
      const myRefDocRef = doc(db, 'referrals', referralCode);
      const myRefDocSnap = await getDoc(myRefDocRef);
      if (!myRefDocSnap.exists()) {
        await setDoc(myRefDocRef, {
          referrerUserId: user.uid,
          usedBy: [],
        });
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in instead.');
      } else if (err.code === 'permission-denied') {
        setError('Permission denied. Check Firestore rules.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black relative px-4">
      <ThemeToggle />
      <FrameWrapper className="w-full max-w-md">
        <h1 className="font-heading text-3xl text-glow mb-6 text-center">Sign Up</h1>
        {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <SigilInput label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <SigilInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <SigilInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <SigilInput label="Referral Code (optional)" value={referralInput} onChange={e => setReferralInput(e.target.value.toUpperCase())} />
          <GlowButton type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Signing up...' : 'Sign Up'}
          </GlowButton>
        </form>
        <div className="border-t border-cyan-400/10 my-6"></div>
        <GlowButton
          onClick={e => handleSignup(e, 'google')}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign up with Google'}
        </GlowButton>
        <div className="mt-6 text-center">
          <span className="text-cyan-200">Already have an account? </span>
          <Link to="/login" className="underline text-neon">Login</Link>
        </div>
      </FrameWrapper>
    </div>
  );
}
