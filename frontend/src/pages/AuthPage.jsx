import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Eye, EyeOff, Loader2, ChevronLeft, Mail, RefreshCw, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

// ── OTP Input — 6 boxes ────────────────────────────────────────────────────
// Refs declared at top level of the component (not inside callbacks)
const OtpInput = ({ value, onChange }) => {
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const next = [...digits];
    next[i] = char;
    onChange(next.join(''));
    if (i < 5) refs[i + 1].current?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits];
        next[i] = '';
        onChange(next.join('').trimEnd());
      } else if (i > 0) {
        refs[i - 1].current?.focus();
      }
      return;
    }
    if (e.key === 'ArrowLeft' && i > 0) refs[i - 1].current?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      onChange(pasted);
      refs[Math.min(pasted.length, 5)].current?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-xl font-bold rounded-xl border bg-[#111111] text-white transition-colors focus:outline-none
            ${d ? 'border-orange-500 text-orange-400' : 'border-white/10 focus:border-orange-500/50'}`}
        />
      ))}
    </div>
  );
};

// ── OTP Block — defined OUTSIDE AuthPage to prevent remount on every render ─
const OtpBlock = ({ email, otp, setOtp, error, loading, resendCooldown, onVerify, onResend }) => (
  <motion.div key="otp" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
    <div className="flex justify-center mb-5">
      <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
        <Mail className="w-6 h-6 text-orange-400" />
      </div>
    </div>
    <h1 className="text-2xl font-bold text-white text-center mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      Cek Email Kamu
    </h1>
    <p className="text-neutral-400 text-sm text-center mb-1">Kode OTP dikirim ke</p>
    <p className="text-orange-400 font-semibold text-sm text-center mb-7 break-all">{email}</p>

    <OtpInput value={otp} onChange={(v) => { setOtp(v); }} />

    {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

    <button
      onClick={onVerify}
      disabled={loading || otp.length < 6}
      className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Verifikasi
    </button>

    <div className="flex items-center justify-center gap-2 mt-4">
      <span className="text-neutral-500 text-sm">Tidak menerima kode?</span>
      <button
        onClick={onResend}
        disabled={loading || resendCooldown > 0}
        className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-400 disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang'}
      </button>
    </div>
  </motion.div>
);

// ── Reusable field wrapper ─────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm text-neutral-400 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-[#111111] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors";

// ── Main ───────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const location = useLocation();
  const initialMode = location.pathname === '/register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [step, setStep] = useState('form');       // register: 'form'|'otp' / forgot: 'email'|'otp'|'newpass'

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const reset = (newMode) => {
    setMode(newMode);
    setStep(newMode === 'forgot' ? 'email' : 'form');
    setError('');
    setSuccessMsg('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForm({ name: '', phone: '', email: '', password: '' });
    if (newMode === 'login') navigate('/login', { replace: true });
    else if (newMode === 'register') navigate('/register', { replace: true });
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: form.email, password: form.password,
      });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.access_token);
      storage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.');
    } finally { setLoading(false); }
  };

  // ── Register: send OTP ───────────────────────────────────────────────────
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
        name: form.name, email: form.email,
        password: form.password, phone: form.phone,
      });
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal mengirim OTP. Coba lagi.');
    } finally { setLoading(false); }
  };

  // ── Register: verify OTP ─────────────────────────────────────────────────
  const handleRegisterVerify = async () => {
    if (otp.length < 6) { setError('Masukkan 6 digit kode OTP.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
        email: form.email, otp,
      });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Verifikasi gagal.');
    } finally { setLoading(false); }
  };

  // ── Register: resend OTP ─────────────────────────────────────────────────
  const handleRegisterResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
        name: form.name, email: form.email,
        password: form.password, phone: form.phone,
      });
      setOtp('');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal kirim ulang OTP.');
    } finally { setLoading(false); }
  };

  // ── Forgot: send OTP ─────────────────────────────────────────────────────
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email: form.email });
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.');
    } finally { setLoading(false); }
  };

  // ── Forgot: verify OTP → show new password form ──────────────────────────
  const handleForgotVerifyOtp = () => {
    if (otp.length < 6) { setError('Masukkan 6 digit kode OTP.'); return; }
    setStep('newpass');
    setError('');
  };

  // ── Forgot: resend OTP ───────────────────────────────────────────────────
  const handleForgotResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email: form.email });
      setOtp('');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal kirim ulang OTP.');
    } finally { setLoading(false); }
  };

  // ── Forgot: reset password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError('Password minimal 8 karakter.'); return; }
    if (newPassword !== confirmPassword) { setError('Password tidak sama.'); return; }
    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email: form.email, otp, new_password: newPassword,
      });
      setSuccessMsg('Password berhasil diubah! Silakan masuk.');
      setTimeout(() => reset('login'), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal reset password.');
      if (err.response?.data?.detail?.includes('OTP')) setStep('otp');
    } finally { setLoading(false); }
  };

  // ── Back ─────────────────────────────────────────────────────────────────
  const handleBack = () => {
    if (step === 'otp' || step === 'newpass') {
      setStep(mode === 'forgot' ? 'email' : 'form');
      setOtp(''); setError('');
    } else {
      navigate('/');
    }
  };

  const backLabel = () => {
    if (step === 'otp' || step === 'newpass') return 'Ubah data';
    if (mode === 'register') return 'Ke Home';
    return 'Kembali';
  };

  // Unique key for AnimatePresence to distinguish screens
  const screenKey = `${mode}-${step}`;

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-5 py-12">
      <button onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" />
        {backLabel()}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="bg-orange-500 p-1.5 rounded-lg">
          <Dumbbell className="w-4 h-4 text-black" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</span>
          <span className="text-orange-500 text-[9px] font-semibold tracking-widest uppercase">Train. Eat. Sleep.</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
        <AnimatePresence mode="wait">

          {/* ── Login ── */}
          {screenKey === 'login-form' && (
            <motion.div key="login-form" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Selamat datang kembali</h1>
              <p className="text-neutral-400 text-sm mb-7">Masuk untuk lanjut program kamu.</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <Field label="Email">
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    required placeholder="email@kamu.com" className={inputCls} />
                </Field>
                <Field label="Password">
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                      onChange={handleChange} required placeholder="Password kamu" minLength={8}
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button type="button" onClick={() => reset('forgot')}
                    className="text-xs text-orange-500 hover:text-orange-400 transition-colors mt-1.5 block">
                    Lupa password?
                  </button>
                </Field>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-400">Ingat saya</span>
                </label>

                {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Masuk
                </button>
              </form>
              <p className="text-center text-sm text-neutral-500 mt-6">
                Belum punya akun?{' '}
                <button onClick={() => reset('register')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">Daftar</button>
              </p>
            </motion.div>
          )}

          {/* ── Register — Form ── */}
          {screenKey === 'register-form' && (
            <motion.div key="register-form" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Buat akun baru</h1>
              <p className="text-neutral-400 text-sm mb-7">Daftar dan mulai transformasi 3 bulanmu.</p>
              <form onSubmit={handleRegisterSendOtp} className="space-y-4">
                <Field label="Nama lengkap">
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    required placeholder="Nama kamu" className={inputCls} />
                </Field>
                <Field label="Nomor telepon">
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    required placeholder="08xxxxxxxxxx"
                    pattern="08[0-9]{8,12}"
                    title="Nomor harus diawali 08 dan minimal 10 digit"
                    className={inputCls} />
                </Field>
                <Field label="Email">
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    required placeholder="email@kamu.com" className={inputCls} />
                </Field>
                <Field label="Password">
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                      onChange={handleChange} required placeholder="Minimal 8 karakter" minLength={8}
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setAgreedToTerms(v => !v)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                        agreedToTerms
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-transparent border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {agreedToTerms && (
                        <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-neutral-400 text-xs leading-relaxed">
                    Dengan mendaftar, saya menyetujui{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
                      Syarat &amp; Ketentuan
                    </a>{' '}
                    dan{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
                      Kebijakan Privasi
                    </a>{' '}
                    3PM System.
                  </span>
                </label>

                {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lanjut Verifikasi →
                </button>
              </form>
              <p className="text-center text-sm text-neutral-500 mt-6">
                Sudah punya akun?{' '}
                <button onClick={() => reset('login')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">Masuk</button>
              </p>
            </motion.div>
          )}

          {/* ── Register — OTP ── */}
          {screenKey === 'register-otp' && (
            <OtpBlock
              key="register-otp"
              email={form.email}
              otp={otp}
              setOtp={setOtp}
              error={error}
              loading={loading}
              resendCooldown={resendCooldown}
              onVerify={handleRegisterVerify}
              onResend={handleRegisterResend}
            />
          )}

          {/* ── Forgot — Email ── */}
          {screenKey === 'forgot-email' && (
            <motion.div key="forgot-email" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Lupa Password?</h1>
              <p className="text-neutral-400 text-sm text-center mb-7">Masukkan email kamu. Kami akan kirim kode OTP untuk reset password.</p>
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <Field label="Email">
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    required placeholder="email@kamu.com" className={inputCls} />
                </Field>
                {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Kirim Kode OTP
                </button>
              </form>
              <p className="text-center text-sm text-neutral-500 mt-6">
                Ingat password?{' '}
                <button onClick={() => reset('login')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">Masuk</button>
              </p>
            </motion.div>
          )}

          {/* ── Forgot — OTP ── */}
          {screenKey === 'forgot-otp' && (
            <OtpBlock
              key="forgot-otp"
              email={form.email}
              otp={otp}
              setOtp={setOtp}
              error={error}
              loading={loading}
              resendCooldown={resendCooldown}
              onVerify={handleForgotVerifyOtp}
              onResend={handleForgotResend}
            />
          )}

          {/* ── Forgot — New Password ── */}
          {screenKey === 'forgot-newpass' && (
            <motion.div key="forgot-newpass" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Password Baru</h1>
              <p className="text-neutral-400 text-sm mb-7">Buat password baru untuk akun kamu.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Field label="Password baru">
                  <div className="relative">
                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setError(''); }}
                      required placeholder="Minimal 8 karakter" minLength={8}
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowNewPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Konfirmasi password">
                  <input type="password" value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    required placeholder="Ulangi password baru" className={inputCls} />
                </Field>
                {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                {successMsg && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-center">{successMsg}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Password Baru
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <a href="/terms" className="text-neutral-500 hover:text-orange-400 text-xs transition-colors">Syarat &amp; Ketentuan</a>
        <span className="text-neutral-700 text-xs">·</span>
        <a href="/privacy" className="text-neutral-500 hover:text-blue-400 text-xs transition-colors">Kebijakan Privasi</a>
        <span className="text-neutral-700 text-xs">·</span>
        <a href="/refund" className="text-neutral-500 hover:text-green-400 text-xs transition-colors">Kebijakan Refund</a>
      </div>
    </div>
  );
}
