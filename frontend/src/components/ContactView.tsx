import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ContactView() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', role: 'Household', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '', role: 'Household', phone: '' });
    }, 6000);
  };

  return (
    <div id="contact-us-coastal-headquarters" className="py-16 bg-[#0A192F] min-h-screen relative text-left">
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-[#112240] to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-455 text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full">
            Coastal Support Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase mt-4">
            Connect With Harbor Command
          </h1>
          <p className="text-sm text-slate-300 font-light mt-2 leading-relaxed">
            Settle chef orders, report transit anomalies, or request pre-booking slot configurations with our master dispatchers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Coordinate items */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-black text-white uppercase">
                Direct Sourcing Desk
              </h2>
              <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 font-light leading-relaxed">
                Got a bulk culinary inquiry, commercial catering requirements, or need assistance booking early dawn Seer fish quantities? Our coordinators respond promptly.
              </p>
            </div>

            <div className="space-y-4 pt-4 text-xs font-sans">
              
              {/* Phone coordinate */}
              <div className="bg-[#112240] p-5 rounded-2.5xl border border-white/5 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-[#00B4D8] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">Order Helpdesk Route</h4>
                  <p className="text-sm font-bold text-white mt-1">+91 44 2843 3920</p>
                  <p className="text-slate-300 mt-0.5 leading-none">Dawn Dispatch Hours: 5:00 AM – 3:00 PM Daily</p>
                </div>
              </div>

              {/* Email coordinate */}
              <div className="bg-[#112240] p-5 rounded-2.5xl border border-white/5 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-[#00B4D8] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">Digital Ticket Coordinate</h4>
                  <p className="text-sm font-bold text-white mt-1">coordinator@kadal2kadai.com</p>
                  <p className="text-slate-300 mt-0.5 leading-none">Email assistance responses under 45 minutes.</p>
                </div>
              </div>

              {/* Location coordinate */}
              <div className="bg-[#112240] p-5 rounded-2.5xl border border-white/5 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-[#00B4D8] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">Kasimedu Packing Dock Room</h4>
                  <p className="text-sm font-bold text-white mt-1">Gate No. 4, Marina Fishing Jetty</p>
                  <p className="text-slate-300 mt-0.5 leading-tight">Royapuram Depot, Chennai, Tamil Nadu - 600013</p>
                </div>
              </div>

            </div>

            {/* Glowing active dispatcher badge */}
            <div className="bg-[#112240] text-white rounded-2.5xl p-6 border border-white/10 flex items-center space-x-4">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-405 bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#00B4D8] uppercase tracking-widest block">Live Dispatcher Control</span>
                <p className="text-[11px] text-slate-300 font-light mt-0.5 leading-relaxed">
                  Our Chennai central server is online. Current transit temperature levels across insulated containers are verified at standard 3.8°C.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Simulated fully-interactive contact coordinates form */}
          <div className="lg:col-span-7 bg-[#112240] p-6 sm:p-8 rounded-3xl border border-white/5 shadow-sm relative">
            
            {contactSubmitted ? (
              <div className="py-20 text-center animate-fade-in flex flex-col items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-450 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-white uppercase">Transmission Received!</h3>
                <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-[#00B4D8]">{formData.name}</span>! Our logistics desk has received your coordinates and query (Ref: #HCD-{Math.floor(1000 + Math.random() * 9000)}). Our chief officer will call you back on your registered phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white border-b border-white/5 pb-3 uppercase tracking-wide">
                  Transmit Vessel inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Varshini K"
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. varshini@example.com"
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Your Culinary Profile</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white"
                    >
                      <option value="Household">Regular Household Buyer</option>
                      <option value="Chef">Executive Restaurant Chef</option>
                      <option value="Bulk">Wholesale Trader / Caterer</option>
                      <option value="Fisherman">Fisherman wanting to register a vessel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Subject of Inquiry</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Pre-ordering heavy King Seer slices"
                    className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Your Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Detailed species requirements, cut specifications, or delivery addresses..."
                    className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] font-sans text-white placeholder-slate-500"
                  ></textarea>
                </div>

                <div className="text-[10px] text-slate-400 flex items-start space-x-1 px-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
                  <span>By submitting, you agree to secure callback communications on your registered mobile coordinates.</span>
                </div>

                <button
                  id="submit-contact-coordinates-form-btn"
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00B4D8] to-blue-600 hover:from-[#48CAE4] hover:to-blue-500 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow shadow-blue-500/10 hover:scale-101 cursor-pointer focus:outline-none"
                >
                  <Send className="w-4 h-4" />
                  <span>Direct Transmit Inquiry</span>
                </button>

              </form>
            )}
            
          </div>

        </div>

      </div>
    </div>
  );
}
