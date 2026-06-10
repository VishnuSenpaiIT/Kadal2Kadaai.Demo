import { Star, CheckCircle2, Quote, Award } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data';

export default function ReviewsSection() {
  // Dulplicate items to create endless horizontal cycle
  const duplicatedReviews = [...CUSTOMER_REVIEWS, ...CUSTOMER_REVIEWS, ...CUSTOMER_REVIEWS];

  return (
    <section id="reviews-section" className="py-20 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="mb-16 max-w-3xl text-left">
          <div className="inline-flex items-center space-x-2 text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>100% Verified Culinary Feedback</span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase">
            What Thousands of Families Say
          </h2>
          
          <p className="font-sans text-sm sm:text-base text-white/90 mt-4 font-light leading-relaxed">
            We monitor customer satisfaction down to the single fillet. Read honest feedback from home makers, professional chefs, and seafood lovers.
          </p>
        </div>

        {/* Endless horizontally auto-scrolling row of beautiful reviews */}
        <div className="relative w-full overflow-hidden select-none py-2 focus-within:outline-none">
          {/* Edge blur layers */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] py-4">
            {duplicatedReviews.map((review, idx) => (
              <div
                key={`${review.id}-rev-${idx}`}
                id={`customer-review-${review.id}-${idx}`}
                className="inline-block w-[350px] shrink-0 bg-white/10 backdrop-blur-md rounded-2.5xl p-8 border border-white/10 hover:border-cyan-400/50 shadow-2xl mx-4 text-left transition-all duration-500 group hover:bg-white/15 hover:-translate-y-2"
              >
                {/* Quote Icon decorative */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    {/* Customer Photo */}
                    <div className="relative">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-cyan-400 transition-all duration-500"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-cyan-400 rounded-full p-0.5 border border-white/20">
                        <CheckCircle2 className="w-2.5 h-2.5 text-slate-900" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-white/70 font-sans tracking-wide">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex space-x-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-white/95 line-clamp-4 leading-relaxed font-light italic relative pl-6">
                  <Quote className="absolute left-0 top-0 w-4 h-4 text-cyan-400/30 rotate-180" />
                  {review.comment}
                </p>

                {/* Subfooter */}
                <div className="text-[10px] text-white/60 font-mono mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span>Purchased {review.date}</span>
                  <span className="text-[9px] bg-cyan-400/10 text-cyan-400 font-bold px-2 py-0.5 rounded uppercase tracking-tighter border border-cyan-400/20">
                    Trusted Sourcing
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
