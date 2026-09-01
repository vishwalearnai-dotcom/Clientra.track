import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Send } from 'lucide-react';

export const DailyDigestBanner: React.FC = () => {
  const { currentUser, currentRole, tasks, selectedMonth, nudgeAllDomainPendingTasks, acknowledgeTask } = useApp();

  const monthTasks = tasks.filter(t => t.month === selectedMonth);

  if (currentRole === 'MEMBER') {
    const myPendingTasks = monthTasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'DONE');
    const myUnacknowledged = myPendingTasks.filter(t => !t.acknowledgedByEmployee || t.nudgedCount > 0);

    if (myPendingTasks.length === 0) return null;

    return (
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 flex items-center justify-between gap-4 mb-6 text-slate-900">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-slate-700 shrink-0" />
          <p className="text-xs font-semibold">
            Member Workstation: You have <strong className="text-slate-950 font-bold">{myPendingTasks.length} active task(s)</strong> assigned to you for this month.
            {myUnacknowledged.length > 0 && (
              <span className="text-slate-950 font-extrabold ml-1">
                ({myUnacknowledged.length} pending daily reminder update)
              </span>
            )}
          </p>
        </div>

        {myUnacknowledged.length > 0 && (
          <button
            onClick={() => acknowledgeTask(myUnacknowledged[0].id)}
            style={{ backgroundColor: '#d3d3d3', color: '#0f172a' }}
            className="px-3 py-1 font-bold text-xs rounded-lg shadow-2xs hover:opacity-90 transition-opacity shrink-0"
          >
            Acknowledge Task
          </button>
        )}
      </div>
    );
  }

  const totalPending = monthTasks.filter(t => t.status !== 'DONE');
  if (totalPending.length === 0) return null;

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 flex items-center justify-between gap-4 mb-6 text-slate-900">
      <div className="flex items-center gap-3">
        <Bell className="w-4 h-4 text-slate-700 shrink-0" />
        <p className="text-xs font-semibold">
          {currentRole === 'ADMIN' ? 'Executive Overview:' : `${currentUser.domain} Overview:`} <strong className="text-slate-950">{totalPending.length} tasks</strong> are pending daily updates for this month.
        </p>
      </div>

      <button
        onClick={() => nudgeAllDomainPendingTasks()}
        style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
        className="flex items-center gap-1.5 px-3 py-1 font-bold text-xs rounded-lg hover:bg-slate-300 transition-colors border border-slate-300 shrink-0"
      >
        <Send className="w-3.5 h-3.5 text-slate-700" />
        <span>Send Reminders ({totalPending.length})</span>
      </button>
    </div>
  );
};
