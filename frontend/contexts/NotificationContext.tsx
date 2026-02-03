
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Zap, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  text: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (text: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((text: string, type: NotificationType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'success': return <CheckCircle2 size={24} className="text-white" />;
      case 'warning': return <AlertTriangle size={24} className="text-white" />;
      case 'error': return <XCircle size={24} className="text-white" />;
      default: return <Zap size={24} fill="currentColor" className="text-white" />;
    }
  };

  const getClasses = (type: NotificationType) => {
    switch(type) {
      case 'success': return 'bg-green-600 border-green-400/30 shadow-[0_0_60px_rgba(34,197,94,0.4)]';
      case 'warning': return 'bg-yellow-600 border-yellow-400/30 shadow-[0_0_60px_rgba(234,179,8,0.4)]';
      case 'error': return 'bg-red-600 border-red-400/30 shadow-[0_0_60px_rgba(239,68,68,0.4)]';
      default: return 'bg-indigo-600 border-indigo-400/30 shadow-[0_0_60px_rgba(79,70,229,0.4)]';
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-28 right-12 z-[100] space-y-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`${getClasses(n.type)} text-white px-8 py-5 rounded-[2rem] border animate-in slide-in-from-right-full flex items-center space-x-5 backdrop-blur-md bg-opacity-90 max-w-md pointer-events-auto`}>
             <div className="shrink-0">{getIcon(n.type)}</div>
             <span className="font-black text-xs uppercase tracking-[0.2em] leading-relaxed">{n.text}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
