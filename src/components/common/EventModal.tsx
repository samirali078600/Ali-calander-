import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  AlertCircle, 
  Repeat, 
  Bell, 
  FileText,
  Sparkles,
  Trash2,
  Copy
} from 'lucide-react';
import { CalendarEvent, EventCategory, EventPriority, RepeatFrequency } from '../../types';
import { formatDateToISO } from '../../utils/dateCalculations';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  initialDate?: Date;
  editingEvent?: CalendarEvent | null;
}

const CATEGORY_COLORS: Record<EventCategory, string> = {
  personal: '#8b5cf6',
  work: '#3b82f6',
  meeting: '#0284c7',
  reminder: '#f59e0b',
  birthday: '#ec4899',
  holiday: '#f97316',
  festival: '#10b981',
  study: '#6366f1',
  health: '#14b8a6',
  travel: '#06b6d4'
};

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  initialDate = new Date(),
  editingEvent = null
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateToISO(initialDate));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('personal');
  const [color, setColor] = useState(CATEGORY_COLORS.personal);
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [repeat, setRepeat] = useState<RepeatFrequency>('none');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setDate(editingEvent.date);
      setStartTime(editingEvent.startTime || '10:00');
      setEndTime(editingEvent.endTime || '11:00');
      setAllDay(editingEvent.allDay || false);
      setLocation(editingEvent.location || '');
      setCategory(editingEvent.category);
      setColor(editingEvent.color || CATEGORY_COLORS[editingEvent.category]);
      setPriority(editingEvent.priority);
      setReminderMinutes(editingEvent.reminderMinutes);
      setRepeat(editingEvent.repeat);
      setNotes(editingEvent.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setDate(formatDateToISO(initialDate));
      setStartTime('10:00');
      setEndTime('11:00');
      setAllDay(false);
      setLocation('');
      setCategory('personal');
      setColor(CATEGORY_COLORS.personal);
      setPriority('medium');
      setReminderMinutes(15);
      setRepeat('none');
      setNotes('');
    }
    setError('');
  }, [editingEvent, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: EventCategory) => {
    setCategory(newCat);
    setColor(CATEGORY_COLORS[newCat]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      allDay,
      location: location.trim() || undefined,
      category,
      color,
      priority,
      reminderMinutes,
      repeat,
      notes: notes.trim() || undefined
    };

    if (editingEvent && onUpdate) {
      onUpdate({
        ...editingEvent,
        ...payload,
        updatedAt: new Date().toISOString()
      });
    } else {
      onSave(payload);
    }
    onClose();
  };

  const handleDuplicate = () => {
    if (!title.trim()) return;
    onSave({
      title: `${title} (Copy)`,
      description,
      date,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      allDay,
      location,
      category,
      color,
      priority,
      reminderMinutes,
      repeat,
      notes
    });
    onClose();
  };

  return (
    <div 
      id="event-form-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="event-form-modal-box"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-3.5 h-3.5 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
              style={{ backgroundColor: color }}
            />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
          </div>
          <button
            id="close-event-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              id="event-title-input"
              type="text"
              required
              placeholder="e.g. Physics Final Exam, Team Sync, Flight to Mumbai"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Date & All Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date *
              </label>
              <div className="relative">
                <input
                  id="event-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                />
                <span>All Day Event</span>
              </label>
            </div>
          </div>

          {/* Time Picker */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="event-category-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="meeting">Meeting</option>
                <option value="study">Study / Exam</option>
                <option value="health">Health & Wellness</option>
                <option value="birthday">Birthday</option>
                <option value="holiday">Holiday</option>
                <option value="festival">Festival</option>
                <option value="travel">Travel</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location / Link
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Conference Hall B, Zoom Link, New Delhi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reminder & Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reminder
              </label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={0}>No reminder</option>
                <option value={5}>5 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={1440}>1 day before</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Repeat Frequency
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              placeholder="Add agenda, preparation notes, or important links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {editingEvent && onDelete && (
                <button
                  type="button"
                  id="delete-event-btn"
                  onClick={() => {
                    onDelete(editingEvent.id);
                    onClose();
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl text-xs font-semibold transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {editingEvent && (
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-colors"
                  title="Duplicate Event"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-event-submit-btn"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all"
              >
                {editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
