import { useRef, useState } from 'react';
import { Camera, Mail, Hash, Shield, User, X, Trash2, KeyRound, Sparkles } from 'lucide-react';
import { updateMe } from '../../services/authService';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">{label}</p>
    <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-black">
      <Icon size={14} className="text-blue-700" />
      <span className="truncate">{value || '-'}</span>
    </div>
  </div>
);

const ProfileModal = ({ isOpen, onClose, token, user, initials, profilePhoto, onPhotoChange, onPhotoRemove }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  if (!isOpen || !user) return null;

  const profileBadge = String(user.role || 'user').toUpperCase();

  const details = [
    { icon: User, label: 'Full Name', value: user.fullName },
    { icon: Hash, label: 'ID Number', value: user.idNumber },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role },
  ];

  const handlePickPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file only.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 2MB or smaller.');
      return;
    }

    setBusy(true);
    try {
      await onPhotoChange(file);
      setError('');
      setSuccess('Profile picture updated.');
    } catch (_err) {
      setError('Could not upload image. Try another file.');
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('You need to sign in again to change your password.');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setBusy(true);
    try {
      await updateMe(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (_err) {
      setError('Could not change password. Please check your current password and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-black" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition hover:bg-blue-50 hover:text-blue-700"
        >
          <X size={16} />
        </button>

        <div className="grid lg:grid-cols-[0.95fr_1.25fr]">
          <aside className="relative bg-gradient-to-br from-black via-blue-950 to-blue-800 p-6 text-white sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_30%)]" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-50">
                <Sparkles size={12} /> Account Profile
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">My Profile</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
                View your identity, update your picture, and change your password from one clean space.
              </p>

              <div className="mt-6 flex items-center gap-4 rounded-[24px] border border-blue-200/20 bg-black/20 p-4 backdrop-blur-sm">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-20 w-20 rounded-full border-2 border-blue-200/40 object-cover shadow-lg" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-200/30 bg-gradient-to-br from-blue-700 to-black text-2xl font-bold text-white shadow-lg">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-xl font-semibold text-white">{user.fullName || 'Profile'}</h3>
                    <span className="rounded-full border border-blue-200/30 bg-blue-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-50">
                      {profileBadge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-blue-100">{user.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-200">{user.idNumber}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-100 sm:grid-cols-3">
                <div className="rounded-2xl border border-blue-200/20 bg-black/15 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200">Role</p>
                  <p className="mt-1 font-semibold text-white">{user.role}</p>
                </div>
                <div className="rounded-2xl border border-blue-200/20 bg-black/15 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200">Status</p>
                  <p className="mt-1 font-semibold text-white">Active</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-blue-200/20 bg-black/15 p-3 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200">Security</p>
                  <p className="mt-1 font-semibold text-white">Password protected</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePickPhoto} />

                <button
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Camera size={14} />
                  {busy ? 'Uploading...' : 'Add / Change Picture'}
                </button>

                <button
                  disabled={busy}
                  onClick={async () => {
                    try {
                      setBusy(true);
                      await onPhotoRemove();
                      setError('');
                      setSuccess('Profile picture removed.');
                    } catch (_err) {
                      setError('Could not remove image. Please try again.');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200/25 bg-black/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Remove Picture
                </button>
              </div>
            </div>
          </aside>

          <section className="bg-white p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-black">Account Details</h3>
                <p className="mt-1 text-sm text-blue-700">Your profile fields are read-only here.</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-black">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-700">
                {success}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <DetailRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
              ))}
            </div>

            <form onSubmit={handlePasswordChange} className="mt-5 rounded-[24px] border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">Change Password</h4>
                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    Use your current password and create a new one with at least 8 characters.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Current Password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                    className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">New Password</span>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                      className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Confirm Password</span>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-blue-700">This updates the password tied to your UniHelp account.</p>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <KeyRound size={14} />
                  {busy ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
