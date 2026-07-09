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
    <footer className="bg-blue-950 text-blue-50 pt-12 pb-6 mt-auto border-t border-blue-900">
      <Container>
        {/* Top Section: Logo & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo_croped.jpeg" alt="Kadal2Kadaai Logo" className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-blue-400/30" />
            <h3 className="font-heading text-2xl font-black text-white tracking-widest">
              KADAL<span className="text-4xl">2</span>KADAAI
            </h3>
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Facebook">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 hover:bg-pink-500 hover:text-white transition-all shadow-sm" title="Instagram">
              <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 hover:bg-sky-400 hover:text-white transition-all shadow-sm" title="Twitter">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-800 to-transparent mb-8"></div>

        {/* Middle Section: About, Support, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          {/* About */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-4 text-base uppercase tracking-wider text-blue-200">About Us</h4>
            <p className="text-sm text-blue-200/80 leading-relaxed max-w-sm font-medium">
              {aboutText}
            </p>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-4 text-base uppercase tracking-wider text-blue-200">Support</h4>
            <ul className="space-y-2 text-sm font-medium text-blue-200/80">
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-blue-400 transition-colors">Terms and Condition</Link></li>
              <li><Link href="/privacy-and-policy" className="hover:text-blue-400 transition-colors">Privacy and Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-4 text-base uppercase tracking-wider text-blue-200">Contact Info</h4>
            <ul className="space-y-3 text-sm font-medium text-blue-200/80">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                <span>{addressText}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <span>{phoneText}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <span>{emailText}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-blue-900/50 pt-6 flex flex-col items-center justify-center gap-2 text-xs font-semibold text-blue-400/60">
          <p>© {new Date().getFullYear()} Kadal2Kadaai. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
