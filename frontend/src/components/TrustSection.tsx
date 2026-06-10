import { Anchor, ShieldAlert, Award, Droplets, Utensils, Zap } from 'lucide-react';

export default function TrustSection() {
  return (
    <section id="trust-section" className="py-20 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Award className="w-3.5 h-3.5" />
            <span>Uncompromising Commitment</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase">
            Why Thousands of Families Trust Us
          </h2>
          <p className="font-sans text-sm sm:text-base text-white mt-4 font-light leading-relaxed">
            By completely eliminating middlemen brokers, we pay fishermen up to 40% more while delivering pristine, chemical-free marine delicacies to your table in unmatched time.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Direct From Fishermen */}
          <div
            id="trust-card-direct-fishermen"
            className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/30 text-left transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Elegant SVG/CSS illustration instead of rigid image */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-all duration-500">
              <Anchor className="w-8 h-8 text-white" />
              <div className="absolute -inset-1 rounded-2xl bg-cyan-400 opacity-0 group-hover:opacity-30 blur-md transition-all" />
            </div>

            <h3 className="font-serif text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              Direct From Fishermen
            </h3>
            <p className="font-sans text-xs text-cyan-300 font-bold uppercase tracking-wider mt-1.5 font-mono">
              Traceable Harbor Network
            </p>
            <p className="font-sans text-sm text-white/90 mt-4 font-light leading-relaxed">
              Every catch is tagged with the primary catcher boat's name and registration number. Track your fish from the nets of Tamil Nadu's brave coastal fishermen directly to your plate.
            </p>

            <ul className="mt-6 space-y-3">
              {['Fair-price payouts direct to crew', 'Sourced via eco-friendly hook & line', 'No harbor middlemen manipulation'].map((pt, i) => (
                <li key={i} className="flex items-center space-x-3 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 group-hover:animate-pulse" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Fresh Every Morning */}
          <div
            id="trust-card-fresh-morning"
            className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/30 text-left transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all duration-500">
              <Droplets className="w-8 h-8 text-white" />
              <div className="absolute -inset-1 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-30 blur-md transition-all" />
            </div>

            <h3 className="font-serif text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              Fresh Every Morning
            </h3>
            <p className="font-sans text-xs text-cyan-300 font-bold uppercase tracking-wider mt-1.5 font-mono">
              Cold-Chain Distribution
            </p>
            <p className="font-sans text-sm text-white/90 mt-4 font-light leading-relaxed">
              Catches arrive at our cold processing bays by 3:00 AM on flake ice. They are sliced, sanitized, vacuum-packed, and dispatched within minutes. We never freeze or thaw!
            </p>

            <ul className="mt-6 space-y-3">
              {['Dispatched on 100% sterile flake ice', 'Shipped in insulated box containers', 'Under 4 hours door-to-door transit'].map((pt, i) => (
                <li key={i} className="flex items-center space-x-3 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 group-hover:animate-pulse" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Quality Inspected */}
          <div
            id="trust-card-quality-inspected"
            className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/30 text-left transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all duration-500">
              <ShieldAlert className="w-8 h-8 text-white" />
              <div className="absolute -inset-1 rounded-2xl bg-emerald-400 opacity-0 group-hover:opacity-30 blur-md transition-all" />
            </div>

            <h3 className="font-serif text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              Quality Inspected
            </h3>
            <p className="font-sans text-xs text-cyan-300 font-bold uppercase tracking-wider mt-1.5 font-mono">
              100% Chemical-Free
            </p>
            <p className="font-sans text-sm text-white/90 mt-4 font-light leading-relaxed">
              Standard market fish is often dipped in toxic formalin or ammonia to prolong life. Every batch at Kadal 2 Kadai undergoes a tight swab test to guarantee zero chemical additives.
            </p>

            <ul className="mt-6 space-y-3">
              {['Rigorous 3-step formalin swab test', 'Certified grade water for washing', 'Clean, ISO-certified cutting facility'].map((pt, i) => (
                <li key={i} className="flex items-center space-x-3 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 group-hover:animate-pulse" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
