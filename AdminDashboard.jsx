import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard({ token, setToken }) {
  const nav = useNavigate();
  useEffect(()=> { if (!token) nav('/login'); }, [token, nav]);

  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState([]);
  const [trend, setTrend] = useState([]);
  const [page, setPage] = useState(1);
  const [filterResolved, setFilterResolved] = useState('');

  async function load() {
    try {
      const q = {};
      if (filterResolved !== '') q.resolved = filterResolved;
      const res = await api.get('/feedback', { params: { ...q, page, limit: 30 } });
      setItems(res.data.items || res.data.items);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAnalytics() {
    try {
      const res = await api.get('/feedback/analytics/summary');
      setCounts(res.data.counts || []);
      setTrend(res.data.trend || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=> { load(); loadAnalytics(); }, [page, filterResolved]);

  async function toggleResolve(id, current) {
    await api.put(`/feedback/${id}/resolve`, { resolved: !current });
    load();
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <div className="small">Analytics: counts by rating</div>
        <div className="small">{counts.map(c => `${c._id}: ${c.count}`).join(' • ')}</div>
        <button className="button" onClick={()=>{ setToken(null); localStorage.removeItem('sf_token'); nav('/login'); }}>Logout</button>
      </div>

      <div style={{marginBottom:12}}>
        <label className="small">Filter</label>
        <select value={filterResolved} onChange={e => setFilterResolved(e.target.value)}>
          <option value=''>All</option>
          <option value='true'>Resolved</option>
          <option value='false'>Unresolved</option>
        </select>
      </div>

      <div className="feedback-list">
        {items.length === 0 && <div className="small">No feedback yet</div>}
        {items.map(f => (
          <div key={f._id} className="feedback-item">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><strong>★ {f.rating}</strong> <span className="small">• {new Date(f.createdAt).toLocaleString()}</span></div>
              <div>
                <a href={`/s/${f.shareId}`} target="_blank" rel="noreferrer" className="small">share</a>
                <button style={{marginLeft:8}} className="button" onClick={()=>toggleResolve(f._id, f.resolved)}>{f.resolved ? 'Mark Unresolved' : 'Resolve'}</button>
              </div>
            </div>
            <div style={{marginTop:8}}>{f.comment || <span className="small">— no comment —</span>}</div>
            <div className="small" style={{marginTop:6}}>{f.resolved ? '✅ Resolved' : 'Unresolved'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
