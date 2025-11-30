import React, { useState } from 'react';
import './Freelancer.css';


export default function FreelancerEducation() {
const [list, setList] = useState([]);
const [entry, setEntry] = useState({ degree: '', institution: '', start: '', end: '', desc: '' });


const add = (e) => { e.preventDefault(); setList(l => [...l, entry]); setEntry({ degree: '', institution: '', start: '', end: '', desc: '' }); };
const remove = (i) => setList(l => l.filter((_, idx) => idx !== i));


return (
<div className="fr-page">
<div className="fr-card">
<h2 className="fr-title">Education</h2>


<form className="fr-form" onSubmit={add}>
<div className="fr-row fr-two-col">
<input className="fr-input" placeholder="Degree" value={entry.degree} onChange={e => setEntry({...entry, degree: e.target.value})} />
<input className="fr-input" placeholder="Institution" value={entry.institution} onChange={e => setEntry({...entry, institution: e.target.value})} />
</div>


<div className="fr-row fr-two-col">
<input className="fr-input" placeholder="Start year" value={entry.start} onChange={e => setEntry({...entry, start: e.target.value})} />
<input className="fr-input" placeholder="End year" value={entry.end} onChange={e => setEntry({...entry, end: e.target.value})} />
</div>


<div className="fr-row">
<textarea className="fr-textarea" placeholder="Description" value={entry.desc} onChange={e => setEntry({...entry, desc: e.target.value})} rows={3} />
</div>


<div className="fr-actions">
<button className="fr-btn fr-btn-primary">Add +</button>
</div>
</form>


<div className="fr-section">
<h3 className="fr-subtitle">Saved education</h3>
{list.length === 0 && <p className="fr-muted">No entries yet</p>}
<ul className="fr-list">
{list.map((it, idx) => (
<li key={idx} className="fr-list-item">
<div>
<strong>{it.degree}</strong> — {it.institution} ({it.start} — {it.end})
<p className="fr-muted">{it.desc}</p>
</div>
<button className="fr-btn fr-btn-ghost" onClick={() => remove(idx)}>Remove</button>
</li>
))}
</ul>
</div>
</div>
</div>
);
}