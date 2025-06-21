import FrameWrapper from '../components/FrameWrapper';
import GlowButton from '../components/GlowButton';

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#18181b] flex items-center justify-center px-4 md:px-8">
      <FrameWrapper>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Referral Pro</h1>
        <p className="text-lg text-muted mb-8  text-white mb-4">A modern, professional referral dashboard for your team or community.</p>
        <GlowButton onClick={() => window.location.href = '/signup'}>
          Get Started
        </GlowButton>
      </FrameWrapper>
    </div>
  );
}