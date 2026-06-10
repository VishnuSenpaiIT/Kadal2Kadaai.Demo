import React from 'react';
import { Compass, Ship, Anchor, Leaf, Award, ShieldCheck, Heart } from 'lucide-react';

export default function AboutView() {
  const milestones = [
    { year: '2:00 AM', title: 'Deep Sea Vessels Dock', desc: 'Sourcing agents wait at docks across Kasimedu, Thoothukudi, and Cuddalore as vessels arrive with night catches.' },
    { year: '3:30 AM', title: 'Formalin Swab Tests', desc: 'Every batch of fish undergoes rapid formaldehyde swipe strip checks to ensure zero preservation chemicals were introduced.' },
    { year: '4:15 AM', title: 'Expert Clean & Custom Cuts', desc: 'Trained coastal experts descale, clean, and make precision steaks, whole cleaned packets, or curry cuts packed inside refrigerated boxes.' },
    { year: '6:30 AM', title: 'Direct Doorstep Transit', desc: 'Insulated delivery boxes layered with crushed food-grade ice are dispatched directly to city homes inside Chennai and metropolitan nodes.' }
  ];

  return (
    <div id="about-us-coastal-story" className="py-16 bg-[#0A192F] min-h-screen relative text-left text-[#D9E2EC]">
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-[#112240] to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Direct Coastal Sourcing Model</span>
            </div>
            
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight uppercase animate-fade-in">
              Ocean Waves to kitchen flames
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-slate-300 mt-4 font-light leading-relaxed">
              Founded with a singular vision to redefine how fresh catch reaches mainland kitchens, <strong className="font-semibold text-white">KADAL 2 KADAI</strong> bridges coastal fishing crews directly to consumer homes. 
              In typical local markets, seafood transitions through 3 to 5 levels of speculative brokers, suffering chemical abuse (formalin, ammonia immersion) and days of unhygienic transport on open trucks.
            </p>

            <p className="font-sans text-sm sm:text-base text-slate-300 mt-4 font-light leading-relaxed">
              Our technology platform monitors marine catches at dawn. Within 30 minutes of landing, catch batches are graded, formalin swab checked, cut to specifications by master culinary artisans, and mapped to city transit locks on sterile, insulated flake ice, preserving original structural nutrients completely.
            </p>
          </div>

          {/* Sourcing Graphics block */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-[#112240] via-[#0A192F] to-[#1B4965] p-8 rounded-3xl border border-white/10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />
            
            <div className="flex items-center space-x-3 mb-6">
              <Ship className="w-8 h-8 text-cyan-400" />
              <span className="font-serif text-lg font-bold">Harbor Transparency Code</span>
            </div>

            <div className="space-y-6">
              {[
                { t: 'Dawn Harbor Landings', d: 'Purchased directly from boats between 2:00 AM & 4:30 AM.' },
                { t: 'Formalin SWAB Swipped', d: 'Tested and certified 100% trace chemical-free.' },
                { t: 'Custom Culinary Cuts', d: 'Cleaned, descaled, cut, & packed under cold sterile conditions.' },
                { t: 'Insulated Last-Mile Delivery', d: 'Dispatched to doorsteps in cold chambers keeping 4°C.' }
              ].map((x, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 shrink-0 font-bold font-mono text-xs border border-cyan-800">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{x.t}</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-0.5">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Timeline Layout */}
        <div id="coastal-milestones" className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold">Dawn Timeline</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white uppercase mt-2">
              Our 4-Hour Harbor Operations
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light mt-2">
              Every day, our dedicated supply network works at rapid speeds to ensure your family dines on catches docked from Tamil Nadu vessels merely hours ago.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="bg-[#112240] border border-white/5 p-6 rounded-2.5xl transition-all duration-350 hover:border-[#00B4D8]/30 relative group text-left flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-black text-[#00B4D8] block mb-2">{milestone.year}</span>
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wide group-hover:text-[#00B4D8] transition-colors">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed mt-2">
                    {milestone.desc}
                  </p>
                </div>
                
                {/* Visual arrow indicator */}
                <div className="text-right text-xs text-[#00B4D8] font-bold font-mono mt-4">
                  ➔ STEP {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fisherman Empowerment and Social Stat block */}
        <div className="bg-[#112240] border border-white/5 p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden mb-12">
          <div className="max-w-3xl mx-auto relative z-10">
            <h3 className="font-serif text-2xl font-bold text-white uppercase">Empowering Coastal Crews</h3>
            <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 font-light">
              Because we completely bypass standard speculative middle brokers, we pay our boat-crews and fishermen partners up to <strong className="font-semibold text-white">40% higher direct rates</strong> than standard auction houses. This strengthens vessel safety, child schooling support, and nets in coastal villages.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {[
                { n: '₹22M+', l: 'Distributed to Boat Crews' },
                { n: '680+', l: 'Vessels Supported' },
                { n: '4 Harbors', l: 'Active Tamil Nadu Ports' },
                { n: '100% Direct', l: 'Chemical Free Guarantee' }
              ].map((stat, idx) => (
                <div key={idx} className="p-5 bg-[#0A192F] rounded-2xl border border-white/5 shadow-sm hover:scale-102 transition duration-200">
                  <span className="block font-serif text-2xl sm:text-3xl font-black text-[#00B4D8]">{stat.n}</span>
                  <span className="block text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono font-bold mt-1 leading-snug">{stat.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
