import { CalendarEvent } from '../types';

export const notificationService = {
  isSupported(): boolean {
    return 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  },

  sendNotification(title: string, options?: NotificationOptions) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        ...options
      });
    } catch (e) {
      console.warn('Could not trigger notification', e);
    }
  },

  checkEventReminders(events: CalendarEvent[]) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;
    const now = new Date();
    
    for (const evt of events) {
      if (evt.isCompleted || !evt.startTime || evt.reminderMinutes === 0) continue;
      
      const eventTime = new Date(`${evt.date}T${evt.startTime}:00`);
      const reminderTime = new Date(eventTime.getTime() - evt.reminderMinutes * 60000);
      
      const diffSecs = Math.abs((now.getTime() - reminderTime.getTime()) / 1000);
      // If within 60 seconds of trigger
      if (diffSecs <= 60) {
        this.sendNotification(`Upcoming: ${evt.title}`, {
          body: `Starts at ${evt.startTime} (${evt.location ? 'Location: ' + evt.location : 'Ali Calendar Reminder'})`,
          tag: `evt-remind-${evt.id}`
        });
      }
    }
  }
};
