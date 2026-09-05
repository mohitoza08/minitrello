import React from 'react';

export default function Header({ onCreate, taskCount }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="ws" onClick={onCreate} title="Mini-Trello">
          <span className="ws-mark">MT</span>
          <span className="ws-name">Mini-Trello</span>
          <svg
            className="caret brand-chevron"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="topbar-right">
        <span className="stat-chip" title={`${taskCount} tasks`}>
          <span className="stat-dot" />
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </span>
        <button className="btn btn-primary" onClick={onCreate}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.1"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create new task
        </button>
      </div>
    </header>
  );
}
