import React, { useState } from 'react';
import './freelancer.css';


export default function FreelancerProfessionalDetails() {
const [data, setData] = useState({ expertise: '', years: '', categories: '', bio: '' });


const handle = (e) => setData(p => ({ ...p, [e.target.name]: e.target.value }));
const save = (e) => { e.preventDefault(); console.log('Professional details', data); alert('Saved (UI only)'); };


return (
<div className="fr-page">
<form className="fr-card fr-form" onSubmit={save}>
<h2 className="fr-title">Professional Details</h2>


<div className="fr-row">
<label className="fr-label">Area of expertise (comma separated)</label>
<input name="expertise" value={data.expertise} onChange={handle} className="fr-input" placeholder="UI, Frontend, React" />
</div>


<div className="fr-row fr-two-col">
<div>
<label className="fr-label">Years of experience</label>
<input name="years" value={data.years} onChange={handle} className="fr-input" placeholder="e.g. 5" />
</div>
<div>
<label className="fr-label">Job categories</label>
<input name="categories" value={data.categories} onChange={handle} className="fr-input" placeholder="Design, Web development" />
</div>
</div>


<div className="fr-row">
<label className="fr-label">Professional bio</label>
<textarea name="bio" value={data.bio} onChange={handle} className="fr-textarea" placeholder="Short summary about you..." rows={6} />
</div>


<div className="fr-actions">
<button className="fr-btn fr-btn-primary">Save</button>
</div>
</form>
</div>
);
}