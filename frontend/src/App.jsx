import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Column from './components/Column.jsx';
import TaskModal from './components/TaskModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import * as api from './api.js';

export const STATUS_ORDER = ['todo', 'in_progress', 'done'];
export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmTask, setConfirmTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getTasks();
      setTasks(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (payload) => {
    const res = await api.createTask(payload);
    setTasks((prev) => [res.data, ...prev]);
    setModalOpen(false);
    showToast('Task created');
  };

  const changeStatus = async (id, status) => {
    const prev = tasks;
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, status } : t))
    );
    try {
      await api.updateTask(id, { status });
      setTasks((current) =>
        current.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (e) {
      setTasks(prev);
      showToast(e.message, 'error');
    }
  };

  const move = async (task, direction) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next =
      direction === 'next'
        ? STATUS_ORDER[Math.min(idx + 1, 2)]
        : STATUS_ORDER[Math.max(idx - 1, 0)];
    if (next === task.status) return;
    const prev = tasks;
    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );
    try {
      await api.moveTask(task.id, direction);
    } catch (e) {
      setTasks(prev);
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirmTask) return;
    const id = confirmTask.id;
    try {
      await api.deleteTask(id);
      setTasks((current) => current.filter((t) => t.id !== id));
      setConfirmTask(null);
      showToast('Task deleted');
    } catch (e) {
      showToast(e.message, 'error');
      setConfirmTask(null);
    }
  };

  const onDragStart = (task) => {
    setDragFrom(task);
  };

  const onDrop = async (targetStatus) => {
    if (!dragFrom || dragFrom.status === targetStatus) {
      setDragFrom(null);
      return;
    }
    await changeStatus(dragFrom.id, targetStatus);
    setDragFrom(null);
  };

  const groups = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  return (
    <div className="app-shell">
      <Header onCreate={() => setModalOpen(true)} taskCount={tasks.length} />

      <div className="shell">
        <div className="panel">
          <div className="panel-head">
            <span className="view-name">Board</span>
          </div>
          <main className="board">
            {error && <div className="board-error">⚠ {error}</div>}
            {STATUS_ORDER.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={groups[status]}
                onMove={move}
                onRequestDelete={setConfirmTask}
                onDragStart={onDragStart}
                onDrop={onDrop}
                isDragTarget={dragFrom && dragFrom.status !== status}
                loading={loading}
              />
            ))}
          </main>
        </div>
      </div>

      <Footer groups={groups} />

      {modalOpen && (
        <TaskModal
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
          showToast={showToast}
        />
      )}

      {confirmTask && (
        <ConfirmDialog
          task={confirmTask}
          onCancel={() => setConfirmTask(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && <Toast toast={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
