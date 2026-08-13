import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { CalendarEvent, EventCategory } from '../../types';
import { exportEventsToICS, exportEventsToCSV, parseICSContent, triggerFileDownload } from '../../utils/icsExportImport';
import { storageService } from '../../services/storageService';

interface EventsViewProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onRefreshEvents: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleComplete,
  onRefreshEvents
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [importStatus, setImportStatus] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchQuery = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchStatus = statusFilter === 'all' || 
        (statusFilter === 'completed' && e.isCompleted) || 
        (statusFilter === 'pending' && !e.isCompleted);
      return matchQuery && matchCat && matchStatus;
    }).sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')));
  }, [events, searchQuery, selectedCategory, statusFilter]);

  const handleExportICS = () => {
    const icsData = exportEventsToICS(events);
    triggerFileDownload(icsData, 'ali-calendar-events.ics', 'text/calendar');
  };

  const handleExportCSV = () => {
    const csvData = exportEventsToCSV(events);
    triggerFileDownload(csvData, 'ali-calendar-events.csv', 'text/csv');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      if (file.name.endsWith('.ics')) {
        const parsed = parseICSContent(content);
        let count = 0;
        for (const item of parsed) {
          if (item.title && item.date) {
            storageService.addEvent({
              title: item.title,
              date: item.date,
              startTime: item.startTime,
              allDay: item.allDay || false,
              description: item.description,
              location: item.location,
              category: item.category || 'personal',
              color: '#3b82f6',
              priority: 'medium',
              reminderMinutes: 15,
              repeat: 'none',
              isCompleted: false
            });
            count++;
          }
        }
        setImportStatus(`Successfully imported ${count} events from iCalendar.`);
        onRefreshEvents();
      } else if (file.name.endsWith('.json')) {
        const success = storageService.importFullJSON(content);
        if (success) {
          setImportStatus('Full JSON backup successfully restored!');
          onRefreshEvents();
        } else {
          setImportStatus('Failed to parse JSON backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="events-manager-container" className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <span>Events & Tasks Manager</span>
          </h2>
          <p className="text-xs text-slate-500">
            Total {events.length} events • {events.filter(e => !e.isCompleted).length} pending • {events.filter(e => e.isCompleted).length} completed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Export to ICS */}
          <button
            onClick={handleExportICS}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            title="Export to iCalendar (.ics)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ICS</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            title="Export to Spreadsheet (.csv)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Import file */}
          <label className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
            <input 
              type="file" 
              accept=".ics,.json" 
              onChange={handleImportFile}
              className="hidden" 
            />
          </label>

          {/* Add Event */}
          <button
            id="events-page-add-btn"
            onClick={onAddEvent}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex items-center justify-between border border-emerald-200 dark:border-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
          <button onClick={() => setImportStatus('')} className="text-xs font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events by title or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="meeting">Meeting</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
            <option value="holiday">Holiday</option>
            <option value="birthday">Birthday</option>
          </select>

          {/* Status */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {(['all', 'pending', 'completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No matching events found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an event or clear your search filters to view your calendar schedule.
          </p>
          <button
            onClick={onAddEvent}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                evt.isCompleted
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <button
                  onClick={() => onToggleComplete(evt.id)}
                  className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  title={evt.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                >
                  <CheckCircle2 className={`w-5 h-5 ${evt.isCompleted ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : ''}`} />
                </button>

                <div 
                  className="w-3 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: evt.color || '#6366f1' }}
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white ${evt.isCompleted ? 'line-through' : ''}`}>
                      {evt.title}
                    </h4>
                    {evt.priority === 'urgent' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {evt.allDay ? 'All Day' : `${evt.startTime || ''} - ${evt.endTime || ''}`}
                    </span>
                    {evt.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.location}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {evt.category}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onEditEvent(evt)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Edit Event"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
