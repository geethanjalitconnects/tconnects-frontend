import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import vcLogo from '../assets/vc-logo.png';
import './SiteHeader.css'; // its own stylesheet: does NOT depend on HomePage.css

/* EDIT HERE: menu items. `children` makes a dropdown. */
const MENU = [
  { label: 'Find Work', children: [
    { label: 'Jobs', to: '/jobs' },
    { label: 'Internships', to: '/internships' },
    { label: 'Freelancers', to: '/freelancers' },
  ] },
  { label: 'Learning', children: [
    { label: 'Courses', to: '/courses' },
    { label: 'Mock interview', to: '/mock-interview' },
    { label: 'Resume builder', to: '/resume' },
  ] },
  { label: 'Mentorship', to: '/mentorship' },
  { label: 'Subscriptions', to: '/pricing' },
];

export default function SiteHeader({ currentUser, onLogout }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAuth = pathname === '/login' || pathname === '/register'; // these pages pad themselves (see Auth.css)
  const [open, setOpen] = useState(false); // mobile menu
  const [drop, setDrop] = useState(null);  // open dropdown label

  useEffect(() => { setOpen(false); setDrop(null); }, [pathname]);

  const dash =
    currentUser?.role === 'recruiter' ? '/recruiter-dashboard'
      : currentUser?.role === 'admin' ? '/admin-dashboard/mentorship'
        : '/candidate-dashboard';

  return (
    <>
    <header className={`sh${isHome ? ' sh-home' : ''}`}>
      <div className="sh-in">
        {/* logo only (no "VConnects" text) */}
        <Link to="/" className="sh-logo" aria-label="VConnects home">
          <img src={vcLogo} alt="VConnects" />
        </Link>

        <button type="button" className="sh-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <i /><i /><i />
        </button>

        <nav className={`sh-nav${open ? ' open' : ''}`}>
          <ul>
            {MENU.map((m) => (
              <li key={m.label}
                  onMouseEnter={() => m.children && setDrop(m.label)}
                  onMouseLeave={() => m.children && setDrop(null)}>
                {m.children ? (
                  <>
                    <button type="button" className={`sh-link${drop === m.label ? ' open' : ''}`} aria-expanded={drop === m.label}
                            onClick={() => setDrop(drop === m.label ? null : m.label)}>
                      {m.label}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className={`sh-dd${drop === m.label ? ' show' : ''}`}>
                      {m.children.map((c) => <Link key={c.to} to={c.to}>{c.label}</Link>)}
                    </div>
                  </>
                ) : (
                  <NavLink to={m.to} className="sh-link">{m.label}</NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="sh-r">
            {currentUser ? (
              <>
                <button type="button" className="sh-btn sh-out" onClick={onLogout}>Log out</button>
                <Link className="sh-btn" to={dash}>Dashboard<i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i></Link>
              </>
            ) : (
              <>
                <Link className="sh-btn" to="/register">Get started for free<i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i></Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
    {/* the header is fixed, so normal pages need a spacer to start below it */}
    {!isHome && !isAuth && <div className="sh-spacer" aria-hidden="true" />}
    </>
  );
}