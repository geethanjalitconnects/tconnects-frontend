import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import './HomePage.css';

import mentorPhoto from '../../assets/mentor-photo.jpg';
import chipStudent from '../../assets/chip-student.jpg';
import chipHandshake from '../../assets/chip-handshake.jpg';
import chipMentor from '../../assets/chip-mentor.jpg';
import chipGroup from '../../assets/chip-group.jpg';

/* ------------------------------------------------------------------
   The header is the shared <SiteHeader /> and the footer is the shared
   <Footer />. Both are rendered once from App.jsx, so neither is in this file.
   EDIT HERE: page routes used by the buttons.
   `hash` items scroll to a section on this page.
   Everything else uses react-router <Link to="...">.
------------------------------------------------------------------- */
const ROUTES = {
  home: '/',
  start: '/register', // "Start for free", "Join VConnects"
  login: '/login',
  jobs: '/jobs',
  internships: '/internships',
  freelance: '/freelance',
  skills: '/skill-development',
  mock: '/mock-interview',
  resume: '/resume',
  subscriptions: '/subscriptions',
  courses: '/courses',
  mentorship: '/mentorship',
};

/* Where a logged-in user lands. Change `role` if your user object uses a different field. */
const dashboardFor = (u) => (u && u.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');

const TOOLS = [
  { id: 't1', label: 'Get hired', title: 'Jobs', to: ROUTES.jobs, desc: 'Verified openings from companies hiring freshers, matched to your skills — one feed instead of ten tabs.', chips: ['Smart match', 'One-click apply', 'Status tracking'], icon: ['M3 9h18v11H3z', 'M9 9V6h6v3', 'M3 14h18'] },
  { id: 't2', label: 'Gain experience', title: 'Internships', to: ROUTES.internships, desc: 'Paid and remote internships that turn your degree into real work on your resume.', chips: ['Remote', 'Stipend filter', 'Certificates'], icon: ['M2 9l10-5 10 5-10 5z', 'M6 11v5c3 2 9 2 12 0v-5'] },
  { id: 't3', label: 'Practise', title: 'Mock interviews', to: ROUTES.mock, desc: 'Rehearse HR and technical rounds, get feedback on every answer, and walk into the real one calm.', chips: ['HR round', 'Technical', 'Feedback report'], icon: ['M9 3h6v11H9z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v3'] },
  { id: 't4', label: 'Stand out', title: 'Resume making', to: ROUTES.resume, desc: 'Build a clean, recruiter-ready resume in minutes with templates that pass screening software.', chips: ['Templates', 'ATS-friendly', 'PDF export'], icon: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 13h6M9 17h6'] },
  { id: 't5', label: 'Upskill', title: 'Courses', to: ROUTES.courses, desc: 'Short, practical courses on the skills job listings ask for, with certificates for your profile.', chips: ['Self-paced', 'Certificates', 'Projects'], icon: ['M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z', 'M20 5h-6M20 5v13h-6'] },
  { id: 't6', label: 'Get guided', title: 'Mentorship', to: ROUTES.mentorship, desc: 'One-on-one time with people already working where you want to be. Ask anything.', chips: ['1:1 calls', 'Career plans', 'Referrals'], icon: ['M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', 'M2 20c0-4 3-6 7-6s7 2 7 6', 'M17 5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5-4-5.5'] },
];

const LIVE = ['Finding your job', 'Matching internships', 'Practising interviews', 'Polishing your resume', 'Learning new skills', 'Meeting your mentor'];

/* h = highlighted word, img = inline photo pill */
const PROBLEM = [
  'Most', 'students', 'apply', 'to', { h: 'fifty' }, 'jobs', { img: chipStudent }, 'and', 'hear', 'back', 'from', { h: 'two.' },
  'Openings', 'are', { h: 'scattered' }, 'across', 'ten', 'sites,', 'resumes', 'get', { h: 'filtered' }, { img: chipHandshake },
  'out', 'by', 'bots,', 'and', { h: 'nobody' }, 'tells', { img: chipMentor }, 'you', 'which', 'skills', 'actually', 'get', 'you', { h: 'hired.' }, { img: chipGroup },
];

/* same photo, different framing per slide – swap `img` per slide if you have more photos */
const SLIDES = [
  { big: '6', cap: 'tools in one place', img: mentorPhoto, origin: '22% 30%', zoom: 1.7 },
  { big: '1', cap: 'profile for every application', img: mentorPhoto, origin: '85% 30%', zoom: 1.7 },
  { big: '1:1', cap: 'mentorship with real professionals', img: mentorPhoto, origin: '50% 50%', zoom: 1 },
  { big: '0', cap: 'tabs to juggle', img: mentorPhoto, origin: '8% 25%', zoom: 1.9 },
];

const FAQ = [
  ['Who is it for?', 'Students and early-career professionals who want to get hired, and recruiters who want candidates ready for the role.'],
  ['Where should I start?', 'Build your resume first. Your profile then points you to matching jobs, internships and courses.'],
  ['How do mock interviews work?', 'Pick a role and a round. You answer, and you get feedback on each answer so you can improve before the real thing.'],
  ['Can I talk to a real mentor?', 'Yes. Book a one-on-one call with a professional in the field you want to join.'],
  ['Is it free to start?', 'Yes. Create your free profile and take the first step today.'],
];

const goTo = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- word-by-word reveal ----------
   <Words text="path to hired." className="vc-gt" base={3} />
   Put data-reveal on the parent (h2/p). When it scrolls into view the effect in
   HomePage adds .in and each word rises out of its mask, staggered by --d.
   `base` = number of words that come before this chunk, so the stagger continues. */
function Words({ text, className = '', base = 0, step = 70 }) {
  return text.split(' ').map((w, i) => (
    <Fragment key={i}>
      <span className="vc-wd"><span className={className} style={{ '--d': `${(base + i) * step}ms` }}>{w}</span></span>{' '}
    </Fragment>
  ));
}

/* ---------- animated number ---------- */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (n) => {
        const q = Math.min(1, (n - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))) + suffix;
        if (q < 1 && !rm) requestAnimationFrame(tick);
        else el.textContent = to + suffix;
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix]);
  return <b ref={ref}>0{suffix}</b>;
}

/* ---------- site-wide particle field: sphere -> dust -> shield -> 3D wave ----------
   Rendered through a portal into <body>, so no parent (transform, overflow,
   z-index, global css) can hide or clip it. Colours are taken from the VC logo:
   deep #006080, mid #0184a2, bright cyan #09e2f1, ink #001d37 (+ a few orange dots). */
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    const IDS = ['top', 'problem', 'enter', 'solution', 'who', 'faq', 'join'];
    const NC = 44, NR = 80, N = NC * NR; // wave = NC columns x NR rows
    const P = [];
    let W = 0, H = 0, D = 1, US = 1, glow = 0, mx = 0, my = 0, tx = 0, ty = 0, rot = 0, raf = 0;
    const gauss = () => { let u = 0; for (let k = 0; k < 6; k++) u += Math.random(); return (u - 3) / 0.7; };
    for (let i = 0; i < N; i++) {
      let vx = gauss(), vy = gauss(), vz = gauss();
      const l = Math.hypot(vx, vy, vz) || 1; vx /= l; vy /= l; vz /= l;
      const q = Math.random(), c = Math.random();
      P.push({
        s: [vx, vy, vz], d: [Math.random(), Math.random()], t: Math.random() * 6.28,
        x: Math.random(), y: Math.random(), g: i,
        k: q < 0.012 ? 3 : q < 0.045 ? 2 : 0,           // 3 = big bright square, 2 = orange, 0 = normal
        tone: c < 0.12 ? 2 : c < 0.55 ? 1 : 0,         // 2 = ink, 1 = cyan, 0 = mid teal
        z: 0.6 + Math.random() * 1.1,                   // size jitter
      });
    }
    /* ---- security shield (shown in the "Who we are" section) ----
       roles: 0 rim · 1 inner outline · 2 lattice fill · 3 orange check · 4 check halo
       Every particle belongs to the symbol; nothing floats around it. */
    const hw = (y) => (y < 0.02 ? 0.5 : 0.5 * Math.pow(Math.max(0, 1 - (y - 0.02) / 0.58), 0.8));
    const topY = (x) => -0.6 + 0.07 * (2 * x) * (2 * x);
    const pts = [];
    for (let i = 0; i <= 50; i++) { const x = -0.5 + i / 50; pts.push([x, topY(x)]); }
    for (let i = 1; i <= 140; i++) { const y = -0.53 + (1.13 * i) / 140; pts.push([hw(y), y]); }
    for (let i = 139; i >= 0; i--) { const y = -0.53 + (1.13 * i) / 140; pts.push([-hw(y), y]); }
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const onEdge = (f) => {
      const d = f * cum[cum.length - 1]; let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    };
    const inside = (x, y, s) => { const a = x / s, b = y / s; return b > topY(a) && b < 0.6 && Math.abs(a) < hw(b); };

    /* check mark: a solid rounded stroke, sampled evenly so there are no gaps or stray strands */
    const CK = [[-0.2, 0.03], [-0.07, 0.17], [0.25, -0.17]];
    const segs = [[CK[0], CK[1]], [CK[1], CK[2]]];
    const CR = 0.034;                                   // half-thickness of the check
    const distChk = (x, y) => Math.min(...segs.map(([p0, p1]) => {
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      const t = Math.max(0, Math.min(1, ((x - p0[0]) * dx + (y - p0[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x - p0[0] - dx * t, y - p0[1] - dy * t);
    }));
    const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = (i / b) | 0; } return r; };
    const sampleBand = (n, lo, hi) => {                 // even, deterministic fill of lo <= distance < hi
      const out = [];
      for (let i = 1; out.length < n && i < 200000; i++) {
        const x = -0.3 + 0.6 * halton(i, 2), y = -0.3 + 0.6 * halton(i, 3), d = distChk(x, y);
        if (d >= lo && d < hi) out.push([x, y]);
      }
      return out;
    };
    const CORE = sampleBand(400, 0, CR);                 // solid orange check
    const HALO = sampleBand(120, CR + 0.012, CR + 0.05); // soft ring around it

    /* hex lattice filling the inner panel, keeping a clean clearance around the check */
    const NFILL = N - 1990;
    let L = [], sp = 0.0215;
    for (let pass = 0; pass < 3; pass++) {
      L = [];
      for (let r = 0, y = -0.5; y < 0.5; y += sp * 0.866, r++)
        for (let x = -0.45 + (r % 2) * sp / 2; x < 0.45; x += sp)
          if (inside(x, y, 0.76) && distChk(x, y) > CR + 0.055) L.push([x, y]);
      sp *= Math.sqrt(L.length / NFILL);
    }

    /* teal gradient (deep bottom-left -> light top-right) and orange gradient for the check */
    const lerp = (p0, p1, t) => p0 + (p1 - p0) * t;
    const tealAt = (x, y) => {
      const f = Math.max(0, Math.min(1, 0.5 + 0.55 * x - 0.35 * y));
      const lo = f < 0.5 ? [0, 96, 128] : [1, 150, 178], hi = f < 0.5 ? [1, 150, 178] : [20, 205, 222], t = f < 0.5 ? f * 2 : (f - 0.5) * 2;
      return lo.map((v, k) => Math.round(lerp(v, hi[k], t)));
    };
    const orangeAt = (f) => [Math.round(lerp(226, 255, f)), Math.round(lerp(98, 176, f)), Math.round(lerp(34, 96, f))];

    P.forEach((p, i) => {
      let x = 0, y = 0, role;
      if (i < 700) { role = 0; const e = onEdge((i + 0.5) / 700); x = e[0]; y = e[1]; }                                   // solid rim
      else if (i < 1050) { role = 0; const e = onEdge((i - 700 + 0.5) / 350); x = e[0] * 0.95; y = e[1] * 0.95; }        // dotted rim
      else if (i < 1470) { role = 1; const e = onEdge((i - 1050 + 0.5) / 420); x = e[0] * 0.76; y = e[1] * 0.76 + 0.012; }
      else if (i < 1990) {
        const k = i - 1470;
        if (k < 400) { role = 3; [x, y] = CORE[k % CORE.length]; }
        else { role = 4; [x, y] = HALO[(k - 400) % HALO.length]; }
        p.cf = Math.max(0, Math.min(1, (x + 0.2) / 0.45));  // orange gradient along the check
      }
      else { role = 2; const q = L[(i - 1990) % L.length]; x = q[0]; y = q[1]; }
      p.sh = [x, y]; p.role = role;
      p.rgb = role >= 3 ? orangeAt(p.cf) : tealAt(x, y);
    });
    const fit = () => { D = Math.min(devicePixelRatio || 1, 2); W = cv.width = Math.round(innerWidth * D); H = cv.height = Math.round(innerHeight * D); US = Math.min(1.2, Math.max(0.6, innerWidth / 1918)) * 1.45; };
    fit();
    const pick = () => {
      let m = 0;
      IDS.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.5) m = i; });
      return m;
    };
    const frame = (t) => {
      cx.clearRect(0, 0, W, H);
      rot += 0.0028;
      const mode = pick();
      const S = Math.min(H * 0.5, W * 0.3), CX = W * 0.5, CY = H * 0.52;
      glow += ((mode === 4 ? 1 : 0) - glow) * 0.06;            // soft teal glow behind the shield
      if (glow > 0.01) {
        const gr = cx.createRadialGradient(CX, CY, 0, CX, CY, S * 0.95);
        gr.addColorStop(0, `rgba(9,226,241,${0.17 * glow})`); gr.addColorStop(1, 'rgba(9,226,241,0)');
        cx.fillStyle = gr; cx.fillRect(0, 0, W, H);
      }
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      const c = Math.cos(rot + mx), s = Math.sin(rot + mx), c2 = Math.cos(my * 0.4), s2 = Math.sin(my * 0.4);
      let R = Math.min(W * 0.19, H * 0.4), SX = W * 0.69, SY = H * 0.43;
      const orb = document.getElementById('vc-orb');           // sphere is drawn inside this hero box
      if (orb) { const o = orb.getBoundingClientRect(); if (o.width) { SX = (o.left + o.width / 2) * D; SY = (o.top + o.height / 2) * D; R = Math.min(o.width, o.height) / 2.2 * D; } }
      for (let i = 0; i < N; i++) {
        const p = P[i];
        let gx, gy, sz = 1.3, al = 0.5;
        if (mode === 0) {                                   // sphere
          const x = p.s[0] * c - p.s[2] * s, z = p.s[0] * s + p.s[2] * c;
          const y2 = p.s[1] * c2 - z * s2, z2 = p.s[1] * s2 + z * c2, kk = (z2 + 1.7) / 2.7;
          gx = SX + x * R * kk * 1.1; gy = SY + y2 * R * kk * 1.1; al = 0.2 + 0.8 * kk; sz = 1.5 * kk * p.z;
        } else if (mode === 4) {                            // security shield
          const sw = Math.cos(Math.sin(t / 2600) * 0.35);   // gentle swivel
          const ux = p.sh[0], uy = p.sh[1], r = p.role;
          const sweep = Math.pow(Math.max(0, Math.sin((ux * 0.8 + uy * 0.6) * 5 - t / 800)), 8);   // light sweeping across the glass
          al = [0.95, 0.85, 0.5 + 0.25 * (0.6 - uy), 1, 0.3][r] + sweep * 0.35;
          sz = [1.1, 1, 0.85, 1.7, 2.2][r] * (1 + sweep * 0.5);
          gx = CX + (ux * sw + mx * 0.03) * S;
          gy = CY + (uy + Math.sin(t / 1400) * 0.01 + my * 0.015) * S;
        } else if (mode >= 6) {                             // 3D wave with helical loops
          const col = p.g % NC, row = (p.g / NC) | 0;
          const cxn = (col + 0.5) / NC, z = row / (NR - 1), zp = Math.pow(z, 1.6);
          const spread = (0.85 + 0.5 * zp) * W;
          const env = Math.exp(-Math.pow((cxn - 0.45) / 0.3, 2));
          const ph = z * 15 - t / 600 + cxn * 3;
          const baseY = H * 0.56 + (H * 1.08 - H * 0.56) * zp;
          gx = W * 0.5 + (cxn - 0.5) * spread + Math.cos(ph) * W * 0.014 * (1 - 0.6 * zp) * env;
          gy = baseY
            + Math.sin(cxn * 5.5 + t / 1400 + z * 2) * H * 0.07 * (0.4 + 0.6 * zp)
            + Math.sin(cxn * 11 - t / 900) * H * 0.012
            + Math.sin(ph) * H * 0.1 * (1 - 0.8 * zp) * env;
          al = 0.3 + 0.6 * (0.3 + 0.7 * zp); sz = (0.9 + 4.8 * zp) / 1.25;
        } else {                                            // dust
          gx = (p.d[0] + Math.sin(t / 5000 + p.t) * 0.015) * W; gy = (p.d[1] + Math.cos(t / 6000 + p.t) * 0.015) * H;
          al = mode === 1 ? 0.45 : mode === 2 ? 0.6 : 0.32; sz = 1.2 * p.z;
        }
        const ease = mode === 4 ? 0.14 : 0.045;            // shield forms crisply, other states stay floaty
        p.x += (gx - p.x) * ease; p.y += (gy - p.y) * ease;
        const dust = mode >= 1 && mode < 4;
        const size = (p.k === 3 && dust ? 6 : p.k === 2 && dust ? 3.4 : sz * 1.25) * D * 0.9 * US;
        const fill = mode === 4 ? `rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${Math.min(1, al)})` : null;
        cx.fillStyle = fill ? fill : p.k === 3 ? `rgba(9,226,241,${Math.min(1, al + 0.15)})`
          : p.k === 2 ? `rgba(238,122,60,${al})`
          : p.tone === 2 ? `rgba(0,29,55,${al * 0.8})`
          : p.tone === 1 ? `rgba(9,226,241,${al})`
          : `rgba(1,132,162,${al})`;
        cx.fillRect(p.x, p.y, size, size);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e) => { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; };
    addEventListener('resize', fit);
    addEventListener('pointermove', onMove);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit); removeEventListener('pointermove', onMove); };
  }, []);

  const layer = {
    position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(1,132,162,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(1,132,162,.06) 1px,transparent 1px)',
    backgroundSize: '84px 84px',
  };
  return createPortal(
    <div className="vc-bg" style={layer} aria-hidden="true">
      <canvas ref={ref} className="vc-pf" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </div>,
    document.body,
  );
}

/* ---------- page ---------- */
export default function HomePage({ currentUser = null }) {
  const startTo = currentUser ? dashboardFor(currentUser) : ROUTES.start;
  const scrubRef = useRef(null);
  const stepRef = useRef(null);
  const stepHRef = useRef(null);
  const rootRef = useRef(null);
  const itemsRef = useRef(null);
  const [live, setLive] = useState(0);
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const [rm] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* hero checklist + carousel */
  useEffect(() => {
    if (rm) return;
    const id = setInterval(() => setLive((k) => (k + 1) % LIVE.length), 2000);
    return () => clearInterval(id);
  }, [rm]);

  /* impact slider */
  useEffect(() => {
    if (rm) return;
    const id = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), 4600);
    return () => clearTimeout(id);
  }, [slide, rm]);

  /* parents with overflow:hidden turn into scroll containers and silently kill position:sticky
     (side menu, FAQ title). `clip` hides overflow the same way without that side effect. */
  useEffect(() => {
    const undo = [];
    for (let el = rootRef.current && rootRef.current.parentElement; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      ['overflowX', 'overflowY'].forEach((k) => {
        if (cs[k] === 'hidden') {
          const prop = k === 'overflowX' ? 'overflow-x' : 'overflow-y';
          const old = el.style.getPropertyValue(prop);
          el.style.setProperty(prop, 'clip');
          undo.push(() => el.style.setProperty(prop, old));
        }
      });
    }
    return () => undo.forEach((f) => f());
  }, []);

  /* word-by-word reveal for headings (runs once per heading) */
  useEffect(() => {
    const els = rootRef.current ? rootRef.current.querySelectorAll('[data-reveal]') : [];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* scroll-driven effects (throttled to one update per frame) */
  useEffect(() => {
    let raf = 0;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const update = () => {
      raf = 0;
      const vh = innerHeight;

      /* 1. problem sentence: every word has its own 0..1 progress (--q) */
      const sc = scrubRef.current;
      if (sc) {
        const b = sc.getBoundingClientRect();
        const p = clamp((vh * 0.82 - b.top) / (b.height + vh * 0.25));
        const kids = sc.children, n = kids.length, RAMP = 4; // a word fades in over ~4 words
        for (let i = 0; i < n; i++) {
          const q = clamp((p * (n - 1 + RAMP) - i) / RAMP);
          kids[i].style.setProperty('--q', q.toFixed(3));
          kids[i].classList.toggle('on', q > 0.55);
        }
      }

      /* 2. "Step inside VConnects": words reveal one by one, hold, then zoom through */
      const st = stepRef.current, sh = stepHRef.current;
      if (st && sh) {
        const r = st.getBoundingClientRect();
        const f = clamp(-r.top / (r.height - vh));
        const reveal = clamp(f / 0.38);
        const zoom = clamp((f - 0.45) / 0.55);
        const words = sh.querySelectorAll('.vc-sw'), N = words.length, R = 1.4;
        for (let i = 0; i < N; i++) words[i].style.setProperty('--q', clamp((reveal * (N - 1 + R) - i) / R).toFixed(3));
        sh.style.opacity = (1 - clamp((f - 0.72) / 0.28)).toFixed(3);
        sh.style.transform = `scale(${(0.9 + reveal * 0.1 + zoom * zoom * 11).toFixed(3)})`;
      }

      /* 3. solution list */
      const it = itemsRef.current;
      if (it) {
        let a = 0;
        [...it.querySelectorAll('.vc-it')].forEach((e, i) => { if (e.getBoundingClientRect().top < vh * 0.55) a = i; });
        setActive((prev) => (prev === a ? prev : a));
        const ir = it.getBoundingClientRect();
        it.style.setProperty('--h', `${Math.max(0, Math.min(ir.height, vh * 0.55 - ir.top))}px`);
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); };
  }, []);

  const railOn = Math.min(live, 5);
  const sl = SLIDES[slide];

  return (
    <div className="vc-home" ref={rootRef}>
      <ParticleField />

      {/* The header is the shared <SiteHeader /> from App.jsx, so nothing is rendered here. */}

      <main>
        {/* ============ HERO ============ */}
        <header className="vc-hero" id="top">
          <div className="vc-wrap vc-hero-grid">
            <div>
              <div className="vc-tag vc-fi" style={{ animationDelay: '.1s' }}>Careers · Skills · Mentors</div>
              <h1>
                <span className="vc-ln" style={{ '--i': 0 }}><span>Your career,</span></span>
                <span className="vc-ln" style={{ '--i': 1 }}><span className="vc-h1a">fully</span></span>
                <span className="vc-ln" style={{ '--i': 2 }}><span className="vc-h1b">connected.</span></span>
              </h1>
              <p className="vc-lead vc-fi" style={{ animationDelay: '.9s' }}>
                Jobs, internships, mock interviews, resume building, courses and mentorship — every step from student to hired, in one place.
              </p>
              <div className="vc-cta vc-fi" style={{ animationDelay: '1.1s' }}>
                <Link className="vc-btn" to={startTo}>{currentUser ? 'Go to dashboard' : 'Start for free'}<i><Arrow /></i></Link>
                <a className="vc-btn vc-white" href="#solution" onClick={goTo('solution')}>See how it works</a>
              </div>
            </div>
            <div className="vc-hero-r">
              <div id="vc-orb" className="vc-orb" aria-hidden="true" />
              <div className="vc-live vc-fi" style={{ animationDelay: '1.5s' }} aria-hidden="true">
                <span className="vc-mono">VConnects is…</span>
                <ul>
                  {LIVE.map((t, i) => (
                    <li key={t} className={i < live ? 'd' : i === live ? 'c' : ''}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="vc-rail" aria-hidden="true">
            <div style={{ translate: `calc(${-(railOn + 0.5)} * var(--pitch)) 0` }}>
              {TOOLS.map((t, i) => (
                <span key={t.id} className={i === railOn ? 'on' : Math.abs(i - railOn) === 1 ? 'n' : ''}>{t.title}<small>{t.label}</small></span>
              ))}
            </div>
          </div>
          <div className="vc-scr vc-mono">Scroll</div>
        </header>

        {/* ============ PROBLEM ============ */}
        <section className="vc-prob" id="problem">
          <div className="vc-wrap">
            <div className="vc-tag">The problem</div>
            <p className="vc-scrub" ref={scrubRef}>
              {PROBLEM.map((w, i) => (
                <Fragment key={i}>
                  {typeof w === 'string' ? <span className="vc-w">{w}</span>
                    : w.h ? <span className="vc-w vc-hl">{w.h}</span>
                    : <span className="vc-w"><span className="vc-chip"><img src={w.img} alt="" /></span></span>}{' '}
                </Fragment>
              ))}
            </p>
            <div className="vc-stats">
              <div className="vc-stat"><Counter to={10} suffix="+" /><span>sites to check for one opening</span></div>
              <div className="vc-stat"><Counter to={75} suffix="%" /><span>of resumes never reach a human</span></div>
              <div className="vc-stat"><Counter to={0} /><span>practice before the interview that counts</span></div>
            </div>
          </div>
        </section>

        {/* ============ STEP INSIDE ============ */}
        <section className="vc-step" id="enter" ref={stepRef}>
          <h2 className="vc-sr">Step inside VConnects</h2>
        </section>
        {/* the animated heading lives in a fixed layer on <body>: it can't be broken by any parent's overflow */}
        {createPortal(
          <div className="vc-step-layer" aria-hidden="true">
            <h2 ref={stepHRef}>
              <span className="a"><span className="vc-sw">Step</span> <span className="vc-sw">inside</span></span>
              <span className="b"><span className="vc-sw">VConnects</span></span>
            </h2>
          </div>,
          document.body,
        )}

        {/* ============ SOLUTION ============ */}
        <section className="vc-tools" id="solution">
          <div className="vc-wrap vc-tools-grid">
            <div className="vc-side">
              <div className="vc-tag">The solution</div>
              <h2 data-reveal><Words text="Six tools. One" /><Words text="path to hired." className="vc-gt" base={3} /></h2>
              <p>Follow the steps in order, or jump straight to what you need today.</p>
              <div className="vc-idx">
                {TOOLS.map((t, i) => (
                  <a key={t.id} href={`#${t.id}`} onClick={goTo(t.id)} className={i === active ? 'on' : ''}><span>0{i + 1}</span>{t.title}</a>
                ))}
              </div>
            </div>
            <div className="vc-items" ref={itemsRef}>
              {TOOLS.map((t, i) => (
                <div key={t.id} id={t.id} className={`vc-it${i <= active ? ' on' : ''}`}>
                  <div className="vc-num">0{i + 1}</div>
                  <div className="vc-tc">
                    <span className="vc-mono vc-or">{t.label}</span>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <div className="vc-chips">{t.chips.map((c) => <span key={c}>{c}</span>)}</div>
                    <Link className="vc-ic" to={t.to} aria-label={`Open ${t.title}`}>
                      <svg viewBox="0 0 24 24">{t.icon.map((d) => <path key={d} d={d} />)}</svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ WHO WE ARE ============ */}
        <section className="vc-who" id="who">
          <div className="vc-wrap">
            <div className="vc-tag">Who we are</div>
            <div className="vc-who-head">
              <h2 data-reveal><Words text="We connect talent" /><br /><Words text="to" base={3} /><Words text="opportunity." className="vc-opp" base={4} /></h2>
              <div>
                <p>VConnects helps students and graduates go from learning to hired, with every tool in one place instead of ten tabs.</p>
                <p>No scattered listings and no guessing what recruiters want. Just a clear path, and real people to guide you along it.</p>
              </div>
            </div>
            <div className="vc-impact">
              <div className="vc-photo">
                <div className="vc-photo-in">
                  {SLIDES.map((s, i) => (
                    <img key={i} src={s.img} alt="A mentor talking with a graduate" className={i === slide ? 'on' : ''}
                      style={{ transformOrigin: s.origin, '--z': s.zoom }} />
                  ))}
                </div>
                <em>0{slide + 1}</em>
              </div>
              <div className="vc-imp-copy">
                <div className="vc-tag">Impact</div>
                <h2 data-reveal><Words text="What we bring" /><Words text="to you." className="vc-gt" base={3} /></h2>
                <div className="vc-big" key={slide}>{sl.big}</div>
                <p className="vc-cap">{sl.cap}</p>
                <div className="vc-bars">
                  {SLIDES.map((_, i) => (
                    <button key={i} type="button" aria-label={`Show slide ${i + 1}`} className={i < slide ? 'd' : i === slide ? 'on' : ''} onClick={() => setSlide(i)} />
                  ))}
                  <span className="vc-mono">0{slide + 1} / 0{SLIDES.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="vc-faq" id="faq">
          <div className="vc-wrap vc-faq-grid">
            <h2 data-reveal><Words text="Questions," /><Words text="answered." className="vc-gt" base={1} /></h2>
            <div>
              <div className="vc-intro">A career platform that brings jobs, internships, mock interviews, resume building, courses and mentorship together, so you can go from learning to hired in one place.</div>
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="vc-cta2" id="join">
          <div className="vc-wrap">
            <div className="vc-tag">Start today</div>
            <h2 data-reveal><Words text="Ready when" /><Words text="you are." className="vc-gt" base={2} /></h2>
            <p>Create your free profile and take the first step today.</p>
            <Link className="vc-join" to={startTo}>{currentUser ? 'Open dashboard' : 'Join VConnects'}<i><Arrow /></i></Link>
          </div>
        </section>
      </main>

      {/* The footer is the shared <Footer /> from App.jsx, so nothing is rendered here. */}
    </div>
  );
}