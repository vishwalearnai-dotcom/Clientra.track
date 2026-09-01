import React from 'react';
import { Task, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Send, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Edit3
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEditTask }) => {
  const { users, currentRole, updateTaskStatus, nudgeTask, deleteTask } = useApp();

  const assignee = users.find(u => u.id === task.assigneeId);

  const statusNextMap: Record<TaskStatus, TaskStatus | null> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: null
  };

  const statusPrevMap: Record<TaskStatus, TaskStatus | null> = {
    TODO: null,
    IN_PROGRESS: 'TODO',
    DONE: 'IN_PROGRESS'
  };

  const nextStatus = statusNextMap[task.status];
  const prevStatus = statusPrevMap[task.status];

  // Exact Requested Priorities: High: #e06666, Medium: #ffd966, Low: #93c47d
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#e06666', color: '#ffffff' };
      case 'Medium':
        return { backgroundColor: '#ffd966', color: '#0f172a' };
      case 'Low':
        return { backgroundColor: '#93c47d', color: '#0f172a' };
      default:
        return { backgroundColor: '#E8E9EB', color: '#0f172a' };
    }
  };

  return (
    <div className={`rounded-xl border p-4 transition-all bg-white hover:shadow-md ${
      task.status === 'DONE' 
        ? 'border-slate-200 bg-slate-50/70' 
        : !task.acknowledgedByEmployee && task.nudgedCount > 0
          ? 'border-slate-400 bg-slate-100 ring-1 ring-slate-400'
          : 'border-slate-200'
    }`}>
      
      {/* Top Header: Domain & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
          {task.domain}
        </span>

        {/* Priority Badge */}
        <span 
          style={getPriorityStyle(task.priority)}
          className="text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs"
        >
          {task.priority} Priority
        </span>
      </div>

      {/* Task Title */}
      <h3 className={`text-xs font-bold mb-1.5 leading-snug ${
        task.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-950'
      }`}>
        {task.title}
      </h3>

      {/* Head Info & Done status badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-[11px] font-medium text-slate-500">
          Head: <strong className="text-slate-900">{task.delegatedByHeadName}</strong>
        </p>

        {task.status === 'DONE' && (
          <span 
            style={{ backgroundColor: '#0B6623', color: '#ffffff' }}
            className="text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs"
          >
            Done
          </span>
        )}
      </div>

      {/* Assignee & Due Date */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <img 
            src={assignee?.avatar} 
            alt={assignee?.name} 
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
          />
          <span className="text-[11px] font-bold text-slate-800 truncate">{assignee?.name}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 shrink-0">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{task.dueDate}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {prevStatus && (
            <button
              onClick={() => updateTaskStatus(task.id, prevStatus)}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Move Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Remind Button: #E8E9EB */}
          {currentRole !== 'MEMBER' && task.status !== 'DONE' && (
            <button
              onClick={() => nudgeTask(task.id)}
              style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-slate-300 transition-colors border border-slate-300"
            >
              <Send className="w-3 h-3 text-slate-700" />
              <span>Remind</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {currentRole !== 'MEMBER' && (
            <button
              onClick={() => onEditTask(task)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {currentRole === 'ADMIN' && (
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Start and Complete Button: #d3d3d3 */}
          {nextStatus && (
            <button
              onClick={() => updateTaskStatus(task.id, nextStatus)}
              style={{ backgroundColor: '#d3d3d3', color: '#0f172a' }}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity shadow-2xs"
            >
              <span>{nextStatus === 'IN_PROGRESS' ? 'Start' : 'Complete'}</span>
              <ArrowRight className="w-3 h-3 text-slate-800" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
