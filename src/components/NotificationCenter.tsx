import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Clock, Send } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const myNotifs = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white border-l border-slate-200 shadow-xl flex flex-col">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Task Notifications</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Recipient: <strong className="text-slate-800">{currentUser.name}</strong></span>
            {myNotifs.some(n => !n.read) && (
              <button onClick={markAllNotificationsRead} className="text-blue-600 hover:underline font-semibold flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {myNotifs.length > 0 ? (
              myNotifs.map(n => (
                <div 
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    !n.read ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                  </div>
                  <p className="text-slate-600 mt-1">{n.message}</p>
                </div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                No notifications for {currentUser.name}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
