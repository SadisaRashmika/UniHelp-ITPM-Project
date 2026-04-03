const footerLinks = [
  { label: 'Home', href: '#' },
  { label: 'Timetable', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Jobs', href: '#' },
  { label: 'Ticket', href: '#' },
];

const HomeFooter = ({ show }) => {
  if (!show) return null;

  return (
    <footer className="mt-8 w-full border-t border-slate-200 bg-white px-3 py-6 sm:px-4 lg:px-5">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">UniHelp</p>
          <p className="mt-1 max-w-md text-xs leading-6 text-slate-500">
            A simple university support platform for timetable management, resources, internships, and academic support.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-blue-600">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
