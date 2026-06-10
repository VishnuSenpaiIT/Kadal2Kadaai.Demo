import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Eye, EyeOff, KeyRound, CheckCircle, Home } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Very Weak', color: 'bg-rose-500' });

  // Fields and states for registration / Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up extra fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Admin simulation switch for testing
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(true);

  // Analyze password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'None', color: 'bg-slate-300' });
      return;
    }

    let rawScore = 0;
    if (password.length >= 6) rawScore += 1;
    if (password.length >= 10) rawScore += 1;
    if (/[A-Z]/.test(password)) rawScore += 1;
    if (/[0-9]/.test(password)) rawScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) rawScore += 1;

    let text = 'Weak';
    let color = 'bg-rose-500';

    if (rawScore >= 4) {
      text = 'Secure & Premium';
      color = 'bg-emerald-500';
    } else if (rawScore >= 3) {
      text = 'Strong';
      color = 'bg-teal-500';
    } else if (rawScore >= 2) {
      text = 'Moderate';
      color = 'bg-amber-500';
    }

    setPasswordStrength({ score: rawScore, text, color });
  }, [password]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email structure.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (isSignUp) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
      
      if (!contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required.';
      } else if (!/^[0-9]{10}$/.test(contactNumber.replace(/[^0-9]/g, ''))) {
        newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
      }

      if (!district.trim()) newErrors.district = 'District is required.';
      if (!locality.trim()) newErrors.locality = 'Locality is required.';
      if (!address.trim()) newErrors.address = 'Street address is required.';

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const emailLower = email.toLowerCase().trim();
    // Auto-detect admin role on specific credentials
    const shouldBeAdmin = isAdminLogin || emailLower === 'admin@kadal2kadai.com' || emailLower.startsWith('admin');

    if (isSignUp) {
      onSuccess({
        isAuthenticated: true,
        username: `${firstName} ${lastName}`.trim(),
        email: emailLower,
        phoneNumber: contactNumber,
        location: `${locality}, ${district}`,
        firstName,
        lastName,
        district,
        locality,
        address,
        isAdmin: shouldBeAdmin
      });
    } else {
      // Login - split name from email, set simulated details
      const derivedUsername = emailLower === 'admin@kadal2kadai.com' ? 'System Administrator' : emailLower.split('@')[0];
      onSuccess({
        isAuthenticated: true,
        username: derivedUsername,
        email: emailLower,
        phoneNumber: '9876543210',
        location: 'Adyar, Chennai',
        firstName: derivedUsername,
        lastName: '',
        district: 'Chennai',
        locality: 'Adyar',
        address: 'No 15, Beach Road, Adyar',
        isAdmin: shouldBeAdmin
      });
    }
  };

  const handleQuickDemoFill = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@kadal2kadai.com');
      setPassword('admin123');
      setIsAdminLogin(true);
      setIsSignUp(false);
    } else {
      setEmail('varshini@gmail.com');
      setPassword('user123');
      setIsAdminLogin(false);
      setIsSignUp(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#0B1120] text-white p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating background gradient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-serif text-sm font-bold tracking-wider text-slate-100">
            KADAL 2 KADAI <span className="text-cyan-400">• SECURE GATEWAY</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-350">
          {isSignUp ? "Join Seafood Network" : "Partner / Customer Sign In"}
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          {isSignUp
            ? "Configure your precise delivery address coordinates to unlock fresh sunrise arrivals."
            : "Sign in to manage and view your custom fish orders and transaction history."}
        </p>

        {/* Quick Demo Assist */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl my-4 text-xs space-y-2">
          <span className="block font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Demo Quick Access</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-cyan-500/25 transition cursor-pointer"
            >
              Fill System Admin Credentials
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('customer')}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-blue-500/25 transition cursor-pointer"
            >
              Fill Customer Account Credentials
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {isSignUp ? (
            /* ================= SIGN UP FORM ================= */
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">First Name</label>
                  <div className="relative">
                    <input
                      id="signup-firstname-field"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.firstName && <span className="text-[10px] text-rose-400 block mt-1">{errors.firstName}</span>}
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Last Name</label>
                  <div className="relative">
                    <input
                      id="signup-lastname-field"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.lastName && <span className="text-[10px] text-rose-400 block mt-1">{errors.lastName}</span>}
                </div>
              </div>

              {/* Contact Number & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Contact Number</label>
                  <div className="relative">
                    <input
                      id="signup-contact-field"
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.contactNumber && <span className="text-[10px] text-rose-400 block mt-1">{errors.contactNumber}</span>}
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">District</label>
                  <div className="relative">
                    <select
                      id="signup-district-dropdown"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white focus:outline-none cursor-pointer transition font-sans appearance-none"
                    >
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Trichy">Trichy</option>
                      <option value="Salem">Salem</option>
                      <option value="Thoothukudi">Thoothukudi</option>
                      <option value="Cuddalore">Cuddalore</option>
                      <option value="Pondicherry">Pondicherry</option>
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Locality */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Locality</label>
                <div className="relative">
                  <input
                    id="signup-locality-field"
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Adyar / RS Puram / Anna Nagar"
                    className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                  />
                  <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                {errors.locality && <span className="text-[10px] text-rose-400 block mt-1">{errors.locality}</span>}
              </div>

              {/* Address */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Full Delivery Address</label>
                <textarea
                  id="signup-address-field"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, door number, landmarks..."
                  className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                />
                {errors.address && <span className="text-[10px] text-rose-400 block mt-1">{errors.address}</span>}
              </div>

              {/* Email Block */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    id="signup-email-field"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                {errors.email && <span className="text-[10px] text-rose-400 block mt-1">{errors.email}</span>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password-field"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="signup-confirm-field"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 pl-9 text-white placeholder-gray-500 focus:outline-none transition font-sans"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.confirmPassword && <span className="text-[10px] text-rose-400 block mt-1">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-1">
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest"><KeyRound className="w-3 h-3 text-cyan-400" /> Password Strength</span>
                    <span className="font-mono text-cyan-300 font-bold uppercase">{passwordStrength.text}</span>
                  </div>
                  <div className="flex h-1 gap-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ================= SIGN IN FORM ================= */
            <div className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    id="signin-email-field"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chef@kadal2kadai.com"
                    className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition-colors font-sans"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                {errors.email && <span className="text-[10px] text-rose-400 block mt-1">{errors.email}</span>}
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Password</label>
                <div className="relative">
                  <input
                    id="signin-password-field"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 rounded-lg px-3.5 py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none transition-colors font-sans"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[10px] text-rose-400 block mt-1">{errors.password}</span>}
              </div>

              {/* Testing Admin checkbox helper */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-450 hover:text-white cursor-pointer select-none text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/5 border-white/15 text-cyan-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>

                <label className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAdminLogin}
                    onChange={(e) => setIsAdminLogin(e.target.checked)}
                    className="rounded bg-white/5 border-white/15 text-cyan-600 focus:ring-0 cursor-pointer text-cyan-500"
                  />
                  <span>Elevate to System Admin</span>
                </label>
              </div>

            </div>
          )}

          {/* Global Password Reveal Option */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[11px] text-slate-400 hover:text-slate-100 flex items-center gap-1 focus:outline-none bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/40 transition hover:scale-[1.01] cursor-pointer focus:outline-none"
          >
            {isSignUp ? "Launch Account Coordinates" : "Authorisation Entry"}
          </button>
        </form>

        {/* Footnote Toggle */}
        <div className="text-center mt-6 pt-5 border-t border-white/10 text-xs text-slate-400 font-sans">
          <span>{isSignUp ? "Already have an account? " : "New to Kadal 2 Kadai? "}</span>
          <button
            id="auth-toggle-signup-signin-btn"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline bg-transparent border-none focus:outline-none ml-1 cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign Up For Free"}
          </button>
        </div>

      </div>
    </div>
  );
}
