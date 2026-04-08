import { useEffect, useMemo, useState } from 'react';
import { X, Lock, Mail, Hash, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo3.png';
import {
  login,
  requestActivationOtp,
  requestForgotPasswordOtp,
  verifyActivationOtp,
  verifyForgotPasswordOtp,
} from '../../services/authService';

const MODES = { LOGIN: 'login', ACTIVATE: 'activate', FORGOT: 'forgot' };

const initialForms = {
  login: { identifier: '', password: '' },
  activateRequest: { idNumber: '', email: '' },
  activateVerify: { otp: '', password: '' },
  forgotRequest: { email: '' },
  forgotVerify: { otp: '', newPassword: '' },
};

const createInitialForms = () => ({
  login: { ...initialForms.login },
  activateRequest: { ...initialForms.activateRequest },
  activateVerify: { ...initialForms.activateVerify },
  forgotRequest: { ...initialForms.forgotRequest },
  forgotVerify: { ...initialForms.forgotVerify },
});

const AuthModal = ({ isOpen, onClose, onAuthenticated, initialMode = MODES.LOGIN }) => {
  const [mode, setMode] = useState(MODES.LOGIN);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [forms, setForms] = useState(createInitialForms());
  const [activationStep, setActivationStep] = useState(1);
  const [forgotStep, setForgotStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setMode(MODES.LOGIN);
      setForms(createInitialForms());
      setActivationStep(1);
      setForgotStep(1);
      setLoading(false);
      setError('');
      setMessage('');
      return;
    }

    setForms(createInitialForms());
    setMode(initialMode);
    setActivationStep(1);
    setForgotStep(1);
    setLoading(false);
    setError('');
    setMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const updateForm = (key, field, value) => {
    setForms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setActivationStep(1);
    setForgotStep(1);
    resetFeedback();
  };

  const onLogin = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      onAuthenticated(await login(forms.login));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dev-only quick login (bypasses real auth for testing without PostgreSQL)
  const onDevLogin = async (role) => {
    resetFeedback();
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/auth/dev-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Dev login failed');
      onAuthenticated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRequestActivationOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      await requestActivationOtp(forms.activateRequest);
      setActivationStep(2);
      setMessage('OTP sent to your email. Enter it below.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyActivationOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      onAuthenticated(await verifyActivationOtp({ ...forms.activateRequest, ...forms.activateVerify }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRequestForgotOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      await requestForgotPasswordOtp(forms.forgotRequest);
      setForgotStep(2);
      setMessage('If your account exists, a reset code was sent.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyForgotOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      await verifyForgotPasswordOtp({ email: forms.forgotRequest.email, ...forms.forgotVerify });
      setMessage('Password updated. Please sign in.');
      switchMode(MODES.LOGIN);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const meta = {
    [MODES.LOGIN]: { title: 'Welcome back', sub: 'Sign in to your UniHelp account' },
    [MODES.ACTIVATE]: { title: 'Activate account', sub: 'Set up your student access' },
    [MODES.FORGOT]: { title: 'Reset password', sub: 'We will email you a recovery code' },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>

        <div className="px-7 pt-7 pb-5 relative">
          <div className="text-center">
            <img
              src={logo}
              alt="UniHelp"
              className="w-20 h-8 object-contain mx-auto mb-4"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-[22px] font-bold text-gray-900 leading-tight">{meta[mode].title}</h2>
            <p className="text-[13px] text-gray-400 mt-1">{meta[mode].sub}</p>
          </div>
          <button
            onClick={() => {
              setMode(MODES.LOGIN);
              setForms(createInitialForms());
              setActivationStep(1);
              setForgotStep(1);
              setLoading(false);
              setError('');
              setMessage('');
              onClose();
            }}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-7 pb-7 space-y-3">
          {error && (
            <div className="flex gap-2.5 items-start px-3.5 py-3 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-red-700 leading-snug">{error}</p>
            </div>
          )}

          {message && (
            <div className="flex gap-2.5 items-start px-3.5 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-emerald-700 leading-snug">{message}</p>
            </div>
          )}

          {mode === MODES.LOGIN && (
            <LoginForm
              forms={forms}
              updateForm={updateForm}
              loading={loading}
              onLogin={onLogin}
              onForgot={() => switchMode(MODES.FORGOT)}
              onActivate={() => switchMode(MODES.ACTIVATE)}
              onDevLogin={onDevLogin}
            />
          )}

          {mode === MODES.ACTIVATE && (
            <ActivateForm
              forms={forms}
              updateForm={updateForm}
              loading={loading}
              step={activationStep}
              onStep1={onRequestActivationOtp}
              onStep2={onVerifyActivationOtp}
              onLogin={() => switchMode(MODES.LOGIN)}
            />
          )}

          {mode === MODES.FORGOT && (
            <ForgotForm
              forms={forms}
              updateForm={updateForm}
              loading={loading}
              step={forgotStep}
              onStep1={onRequestForgotOtp}
              onStep2={onVerifyForgotOtp}
              onLogin={() => switchMode(MODES.LOGIN)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ forms, updateForm, loading, onLogin, onForgot, onActivate, onDevLogin }) => (
  <form className="space-y-3" onSubmit={onLogin}>
    <Field icon={Mail} label="University email or ID" type="text" placeholder="you@university.edu or STU001" value={forms.login.identifier} onChange={(value) => updateForm('login', 'identifier', value)} required />
    <PasswordField label="Password" placeholder="Enter your password" value={forms.login.password} onChange={(value) => updateForm('login', 'password', value)} required />

    <div className="flex items-center justify-between gap-3 pt-1">
      <button type="button" onClick={onActivate} className="text-[12px] text-slate-500 hover:text-slate-700 font-medium">
        Need activation?
      </button>
      <button type="button" onClick={onForgot} className="text-[12px] text-blue-600 hover:underline font-medium">
        Forgot password?
      </button>
    </div>

    <SubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />

    {/* Dev-only quick login buttons (remove in production) */}
    {onDevLogin && (
      <div className="pt-3 border-t border-dashed border-slate-200 mt-3">
        <p className="text-[10px] text-slate-400 text-center mb-2 uppercase tracking-wider">Dev Quick Login</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onDevLogin('student')} className="flex-1 text-xs py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors">Student</button>
          <button type="button" onClick={() => onDevLogin('lecturer')} className="flex-1 text-xs py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors">Lecturer</button>
          <button type="button" onClick={() => onDevLogin('admin')} className="flex-1 text-xs py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">Admin</button>
        </div>
      </div>
    )}
  </form>
);

const ActivateForm = ({ forms, updateForm, loading, step, onStep1, onStep2, onLogin }) => (
  <form className="space-y-3" onSubmit={step === 1 ? onStep1 : onStep2}>
    <StepBadge step={step} total={2} labels={['Verify identity', 'Set password']} />

    {step === 1 ? (
      <>
        <Field icon={Hash} label="Student ID" placeholder="e.g. STU001" value={forms.activateRequest.idNumber} onChange={(value) => updateForm('activateRequest', 'idNumber', value)} required />
        <Field icon={Mail} label="University email" type="email" placeholder="you@university.edu" value={forms.activateRequest.email} onChange={(value) => updateForm('activateRequest', 'email', value)} required />
        <SubmitButton loading={loading} label="Send OTP" loadingLabel="Sending…" color="indigo" />
      </>
    ) : (
      <>
        <OtpField value={forms.activateVerify.otp} onChange={(value) => updateForm('activateVerify', 'otp', value)} />
        <PasswordField label="Create password" placeholder="Minimum 8 characters" value={forms.activateVerify.password} onChange={(value) => updateForm('activateVerify', 'password', value)} required />
        <SubmitButton loading={loading} label="Activate Account" loadingLabel="Activating…" color="indigo" />
      </>
    )}

    <div className="pt-1 text-center">
      <button type="button" onClick={onLogin} className="text-[12px] text-slate-500 hover:text-slate-700 font-medium">
        Back to sign in
      </button>
    </div>
  </form>
);

const ForgotForm = ({ forms, updateForm, loading, step, onStep1, onStep2, onLogin }) => (
  <form className="space-y-3" onSubmit={step === 1 ? onStep1 : onStep2}>
    <StepBadge step={step} total={2} labels={['Find account', 'New password']} color="violet" />

    {step === 1 ? (
      <>
        <Field icon={Mail} label="University email" type="email" placeholder="you@university.edu" value={forms.forgotRequest.email} onChange={(value) => updateForm('forgotRequest', 'email', value)} required />
        <SubmitButton loading={loading} label="Send Reset Code" loadingLabel="Sending…" color="violet" />
      </>
    ) : (
      <>
        <OtpField value={forms.forgotVerify.otp} onChange={(value) => updateForm('forgotVerify', 'otp', value)} />
        <PasswordField label="New password" placeholder="Minimum 8 characters" value={forms.forgotVerify.newPassword} onChange={(value) => updateForm('forgotVerify', 'newPassword', value)} required />
        <SubmitButton loading={loading} label="Reset Password" loadingLabel="Resetting…" color="violet" />
      </>
    )}

    <div className="pt-1 text-center">
      <button type="button" onClick={onLogin} className="text-[12px] text-slate-500 hover:text-slate-700 font-medium">
        Back to sign in
      </button>
    </div>
  </form>
);

const Field = ({ icon: Icon, label, type = 'text', placeholder, value, onChange, required, maxLength, disabled }) => (
  <label className="block">
    <span className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </span>
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={14} />
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50`}
      />
    </div>
  </label>
);

const PasswordField = ({ label, placeholder, value, onChange, required }) => {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><Lock size={14} /></span>
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </label>
  );
};

const OtpField = ({ value, onChange }) => (
  <label className="block">
    <span className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
      OTP Code<span className="text-red-400 ml-0.5">*</span>
    </span>
    <input
      type="text"
      inputMode="numeric"
      placeholder="6-digit code from your email"
      maxLength={6}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none tracking-[0.25em] font-mono transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
    />
  </label>
);

const StepBadge = ({ step, total, labels, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    violet: 'bg-violet-50 text-violet-700',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px] font-semibold ${colors[color]}`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${color === 'violet' ? 'bg-violet-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-blue-500'}`}>
        {step}
      </span>
      Step {step} of {total} — {labels[step - 1]}
    </div>
  );
};

const SubmitButton = ({ loading, label, loadingLabel, color = 'blue' }) => {
  const gradients = {
    blue: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    indigo: 'linear-gradient(135deg,#4f46e5,#4338ca)',
    violet: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
  };

  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: gradients[color], boxShadow: '0 2px 10px rgba(79,70,229,0.25)' }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
};

export default AuthModal;
