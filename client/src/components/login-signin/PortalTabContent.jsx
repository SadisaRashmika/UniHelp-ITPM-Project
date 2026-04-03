import LecDashboard from '../../pages/lecture-resource/LecDashboard';
import StuDashboard from '../../pages/lecture-resource/StuDashboard';
import PortalHomeContent from './PortalHomeContent';

const PortalTabContent = ({ tab, user, onLogin, onNavigate }) => {
  if (tab === 'home') {
    return <PortalHomeContent user={user} onLogin={onLogin} onNavigate={onNavigate} />;
  }

  if (!user) {
    return (
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-amber-900">Login Required</h2>
        <p className="mt-2 text-amber-800">Please login to access this area.</p>
      </section>
    );
  }

  if (tab === 'resource') {
    const userId = user.role === 'lecturer' ? user.idNumber : user.idNumber;
    return user.role === 'lecturer' ? (
      <LecDashboard userId={userId} />
    ) : (
      <StuDashboard userId={userId} />
    );
  }

  if (tab === 'timetable') {
    return (
      <RolePanel
        title="Timetable"
        user={user}
        lecturerBody="Lecturer timetable tools will show your teaching schedule and session planning controls."
        studentBody="Student timetable tools will show your class schedule and upcoming sessions."
      />
    );
  }

  if (tab === 'jobs') {
    return (
      <RolePanel
        title="Jobs"
        user={user}
        lecturerBody="Lecturer jobs panel will publish assistant opportunities and academic openings."
        studentBody="Student jobs panel will show internships, campus jobs, and role-specific applications."
      />
    );
  }

  return (
    <RolePanel
      title="Academic Ticket"
      user={user}
      lecturerBody="Lecturer tickets panel will let you review and respond to student academic requests."
      studentBody="Student tickets panel will let you create and track your academic support tickets."
    />
  );
};

const RolePanel = ({ title, user, lecturerBody, studentBody }) => (
  <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-600">
        {user.role}
      </span>
    </div>
    <p className="mt-4 text-slate-600">{user.role === 'lecturer' ? lecturerBody : studentBody}</p>
  </section>
);

export default PortalTabContent;
