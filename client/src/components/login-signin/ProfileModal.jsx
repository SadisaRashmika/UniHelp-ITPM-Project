import { useRef, useState } from 'react';
import { Camera, Mail, Hash, Shield, User, X, Trash2 } from 'lucide-react';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <div className="mt-1 flex items-center gap-2 text-sm text-slate-800">
      <Icon size={14} className="text-slate-500" />
      <span>{value || '-'}</span>
    </div>
  </div>
);

const ProfileModal = ({ isOpen, onClose, user, initials, profilePhoto, onPhotoChange, onPhotoRemove }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen || !user) return null;

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
    } catch (_err) {
      setError('Could not upload image. Try another file.');
    } finally {
      setBusy(false);
    }
  };

  const details = [
    { icon: User, label: 'Full Name', value: user.fullName },
    { icon: Hash, label: 'ID Number', value: user.idNumber },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(5px)' }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        <p className="mt-1 text-sm text-slate-600">Profile details are view-only. You can only update your profile picture.</p>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="h-20 w-20 rounded-full border border-blue-200 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white">
              {initials}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickPhoto}
            />
            <button
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                } catch (_err) {
                  setError('Could not remove image. Please try again.');
                } finally {
                  setBusy(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              Remove Picture
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {details.map((item) => (
            <DetailRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
