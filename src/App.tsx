import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { EventModal } from './components/common/EventModal';
import { SearchModal } from './components/common/SearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { CalendarView } from './components/calendar/CalendarView';
import { EventsView } from './components/events/EventsView';
import { DateExplorerView } from './components/date-explorer/DateExplorerView';
import { HolidaysView } from './components/holidays/HolidaysView';
import { FestivalsView } from './components/festivals/FestivalsView';
import { IslamicCalendarView } from './components/islamic/IslamicCalendarView';
import { PanchangView } from './components/panchang/PanchangView';
import { OnThisDayView } from './components/history/OnThisDayView';
import { FamousPeopleView } from './components/birthdays/FamousPeopleView';
import { DailyFactsView } from './components/facts/DailyFactsView';
import { AstronomyView } from './components/astronomy/AstronomyView';
import { DateToolsView } from './components/tools/DateToolsView';
import { CountdownsView } from './components/countdowns/CountdownsView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminContentView } from './components/admin/AdminContentView';
import { storageService, DEFAULT_SETTINGS } from './services/storageService';
import { notificationService } from './services/notificationService';
import { CalendarEvent, CountdownItem, UserSettings } from './types';
import { formatDateToISO } from './utils/dateCalculations';

export default function App() {
  // Navigation State
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Application Data States
  const [events, setEvents] = useState<CalendarEvent[]>(() => storageService.getEvents());
  const [countdowns, setCountdowns] = useState<CountdownItem[]>(() => storageService.getCountdowns());
  const [settings, setSettings] = useState<UserSettings>(() => storageService.getSettings());

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventModalInitialDate, setEventModalInitialDate] = useState<Date>(new Date());
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Apply Theme on Initial Mount
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Request Notification Permissions if enabled
  useEffect(() => {
    if (settings.notificationsEnabled) {
      notificationService.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  // Global Keyboard Shortcuts (Cmd+K for search, Cmd+E for new event)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setEditingEvent(null);
        setEventModalInitialDate(selectedDate);
        setIsEventModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate]);

  // Event Handlers
  const handleSaveEvent = (newEventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = storageService.addEvent(newEventData);
    setEvents(prev => [...prev, created]);
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleUpdateEvent = (updated: CalendarEvent) => {
    const res = storageService.updateEvent(updated);
    setEvents(prev => prev.map(e => e.id === res.id ? res : e));
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    storageService.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleToggleEventComplete = (id: string) => {
    const target = events.find(e => e.id === id);
    if (!target) return;
    const updated = { ...target, isCompleted: !target.isCompleted };
    handleUpdateEvent(updated);
  };

  const handleOpenAddEvent = (dateStr?: string) => {
    if (dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number);
      setEventModalInitialDate(new Date(y, m - 1, d));
    } else {
      setEventModalInitialDate(selectedDate);
    }
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventModalInitialDate(new Date(event.date));
    setIsEventModalOpen(true);
  };

  // Countdown Handlers
  const handleAddCountdown = (item: Omit<CountdownItem, 'id'>) => {
    const created = storageService.addCountdown(item);
    setCountdowns(prev => [...prev, created]);
  };

  const handleDeleteCountdown = (id: string) => {
    storageService.deleteCountdown(id);
    setCountdowns(prev => prev.filter(c => c.id !== id));
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleDataReset = () => {
    setEvents(storageService.getEvents());
    setCountdowns(storageService.getCountdowns());
    setSettings(storageService.getSettings());
  };

  // Navigation helpers
  const handleNavigateToExplorer = (date: Date) => {
    setSelectedDate(date);
    setCurrentSection('date-explorer');
  };

  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Sticky Header */}
      <Header
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAddEvent={() => handleOpenAddEvent()}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        selectedDate={selectedDate}
        onSelectToday={handleSelectToday}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        {/* Left Sidebar for Desktop */}
        <Sidebar
          currentSection={currentSection}
          onNavigate={setCurrentSection}
          onOpenAddEvent={() => handleOpenAddEvent()}
          eventCount={events.filter(e => !e.isCompleted).length}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Dynamic Center Stage Content View */}
        <main className="flex-1 w-full min-w-0 pb-20 lg:pb-8">
          {currentSection === 'dashboard' && (
            <DashboardView
              currentDate={selectedDate}
              events={events}
              countdowns={countdowns}
              settings={settings}
              onNavigate={setCurrentSection}
              onSelectDate={setSelectedDate}
              onOpenAddEvent={() => handleOpenAddEvent()}
              onToggleEventComplete={handleToggleEventComplete}
            />
          )}

          {currentSection === 'calendar' && (
            <CalendarView
              currentDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={events}
              settings={settings}
              onOpenAddEvent={handleOpenAddEvent}
              onNavigateToExplorer={handleNavigateToExplorer}
              onEditEvent={handleEditEvent}
            />
          )}

          {currentSection === 'events' && (
            <EventsView
              events={events}
              onAddEvent={() => handleOpenAddEvent()}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onToggleComplete={handleToggleEventComplete}
              onRefreshEvents={() => setEvents(storageService.getEvents())}
            />
          )}

          {currentSection === 'date-explorer' && (
            <DateExplorerView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              settings={settings}
              onOpenAddEvent={handleOpenAddEvent}
            />
          )}

          {currentSection === 'holidays' && (
            <HolidaysView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onSelectDate={setSelectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'festivals' && (
            <FestivalsView
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'islamic' && (
            <IslamicCalendarView
              currentDate={selectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'panchang' && (
            <PanchangView
              currentDate={selectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'history' && (
            <OnThisDayView
              currentDate={selectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'birthdays' && (
            <FamousPeopleView
              currentDate={selectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'facts' && (
            <DailyFactsView />
          )}

          {currentSection === 'astronomy' && (
            <AstronomyView
              currentDate={selectedDate}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'tools' && (
            <DateToolsView />
          )}

          {currentSection === 'countdowns' && (
            <CountdownsView
              countdowns={countdowns}
              onAddCountdown={handleAddCountdown}
              onDeleteCountdown={handleDeleteCountdown}
            />
          )}

          {currentSection === 'ai' && (
            <AIAssistantView
              onAddEventDirect={handleSaveEvent}
              onNavigateToExplorer={handleNavigateToExplorer}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onDataReset={handleDataReset}
            />
          )}

          {currentSection === 'admin' && (
            <AdminContentView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar & Drawer */}
      <MobileNav
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onOpenAddEvent={() => handleOpenAddEvent()}
        eventCount={events.filter(e => !e.isCompleted).length}
      />

      {/* Global Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        initialDate={eventModalInitialDate}
        editingEvent={editingEvent}
      />

      {/* Global Universal Search Palette Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        events={events}
        onSelectDate={setSelectedDate}
        onNavigate={setCurrentSection}
      />
    </div>
  );
}
