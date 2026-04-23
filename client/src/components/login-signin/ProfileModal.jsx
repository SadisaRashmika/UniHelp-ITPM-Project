import { useRef, useState } from 'react';
import { Camera, Mail, Hash, Shield, User, X, Trash2, KeyRound } from 'lucide-react';
import { updateMe } from '../../services/authService';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black">{label}</p>
    <div className="mt-1 flex items-center gap-2 text-sm text-black">
      <Icon size={14} className="text-blue-600" />
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
      setError('Please choose an image file.');
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
      setError('Could not upload image.');
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please sign in again to change your password.');
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
      setError('Could not change password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_22px_60px_rgba(0,0,0,0.2)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white text-black transition hover:bg-blue-50 hover:text-blue-700"
        >
          <X size={16} />
        </button>

        <div className="border-b border-blue-100 px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Profile</p>
          <h2 className="mt-1 text-lg font-bold text-black">My Profile</h2>
        </div>

        <div className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl border border-blue-200 bg-white p-3.5">
            <div className="flex items-center gap-3">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-16 w-16 rounded-full border border-blue-200 object-cover shrink-0"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-white text-lg font-bold text-black shrink-0">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-black">{user.fullName || 'Profile'}</h3>
                <p className="mt-0.5 text-sm text-black">{user.email || '-'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black">{user.role || '-'}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePickPhoto} />

              <button
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera size={14} />
                {busy ? 'Uploading...' : 'Change Picture'}
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
                    setError('Could not remove image.');
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                Remove Picture
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="rounded-2xl border border-blue-200 bg-white p-3.5">
              <h3 className="text-sm font-bold text-black">Details</h3>
              <p className="mt-1 text-sm text-black">Your account information.</p>

              {error && <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-black">{error}</div>}
              {success && <div className="mt-3 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-black">{success}</div>}

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {details.map((item) => (
                  <DetailRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="rounded-2xl border border-blue-200 bg-white px-4 py-3.5 sm:px-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">Change Password</h3>
                  <p className="mt-1 text-sm text-black">Use your current password and choose a new one.</p>
                </div>
              </div>

              <div className="mt-3 grid gap-2.5">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-black">Current Password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                    className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Current password"
                    autoComplete="current-password"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-black">New Password</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                    className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-black">Confirm Password</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="mt-3 flex justify-end px-0 sm:px-0">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
