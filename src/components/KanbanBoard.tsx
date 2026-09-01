import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, DomainName } from '../types';
import { TaskCard } from './TaskCard';
import { 
  Search, 
  Circle, 
  Clock, 
  CheckCircle2, 
  Building2,
  Send,
  Calendar
} from 'lucide-react';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask }) => {
  const { tasks, domains, currentUser, currentRole, selectedMonth, nudgeAllDomainPendingTasks } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const monthTasks = tasks.filter(t => t.month === selectedMonth);

  const filteredTasks = monthTasks.filter(task => {
    if (currentRole === 'MEMBER' && task.assigneeId !== currentUser.id) {
      return false;
    }

    if (currentRole === 'LEAD' && task.delegatedByHeadName !== currentUser.headName && task.domain !== currentUser.domain) {
      return false;
    }

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || task.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; badgeStyle: React.CSSProperties }[] = [
    { 
      id: 'TODO', 
      title: 'To Do', 
      icon: <Circle className="w-4 h-4 text-slate-400" />,
      badgeStyle: { backgroundColor: '#e2e8f0', color: '#0f172a' }
    },
    { 
      id: 'IN_PROGRESS', 
      title: 'In Progress', 
      icon: <Clock className="w-4 h-4 text-slate-900" />,
      badgeStyle: { backgroundColor: '#cbd5e1', color: '#0f172a' }
    },
    { 
      id: 'DONE', 
      title: 'Completed', 
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
      badgeStyle: { backgroundColor: '#0B6623', color: '#ffffff' }
    }
  ];

  const monthLabel = selectedMonth === '2026-09' ? 'September 2026' : selectedMonth === '2026-08' ? 'August 2026' : 'October 2026';

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={currentRole === 'MEMBER' ? "Search my tasks..." : "Search domain tasks..."}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none transition-colors"
          />
        </div>

        {/* Info & Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>{monthLabel}</span>
          </div>

          {currentRole !== 'MEMBER' && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Domains</option>
                {domains.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.headName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentRole !== 'MEMBER' && (
            <button
              onClick={() => nudgeAllDomainPendingTasks(selectedDomain === 'ALL' ? undefined : (selectedDomain as DomainName))}
              style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors border border-slate-300"
            >
              <Send className="w-3.5 h-3.5 text-slate-700" />
              <span>Remind Pending</span>
            </button>
          )}
        </div>

      </div>

      {/* Storyboard Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[500px]">
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-sm font-bold text-slate-950">{col.title}</h3>
                </div>
                <span 
                  style={col.badgeStyle}
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs"
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1 custom-scrollbar">
                {colTasks.length > 0 ? (
                  colTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onEditTask={onEditTask} 
                    />
                  ))
                ) : (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                    No tasks in {col.title}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
