import React, { useState } from 'react';
import api, { setAuthToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setAuthToken(res.data.token);
      nav('/admin');
    } catch (err) {
      setMsg('Login failed');
    }
  }

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div><input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input type="password" className="input" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:8}}><button className="button" type="submit">Login</button></div>
      </form>
      {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}
