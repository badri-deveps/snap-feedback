import React, { useState } from 'react';
import api from '../api';

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(null);
  const [shareLink, setShareLink] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/feedback', { rating, comment });
      setMessage('Thanks for your feedback!');
      setShareLink(`${window.location.origin}/s/${res.data.data.shareId}`);
      setRating(5); setComment('');
    } catch (err) {
      setMessage('Error submitting feedback.');
    }
  }

  return (
    <div>
      <h2>Give Feedback</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label className="small">Rating (1-5)</label>
          <div className="row" style={{marginTop:6}}>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={()=>setRating(n)} style={{padding:'8px 10px', borderRadius:6, border: rating===n ? '2px solid #2563EB' : '1px solid #ddd'}}>{n} ★</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <label className="small">Comment (optional)</label>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} className="input" rows={4} />
        </div>
        <div>
          <button className="button" type="submit">Submit Feedback</button>
        </div>
      </form>

      {message && <div style={{marginTop:12}} className="small">{message}</div>}
      {shareLink && <div style={{marginTop:8}}><strong>Shareable link:</strong> <a href={shareLink} target="_blank" rel="noreferrer">{shareLink}</a></div>}
      <hr style={{marginTop:18}} />
      <div className="small">Tip: You can share the feedback link with stakeholders to show a single feedback item.</div>
    </div>
  );
}
