import { useEffect, useState } from 'react';
import {
  Briefcase,
  CalendarClock,
  MessageSquareText,
  ArrowRight,
  Sparkles,
  BookOpenText,
  UserCheck,
} from 'lucide-react';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';

const modules = [
  {
    key: 'timetable',
    title: 'Timetable Management',
    description: 'Plan and track classes, sessions, and schedule updates in one place.',
    icon: CalendarClock,
    iconClass: 'text-blue-600 bg-blue-100',
  },
  {
    key: 'resource',
    title: 'Resource Management',
    description: 'Share lecture material, upload student notes, and keep learning organized.',
    icon: BookOpenText,
    iconClass: 'text-emerald-600 bg-emerald-100',
  },
  {
    key: 'jobs',
    title: 'Job and Intern Finder',
    description: 'Discover role-matched internships and academic opportunities.',
    icon: Briefcase,
    iconClass: 'text-amber-600 bg-amber-100',
  },
  {
    key: 'ticket',
    title: 'Academic Ticket with Chat',
    description: 'Raise support tickets and chat directly between lecturer and student.',
    icon: MessageSquareText,
    iconClass: 'text-fuchsia-600 bg-fuchsia-100',
  },
];

const studentActions = [
  { key: 'timetable', label: 'My Timetable' },
  { key: 'resource', label: 'Explore Resources' },
  { key: 'jobs', label: 'Find Internships' },
  { key: 'ticket', label: 'Raise Ticket' },
];

const lecturerActions = [
  { key: 'timetable', label: 'Manage Timetable' },
  { key: 'resource', label: 'Manage Resources' },
  { key: 'jobs', label: 'Review Job Board' },
  { key: 'ticket', label: 'Respond Tickets' },
];

const heroImages = [
  { key: 'hero-1', src: image1, alt: 'Campus collaboration scene', label: 'Campus life' },
  { key: 'hero-2', src: image2, alt: 'Timetable and resources', label: 'Academic flow' },
  { key: 'hero-3', src: image3, alt: 'Student lecturer chat', label: 'Direct support' },
];

const PortalHomeContent = ({ user, onLogin, onNavigate }) => {
  const role = user?.role === 'lecturer' ? 'lecturer' : 'student';
  const quickActions = role === 'lecturer' ? lecturerActions : studentActions;
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  const buildHeroBackground = (index) =>
    `linear-gradient(105deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.45) 28%, rgba(15,23,42,0.18) 100%), url(${heroImages[index].src})`;

  useEffect(() => {
    if (user) {
      setHeroVisible(true);
      return undefined;
    }

    let swapTimer;
    const timer = window.setInterval(() => {
      setHeroVisible(false);
      swapTimer = window.setTimeout(() => {
        setHeroIndex((current) => (current + 1) % heroImages.length);
        setHeroVisible(true);
      }, 320);
    }, 3000);

    return () => {
      window.clearInterval(timer);
      if (swapTimer) window.clearTimeout(swapTimer);
    };
  }, []);

  const handleModuleClick = (tabKey) => {
    if (user) {
      onNavigate(tabKey);
      return;
    }
    onLogin('login');
  };

  return (
    <section className="space-y-7">
      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 ${user ? 'min-h-[320px] bg-white' : 'min-h-[560px]'}`}
      >
        {user ? (
          <>
            <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-50/80 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.08),_transparent_38%)]" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
              style={{
                backgroundImage: buildHeroBackground(heroIndex),
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'scale(1)' : 'scale(1.02)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </>
        )}

        <div className={`relative grid ${user ? 'min-h-[240px] items-center' : 'min-h-[520px] items-end'}`}>
          <div className="max-w-2xl space-y-4 pb-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
              <Sparkles size={14} /> UNIVERSITY SUPPORT PLATFORM
            </span>

            {user ? (
              <>
                <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
                  Welcome {role === 'lecturer' ? 'Lecturer' : 'Student'}, {user.fullName}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Your role-based UniHelp home is ready. Jump into timetable, resources, jobs, or support tickets from one place.
                </p>
              </>
            ) : (
              <>
                <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
                  One platform for student and lecturer success.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Manage timetable, resources, internships, and academic support tickets with direct chat between lecturers and students.
                </p>
              </>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {user ? (
                <p className="text-sm font-medium text-slate-600">
                  Use the header tabs to open timetable, resources, jobs, or ticket tools.
                </p>
              ) : (
                <>
                  <button
                    onClick={() => onLogin('login')}
                    className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onLogin('activate')}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.key}
              onClick={() => handleModuleClick(module.key)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
            >
              <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${module.iconClass}`}>
                <Icon size={18} />
              </span>
              <h3 className="text-sm font-bold text-slate-900">{module.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{module.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                Open module <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">For Students</p>
          <h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900">Focus on learning, not logistics.</h3>
          <p className="mt-2 text-sm text-slate-600">
            Access resources, track timetable changes, and raise support tickets directly to lecturers.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">For Lecturers</p>
          <h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900">Teach smarter with one dashboard.</h3>
          <p className="mt-2 text-sm text-slate-600">
            Manage classes, publish materials, and support students through structured ticket conversations.
          </p>
        </div>
      </div>

      {!user && (
        <div className="rounded-2xl border border-slate-200 bg-slate-900 px-6 py-7 text-center sm:px-10">
          <p className="text-sm text-slate-300">Ready to join UniHelp?</p>
          <h3 className="mt-1 text-2xl font-bold text-white">Create your account and start in minutes.</h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onLogin('login')}
              className="rounded-xl border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-100 transition-all hover:border-slate-400"
            >
              Sign In
            </button>
            <button
              onClick={() => onLogin('activate')}
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100"
            >
              Activate Account
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <UserCheck size={18} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">You are logged in as {role}</h3>
              <p className="mt-1 text-sm text-slate-600">
                ID: <span className="font-semibold text-slate-700">{user.idNumber}</span> · Email: <span className="font-semibold text-slate-700">{user.email}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => onNavigate(action.key)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortalHomeContent;
