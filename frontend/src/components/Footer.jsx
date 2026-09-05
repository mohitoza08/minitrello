import React from 'react';
import { STATUS_LABELS, STATUS_ORDER } from '../App.jsx';

export default function Footer({ groups }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-stats">
          {STATUS_ORDER.map((status) => (
            <span key={status} className="footer-stat">
              <span className={`footer-dot dot-${status}`} />
              {STATUS_LABELS[status]}
              <span className="footer-count">
                {groups[status] ? groups[status].length : 0}
              </span>
            </span>
          ))}
        </div>

        <div className="footer-divider" />

        <div className="footer-meta">
          <span className="footer-proj">Mini-Trello · Kanban Board</span>
          <span className="footer-made">
            Made by <strong>Mohit Oza</strong> · 7IT-08
          </span>
        </div>

        <div className="footer-tech">
          <span className="tech-pill">React</span>
          <span className="tech-pill">Express</span>
          <span className="tech-pill">Supabase</span>
        </div>
      </div>
    </footer>
  );
}
