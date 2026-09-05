import React, { useRef } from 'react';
import { STATUS_LABELS, STATUS_ORDER } from '../App.jsx';

function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function TaskCard({
  task,
  onMove,
  onRequestDelete,
  onDragStart,
}) {
  const cardRef = useRef(null);
  const idx = STATUS_ORDER.indexOf(task.status);
  const canPrev = idx > 0;
  const canNext = idx < STATUS_ORDER.length - 1;

  const handleTilt = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    el.style.setProperty('--spx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spy', `${e.clientY - rect.top}px`);
    void x;
  };

  return (
    <article
      ref={cardRef}
      className="task-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(task);
      }}
      onMouseMove={handleTilt}
    >
      <div className="card-title">
        <span className={`marker marker-${task.status}`} />
        <span className="nm" title={task.title}>
          {task.title}
        </span>
      </div>

      <p className="card-desc" title={task.description}>
        {task.description}
      </p>

      <div className="meta-row">
        {task.assigned_to ? (
          <>
            <span className="avatar">
              {task.assigned_to.charAt(0).toUpperCase()}
            </span>
            <span className="value">{task.assigned_to}</span>
          </>
        ) : (
          <span className="value" />
        )}
        <span className="date-chip">{formatDate(task.createdAt)}</span>
      </div>

      <div className="card-bottom">
        <div className="track" title={STATUS_LABELS[task.status]}>
          {STATUS_ORDER.map((s) => (
            <span
              key={s}
              className={`track-node ${s === task.status ? `active-${s}` : ''}`}
            />
          ))}
        </div>

        <div className="card-actions">
          <button
            className="card-action"
            disabled={!canPrev}
            title="Move to previous column"
            aria-label="Move backward"
            onClick={() => onMove(task, 'prev')}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
          </button>

          <button
            className="card-action"
            disabled={!canNext}
            title="Move to next column"
            aria-label="Move forward"
            onClick={() => onMove(task, 'next')}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
            </svg>
          </button>

          <button
            className="card-action danger"
            title="Delete task"
            aria-label="Delete task"
            onClick={() => onRequestDelete(task)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
