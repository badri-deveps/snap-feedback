import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import api, { setAuthToken } from './api';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

function Nav({ token, setToken }) {
  const navigate = useNavigate();
  return (
    <div style={{marginBottom:12}} className="header">
      <div>
        <Link to="/"><strong>Snap Feedback</strong></Link>
        <span className="small" style={{marginLeft:10}}>• Instant user feedback</span>
      </div>
      <div>
        <Link to="/"><button className="button">Give Feedback</button></Link>
        <Link to="/admin" style={{marginLeft:8}}><button className="button">Admin</button></Link>
        {token && <button style={{marginLeft:8}} className="button" onClick={() => { setToken(null); setAuthToken(null); localStorage.removeItem('sf_token'); navigate('/admin'); }}>Logout</button>}
      </div>
    </div>
  );
}

export default function App() {
  const [token, setTokenState] = useState(localStorage.getItem('sf_token') || null);
  useEffect(()=>{ setAuthToken(token); }, [token]);
  function setToken(t) { setTokenState(t); if (t) localStorage.setItem('sf_token', t); else localStorage.removeItem('sf_token'); }
  return (
    <BrowserRouter>
      <div className="container">
        <Nav token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/s/:shareId" element={<ShareView />} />
          <Route path="/admin" element={<AdminDashboard token={token} setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function ShareView() {
  const { shareId } = useParams();
  const [fb, setFb] = useState(null);
  useEffect(()=> {
    api.get(`/feedback/s/${shareId}`).then(r => setFb(r.data)).catch(()=> setFb(null));
  }, [shareId]);
  if (!fb) return <div>Loading or not found</div>;
  return (
    <div>
      <h2>Shared Feedback</h2>
      <div className="feedback-item">
        <div><span className="star">★ {fb.rating}</span> <span className="small">on {new Date(fb.createdAt).toLocaleString()}</span></div>
        <div style={{marginTop:8}}>{fb.comment}</div>
      </div>
    </div>
  );
}
