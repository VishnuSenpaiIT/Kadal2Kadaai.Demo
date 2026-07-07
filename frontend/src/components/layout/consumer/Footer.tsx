'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePublicSettings } from '@/shared/api/hooks/useSettings';

export function ConsumerFooter() {
  const { data: settings } = usePublicSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aboutText = mounted && settings?.footer_about ? settings.footer_about : "The premium South Indian marine commerce platform. From the harbor directly to your kitchen, experiencing the real taste of the coast.";
  const addressText = mounted && settings?.footer_address ? settings.footer_address : "No. 12, Beach Road, Marina District, Chennai, Tamil Nadu 600001";
  const phoneText = mounted && settings?.footer_phone ? settings.footer_phone : "+91 73059 29555";
  const emailText = mounted && settings?.footer_email ? settings.footer_email : "support@kadal2kadaai.com";

  return (
    <footer className="relative bg-gradient-to-br from-[#05162e] via-[#0c2b55] to-[#144272] dark:from-slate-950 dark:to-slate-900 text-slate-100 pt-16 pb-8 mt-auto overflow-hidden border-t border-white/10">
      {/* Decorative Wave Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0 translate-x-1/4 translate-y-1/4"></div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo_croped.jpeg" alt="Kadal2Kadaai Logo" className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md" />
              <h3 className="font-heading text-2xl font-black text-white tracking-wider leading-none">
                KADAL<span className="text-sky-400">2</span>KADAAI
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm transition-opacity duration-300 font-medium font-sans">
              {aboutText}
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors border border-white/10 shadow-sm text-slate-200" title="Facebook">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors border border-white/10 shadow-sm text-slate-200" title="Instagram">
                <svg className="h-4.5 w-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-400 hover:text-white transition-colors border border-white/10 shadow-sm text-slate-200" title="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-sky-400 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-300">
              <li><Link href="/contact" className="hover:text-sky-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-sky-400/50 group-hover:bg-sky-300"></span> Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-sky-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-sky-400/50 group-hover:bg-sky-300"></span> FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-sky-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-sky-400/50 group-hover:bg-sky-300"></span> Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sky-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-sky-400/50 group-hover:bg-sky-300"></span> Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-sky-400 rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-sm font-semibold text-slate-300">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                  <MapPin className="h-5 w-5 text-sky-400" />
                </div>
                <span className="mt-2 transition-opacity duration-300 text-slate-300 font-medium font-sans">{addressText}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                  <Phone className="h-5 w-5 text-sky-400" />
                </div>
                <span className="transition-opacity duration-300 text-slate-300 font-medium font-sans">{phoneText}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                  <Mail className="h-5 w-5 text-sky-400" />
                </div>
                <span className="transition-opacity duration-300 text-slate-300 font-medium font-sans">{emailText}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <p>© {new Date().getFullYear()} Kadal2Kadaai. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
