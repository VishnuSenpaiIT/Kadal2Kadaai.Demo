import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Anchor, Compass, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  // Generate randomized bubble properties for the floating background effect
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const generatedBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      size: `${Math.random() * 24 + 8}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 8 + 6}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-[65vh] flex items-center justify-center pt-20 pb-12 overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#112240] to-[#1B4965] text-white"
    >
      {/* Ocean Dynamic Gradient Wave Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-400/10 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] rounded-full bg-gradient-to-bl from-cyan-400/15 via-transparent to-emerald-500/5 blur-3xl" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Floating Bubbles Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animation: `float ${bubble.duration} linear infinite`,
              animationDelay: bubble.delay,
            }}
          />
        ))}
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-cyan-950/50 border border-[#00B4D8]/30 px-3 py-1.5 rounded-full text-[#00B4D8] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg shadow-cyan-900/10 animate-fade-in"
          >
            <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Coastal Sourced • Tamil Nadu Direct</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 uppercase select-none mb-6"
          >
            From Ocean Waves <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] via-[#48CAE4] to-blue-500">
              To Your Kitchen Flames
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-xs sm:text-sm md:text-base text-white/90 max-w-xl mx-auto font-light leading-relaxed tracking-wide mb-8"
          >
            Order premium fresh seafood directly from trusted fishermen and receive your morning catch delivered to your doorstep within hours. 100% traceably packed, sanitized on flake ice.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              id="hero-primary-btn"
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0a192f] font-sans text-[11px] font-extrabold tracking-wide px-7 py-3 rounded-full shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-0.5 cursor-pointer focus:outline-none uppercase"
            >
              Shop Today's Catch
            </button>
            <button
              id="hero-secondary-btn"
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/20 font-sans text-[11px] font-bold tracking-wide px-7 py-3 rounded-full transition-all hover:border-[#00B4D8] cursor-pointer uppercase"
            >
              Explore Marketplace
            </button>
          </motion.div>

          {/* Statistics Section inside Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10"
          >
            <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm shadow-sm transition-transform hover:scale-102">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 text-[#00B4D8] mb-2 border border-[#00B4D8]/20">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200">10,000+</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-medium">Happy Customers</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm shadow-sm transition-transform hover:scale-102">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 text-[#00B4D8] mb-2 border border-[#00B4D8]/20">
                <Anchor className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200">500+</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-medium">Fishermen Partners</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm shadow-sm transition-transform hover:scale-102">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 text-[#00B4D8] mb-2 border border-[#00B4D8]/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl md:text-3xl font-extrabold text-[#00B4D8]">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-[#D9E2EC] mt-1 font-medium">Fresh Deliveries Daily</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
