import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

/* ------------------------------------------------------------------
   Shared footer, rendered once from App.jsx on every page.
   EDIT HERE: routes and footer columns.
   `to`   = react-router route
   `hash` = scroll to a section on the HOME page (works from any page)
   `href` = external link
------------------------------------------------------------------- */
const ROUTES = {
  start: '/register',
  login: '/login',
  jobs: '/jobs',
  internships: '/internships',
  freelance: '/freelancers',
  skills: '/skill-development',
  mock: '/mock-interview',
  resume: '/resume',
  subscriptions: '/pricing',
  courses: '/courses',
  mentorship: '/mentorship',
};

const FOOT = [
  { h: 'Explore', items: [
    { l: 'Career paths', to: ROUTES.skills },
    { l: 'How it works', hash: 'solution' },
    { l: 'FAQs', hash: 'faq' },
    { l: 'For recruiters', to: ROUTES.start },
  ] },
  { h: 'Roles', items: [
    { l: 'Jobs', to: ROUTES.jobs },
    { l: 'Internships', to: ROUTES.internships },
    { l: 'Freelance', to: ROUTES.freelance },
  ] },
  { h: 'Learn', items: [
    { l: 'Mock interviews', to: ROUTES.mock },
    { l: 'Resume building', to: ROUTES.resume },
    { l: 'Courses', to: ROUTES.courses },
    { l: 'Mentorship', to: ROUTES.mentorship },
    { l: 'Subscriptions', to: ROUTES.subscriptions },
  ] },
  { h: 'Follow', items: [
    { l: 'Follow on X', href: 'https://x.com/' }, // put your real profile link here
  ] },
];

const LEGAL = [
  { l: 'About us', to: '/about-us' },
  { l: 'Terms', to: '/terms-and-conditions' },
  { l: 'Privacy', to: '/privacy-policy' },
];

export default function Footer({ currentUser = null, onLogout }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /* Scroll to a homepage section. From another page: go home first, then scroll. */
  const goHash = (id) => (e) => {
    e.preventDefault();
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true; }
      return false;
    };
    if (pathname === '/') { scroll(); return; }
    navigate('/');
    let tries = 0;
    const t = setInterval(() => { if (scroll() || ++tries > 25) clearInterval(t); }, 120);
  };

  const FLink = ({ it }) => {
    if (it.to) return <Link to={it.to}>{it.l}</Link>;
    if (it.hash) return <a href={`/#${it.hash}`} onClick={goHash(it.hash)}>{it.l}</a>;
    return <a href={it.href} target="_blank" rel="noreferrer">{it.l}</a>;
  };

  return (
    <footer className="sf">
      <div className="sf-wrap">
        <div className="sf-top">
          <h2 className="sf-h">Your next<br />career move<br />starts here</h2>
          <Link className="sf-btn" to={ROUTES.jobs}>Browse jobs</Link>
        </div>

        <div className="sf-cols">
          {FOOT.map((col, ci) => (
            <div key={col.h}>
              <h3>{col.h}</h3>
              {col.items.map((it) => <FLink key={it.l} it={it} />)}
              {ci === 0 && (currentUser
                ? onLogout && <button type="button" className="sf-link" onClick={onLogout}>Log out</button>
                : <Link to={ROUTES.login}>Log in</Link>)}
            </div>
          ))}
        </div>

        <div className="sf-bottom">
          <p>© {new Date().getFullYear()} VConnects</p>
          <nav aria-label="Legal">
            {LEGAL.map((it) => <Link key={it.l} to={it.to}>{it.l}</Link>)}
          </nav>
        </div>
      </div>

      {/* wordmark in the site font (Manrope). Size it with .sf-mark width in Footer.css */}
      <svg className="sf-mark" viewBox="0 0 1000 125" role="img" aria-label="VConnects">
        <text x="0" y="112" textLength="1000" lengthAdjust="spacing">VCONNECTS</text>
      </svg>
    </footer>
  );
}