import React from 'react';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { Mail, Phone, MapPin } from 'lucide-react';

export function ConsumerFooter() {
  return (
    <footer className="bg-primary-900 text-primary-50 pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <h3 className="font-heading text-h5 font-bold text-white">Kadal2Kadaai</h3>
            <p className="text-bodyMedium text-primary-200 leading-relaxed">
              The premium South Indian marine commerce platform connecting fresh catches directly to your kitchen.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-primary-300 hover:text-white transition-colors font-medium">FB</a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors font-medium">TW</a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors font-medium">IG</a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors font-medium">IN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Categories</h4>
            <ul className="space-y-3 text-bodyMedium text-primary-200">
              <li><Link href="/categories/seawater" className="hover:text-accent-300 transition-colors">Seawater Fish</Link></li>
              <li><Link href="/categories/freshwater" className="hover:text-accent-300 transition-colors">Freshwater Fish</Link></li>
              <li><Link href="/categories/shellfish" className="hover:text-accent-300 transition-colors">Crabs & Shellfish</Link></li>
              <li><Link href="/categories/dry-fish" className="hover:text-accent-300 transition-colors">Dry Fish</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-bodyMedium text-primary-200">
              <li><Link href="/contact" className="hover:text-accent-300 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-accent-300 transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-accent-300 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-accent-300 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-bodyMedium text-primary-200">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent-400 shrink-0 mt-0.5" />
                <span>123 Coastal Highway, Chennai Harbor, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-400 shrink-0" />
                <span>support@kadal2kadaai.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-bodySmall text-primary-400">
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
