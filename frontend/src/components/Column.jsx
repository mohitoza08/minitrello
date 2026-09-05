import React, { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import { STATUS_LABELS } from '../App.jsx';

export default function Column({
  status,
  tasks,
  onMove,
  onRequestDelete,
  onDragStart,
  onDrop,
  isDragTarget,
  loading,
}) {
  const [draggingOver, setDraggingOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggingOver(false);
    onDrop(status);
  };

  return (
    <section
      className={`column col column-${status} ${isDragTarget ? 'drag-suggest' : ''} ${
        draggingOver ? 'dragging-over' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!draggingOver) setDraggingOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDraggingOver(false);
      }}
      onDrop={handleDrop}
    >
      <div className="column-head col-head">
        <span className={`tag tag-${status}`}>{STATUS_LABELS[status]}</span>
        <span className="count-badge col-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {loading ? (
          <div className="skeleton-list">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className={`empty-orb orb-${status}`} />
            <p className="empty-title">Nothing here yet</p>
            <p className="empty-sub">Drag a card here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onRequestDelete={onRequestDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </section>
  );
}
