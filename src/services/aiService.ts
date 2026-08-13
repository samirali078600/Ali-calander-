import { CalendarEvent } from '../types';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedEvent?: Partial<CalendarEvent>;
}

export const aiService = {
  async sendMessage(message: string, context?: any): Promise<{ reply: string; parsedEvent?: Partial<CalendarEvent> | null }> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return {
        reply: data.reply || 'No response received.',
        parsedEvent: data.parsedEvent || null
      };
    } catch (err) {
      console.warn('AI request fallback:', err);
      // Offline / Local heuristic fallback
      return this.localHeuristicAssistant(message);
    }
  },

  async parseNaturalEvent(text: string): Promise<Partial<CalendarEvent> | null> {
    try {
      const res = await fetch('/api/gemini/parse-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('AI event parse fallback to local rules:', e);
      return this.localEventParser(text);
    }
  },

  localHeuristicAssistant(query: string): { reply: string; parsedEvent?: Partial<CalendarEvent> | null } {
    const q = query.toLowerCase();
    const today = new Date();

    if (q.includes('today') || q.includes("what's special")) {
      return {
        reply: `📅 **Today is ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}**.\n\n✨ **Highlights for today**:\n- International Left-Handers Day\n- Active Perseid Meteor Shower peak\n- Indian Independence Day preparations (2 days away on Aug 15)\n\nFeel free to explore the **Date Explorer** or **Astronomy** section for deep astronomical and historical timelines!`
      };
    }

    if (q.includes('15 august') || q.includes('independence')) {
      return {
        reply: `🇮🇳 **15 August 1947 — Indian Independence Day**\n\nOn this historic date, India gained independence from British colonial rule. Pandit Jawaharlal Nehru delivered his immortal "Tryst with Destiny" speech. This day is celebrated nationwide with the Prime Minister unfurling the Tiranga at the Red Fort, Delhi.`
      };
    }

    if (q.includes('add') || q.includes('schedule') || q.includes('event') || q.includes('exam')) {
      const parsed = this.localEventParser(query);
      return {
        reply: `I have extracted your event details:\n- **Title**: ${parsed.title || 'Personal Event'}\n- **Date**: ${parsed.date || 'Today'}\n- **Time**: ${parsed.startTime || 'All Day'}\n\nClick the button below to immediately add it to your calendar!`,
        parsedEvent: parsed
      };
    }

    return {
      reply: `I am your **Ali Calendar AI Assistant**! You can ask me to:\n- Schedule events: *"Add study session tomorrow at 4 PM"*\n- Query history: *"What happened on 26 January 1950?"*\n- Explain festivals: *"Tell me about Diwali or Eid"*\n- Calculate countdowns: *"How many days until New Year?"*`
    };
  },

  localEventParser(text: string): Partial<CalendarEvent> {
    const today = new Date();
    let targetDate = new Date(today);
    const lower = text.toLowerCase();

    if (lower.includes('tomorrow')) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    // Time matching (e.g. 10 am, 4:30 pm, 14:00)
    let startTime = '10:00';
    const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? timeMatch[2] : '00';
      const meridian = timeMatch[3].toLowerCase();
      if (meridian === 'pm' && h < 12) h += 12;
      if (meridian === 'am' && h === 12) h = 0;
      startTime = `${String(h).padStart(2, '0')}:${m}`;
    }

    // Clean title
    let title = text.replace(/add\s+|schedule\s+|on\s+|at\s+\d+.*|tomorrow|today/gi, '').trim();
    if (!title) title = 'New Calendar Event';

    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');

    return {
      title,
      date: `${y}-${m}-${d}`,
      startTime,
      allDay: !timeMatch,
      category: lower.includes('exam') || lower.includes('study') ? 'study' : lower.includes('meeting') || lower.includes('work') ? 'work' : 'personal',
      priority: 'medium',
      reminderMinutes: 15
    };
  }
};
