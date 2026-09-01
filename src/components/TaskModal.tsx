import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, Priority, DomainName } from '../types';
import { X, CheckSquare } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit
}) => {
  const { users, domains, currentUser, currentRole, selectedMonth, addTask, updateTask } = useApp();

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<DomainName>('Sales');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');

  // Members filterable by Lead scope or Admin
  const availableAssignees = users.filter(u => {
    if (currentRole === 'LEAD') {
      return u.headName === currentUser.headName || u.domain === currentUser.domain;
    }
    return true; // Admin sees all
  });

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDomain(taskToEdit.domain);
      setAssigneeId(taskToEdit.assigneeId);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate);
    } else {
      setTitle('');
      setDomain(currentUser.domain || 'Sales');
      setAssigneeId(availableAssignees[0]?.id || users[0].id);
      setPriority('High');
      setStatus('TODO');
      
      const future = new Date();
      future.setDate(future.getDate() + 5);
      setDueDate(future.toISOString().split('T')[0]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedUser = users.find(u => u.id === assigneeId);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        domain,
        assigneeId,
        priority,
        status,
        dueDate
      });
    } else {
      addTask({
        title,
        domain,
        assigneeId,
        delegatedByHeadName: assignedUser?.headName || currentUser.name,
        status,
        priority,
        dueDate,
        month: selectedMonth
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-slate-900" />
            <h2 className="text-sm font-bold text-slate-950">
              {taskToEdit ? 'Edit Task' : 'Delegate Monthly Task'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Description *</label>
            <input 
              type="text"
              required
              placeholder="e.g. Complete Q3 Enterprise Client Pitch"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value as DomainName)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                {domains.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.headName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                {availableAssignees.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.domain} - Head: {u.headName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Due Date</label>
              <input 
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
            >
              {taskToEdit ? 'Save Task' : 'Delegate Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
