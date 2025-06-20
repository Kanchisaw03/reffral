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

      console.log('✅ Logged in UID:', user.uid);
      console.log('Referral Input:', referralInput);

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
          console.error('🚫 Referral code not found.');
          setError('Invalid referral code.');
          setLoading(false);
          return;
        }

        const refData = refDocSnap.data();
        const usedBy = refData.usedBy || [];

        console.log('🧾 usedBy:', usedBy);

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
          console.log('🔥 Adding UID to usedBy[]...');
          await updateDoc(refDocRef, {
            usedBy: arrayUnion(user.uid),
          });
          console.log('✅ usedBy updated.');
        
          console.log('🔥 Incrementing referral count...');
          await updateDoc(doc(db, 'users', refData.referrerUserId), {
            referralCount: increment(1),
          });
          console.log('✅ referralCount updated.');
        } catch (err) {
          console.error('❌ Referral update error:', err.code, err.message);
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
      console.error('Signup error:', err.code, err.message);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] flex items-center justify-center px-4 md:px-8">
      <FrameWrapper>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-center text-red-500 font-semibold bg-red-500/10 rounded-lg py-2 px-4">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <SigilInput label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <SigilInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <SigilInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <SigilInput label="Referral Code (optional)" value={referralInput} onChange={e => setReferralInput(e.target.value.toUpperCase())} />
          <GlowButton type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing up...' : 'Sign Up'}
          </GlowButton>
        </form>
        <div className="border-t border-muted/40 my-6"></div>
        <GlowButton
          onClick={e => handleSignup(e, 'google')}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign up with Google'}
        </GlowButton>
        <div className="mt-6 text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </div>
      </FrameWrapper>
    </div>
  );
}
