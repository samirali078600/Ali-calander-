import { CalendarEvent } from '../types';

// RFC 5545 iCalendar ICS Generator
export function exportEventsToICS(events: CalendarEvent[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ali Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}@alicalendar.app`);
    lines.push(`DTSTAMP:${formatICSDate(new Date())}`);
    
    // Format Date & Time
    if (event.allDay || !event.startTime) {
      const cleanDate = event.date.replace(/-/g, '');
      lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      lines.push(`DTEND;VALUE=DATE:${cleanDate}`);
    } else {
      const startDateTime = new Date(`${event.date}T${event.startTime}:00`);
      lines.push(`DTSTART:${formatICSDate(startDateTime)}`);
      if (event.endTime) {
        const endDateTime = new Date(`${event.date}T${event.endTime}:00`);
        lines.push(`DTEND:${formatICSDate(endDateTime)}`);
      }
    }

    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }
    lines.push(`CATEGORIES:${event.category.toUpperCase()}`);
    lines.push(`STATUS:${event.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatICSDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeICS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// ICS Import Parser
export function parseICSContent(icsText: string): Partial<CalendarEvent>[] {
  const events: Partial<CalendarEvent>[] = [];
  const lines = icsText.split(/\r\n|\n|\r/);
  
  let inEvent = false;
  let currentEvent: Partial<CalendarEvent> = {};

  for (let line of lines) {
    line = line.trim();
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {
        id: `import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'personal',
        color: '#3b82f6',
        priority: 'medium',
        reminderMinutes: 15,
        repeat: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else if (line === 'END:VEVENT') {
      if (currentEvent.title && currentEvent.date) {
        events.push(currentEvent);
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8).replace(/\\n/g, ' ').replace(/\\,/g, ',').replace(/\\;/g, ';');
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9).replace(/\\,/g, ',');
      } else if (line.startsWith('DTSTART')) {
        const val = line.split(':')[1];
        if (val) {
          // Format YYYYMMDD or YYYYMMDDTHHMMSS
          const y = val.substring(0, 4);
          const m = val.substring(4, 6);
          const d = val.substring(6, 8);
          currentEvent.date = `${y}-${m}-${d}`;
          if (val.includes('T')) {
            const timePart = val.split('T')[1];
            const hh = timePart.substring(0, 2);
            const mm = timePart.substring(2, 4);
            currentEvent.startTime = `${hh}:${mm}`;
            currentEvent.allDay = false;
          } else {
            currentEvent.allDay = true;
          }
        }
      }
    }
  }

  return events;
}

// CSV Export
export function exportEventsToCSV(events: CalendarEvent[]): string {
  const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Category', 'Priority', 'Location', 'Description', 'Completed'];
  const rows = events.map(e => [
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${e.date || ''}"`,
    `"${e.startTime || ''}"`,
    `"${e.endTime || ''}"`,
    `"${e.category || ''}"`,
    `"${e.priority || ''}"`,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    `"${(e.description || '').replace(/"/g, '""')}"`,
    `"${e.isCompleted ? 'Yes' : 'No'}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Download Helper
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
