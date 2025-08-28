import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CalendarDays, CalendarRange, List, Settings } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useNavigation } from '../hooks/useNavigation.js';
import EventModal from './EventModal.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import WeekView from './WeekView.jsx';
import DesktopCalendarView from './DesktopCalendarView.jsx';
import AgendaView from './AgendaView.jsx';
import SettingsView from './SettingsView.jsx';

const Calendar = () => {
  // Set state
  const [showLunar, setShowLunar] = useState(() => {
    const saved = localStorage.getItem('calendar-show-lunar');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [weekStart, setWeekStart] = useState(() => {
    const saved = localStorage.getItem('calendar-week-start');
    return saved || 'sunday';
  });

  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    events,
    monthData,
    weekData,
    weekDays,
    isToday,
    isSelected,
    changeMonth,
    changeWeek,
    goToToday,
    formatMonth,
    addEvent,
    removeEvent,
    getEventsForDate,
    getEventsForMonth,
    getUpcomingEvents
  } = useCalendar(weekStart);

  const {
    currentLanguage,
    changeLanguage,
    t,
    formatDate
  } = useLanguage();

  const { currentView, switchView } = useNavigation();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-show-lunar', JSON.stringify(showLunar));
  }, [showLunar]);

  useEffect(() => {
    localStorage.setItem('calendar-week-start', weekStart);
  }, [weekStart]);

  // Handle date click
  const handleDateClick = (day) => {
    setSelectedDate(day.fullDate);
  };

  // Handle add event
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // Handle save event
  const handleSaveEvent = (eventData) => {
    addEvent(eventData);
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Get lunar display
  const getLunarDisplay = (day) => {
    if (!showLunar) return '';
    if (day.solarTerm) return day.solarTerm;
    if (day.festival) return day.festival;
    
    // Combine lunar month and date correctly according to different languages
    if (currentLanguage === 'en') {
      // In English: Add a space between the month and the date
      return `${day.lunarMonth} ${day.lunarDay}`;
    } else if (currentLanguage === 'ja') {
      // In Japanese: The month already contains the character "月", so directly concatenate the date
      return `${day.lunarMonth}${day.lunarDay}`;
    }
    
    // Default Chinese: Concatenate the month and date directly
    return day.lunarDay;
  };

  return (
    <div className="min-h-screen liquid-gradient-bg p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Top action bar */}
      {currentView !== 'settings' && (
        <div className="flex justify-between items-center mb-8 px-2 relative z-10">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentView === 'week' ? changeWeek(-1) : changeMonth(-1)}
              className="glass-button p-2 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => currentView === 'week' ? changeWeek(1) : changeMonth(1)}
              className="glass-button p-2 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={goToToday}
              className="glass-button px-4 py-2 rounded-full text-white text-sm"
            >
              {t('today')}
            </button>
          </div>

          {/* Right action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddEvent}
              className="glass-button p-3 rounded-full"
            >
              <Plus className="h-6 w-6 text-white" />
            </button>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={changeLanguage}
            />
            <button 
              onClick={() => switchView('settings')}
              className="glass-button p-3 rounded-full"
            >
              <Settings className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Main content area - display different components according to the current view */}
      <div className="flex-1 relative z-10 pb-20">
        {currentView === 'month' && (
          <div>
            {/* Month title */}
            <div className="text-white text-5xl font-light mb-8 px-2 shimmer">
              {formatMonth(currentDate)}
            </div>

            {/* Weekday titles */}
            <div className="grid grid-cols-7 gap-1 mb-4 px-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-white text-center py-2 text-sm font-medium opacity-80">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 px-2 mb-8">
              {monthData.map((day, index) => (
                <div
                  key={index}
                  className={`
                    date-cell p-3 text-center cursor-pointer rounded-lg relative
                    ${day.isCurrentMonth ? 'text-white' : 'text-white/40'}
                    ${isToday(day.fullDate) ? 'bg-blue-500 pulse-glow' : ''}
                    ${isSelected(day.fullDate) && !isToday(day.fullDate) ? 'glass-card' : ''}
                    ${!isToday(day.fullDate) && !isSelected(day.fullDate) ? 'hover:glass-card' : ''}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-lg font-medium">{day.date}</div>
                  {showLunar && (
                    <div className={`text-xs mt-1 ${day.solarTerm ? 'text-yellow-300' :
                      day.festival ? 'text-red-300' :
                        'text-white/60'
                      }`}>
                      {getLunarDisplay(day)}
                    </div>
                  )}

                  {/* Event Indicator */}
                  {day.hasEvent && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-red-400 rounded-full pulse-glow"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom event card */}
            <div className="space-y-4 px-2">
              {/* Selected date information */}
              <div className="glass-card rounded-2xl p-4 floating-animation">
                <div className="text-white text-lg font-medium mb-2">
                  {formatDate(selectedDate, {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
                {showLunar && (
                  <div className="text-white/70 text-sm mb-3">
                    {monthData.find(day => day.fullDate.toDateString() === selectedDate.toDateString())?.lunarMonth || ''}
                    {monthData.find(day => day.fullDate.toDateString() === selectedDate.toDateString())?.lunarDay || ''}
                  </div>
                )}

                {/* Selected date events list */}
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-2 glass-card rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{event.title}</div>
                          {event.time && (
                            <div className="text-white/60 text-xs">{event.time}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60 text-sm text-center py-4">
                    {t('noEvents')}
                  </div>
                )}
              </div>

              {/* Upcoming events */}
              {(() => {
                const upcomingEvent = getUpcomingEvents();
                if (upcomingEvent) {
                  return (
                    <div className="glass-card rounded-2xl p-4 flex justify-between items-center floating-animation" style={{ animationDelay: '1s' }}>
                      <div>
                        <div className="text-white text-lg font-medium">{upcomingEvent.name}</div>
                        <div className="text-white/70 text-sm">
                            {showLunar ? (upcomingEvent.lunarDate || formatDate(upcomingEvent.date)) : formatDate(upcomingEvent.date)}
                        </div>
                      </div>
                      <div className="text-white text-2xl font-light">
                        {upcomingEvent.daysUntil}<span className="text-sm">{currentLanguage.startsWith('zh') ? '天' : 'd'}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <WeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            changeWeek={changeWeek}
            weekData={weekData}
            weekDays={weekDays}
            isToday={isToday}
            isSelected={isSelected}
            getEventsForDate={getEventsForDate}
            getLunarDisplay={getLunarDisplay}
            showLunar={showLunar}
            weekStart={weekStart}
          />
        )}

        {currentView === 'desktop' && (
          <DesktopCalendarView
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            changeMonth={changeMonth}
            monthData={monthData}
            weekDays={weekDays}
            isToday={isToday}
            isSelected={isSelected}
            formatMonth={formatMonth}
            getEventsForDate={getEventsForDate}
            getLunarDisplay={getLunarDisplay}
            showLunar={showLunar}
            weekStart={weekStart}
          />
        )}

        {currentView === 'agenda' && (
          <AgendaView
            events={events}
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            getEventsForMonth={getEventsForMonth}
            removeEvent={removeEvent}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            events={events}
            addEvent={addEvent}
            removeEvent={removeEvent}
            currentLanguage={currentLanguage}
            changeLanguage={changeLanguage}
            showLunar={showLunar}
            setShowLunar={setShowLunar}
            weekStart={weekStart}
            setWeekStart={setWeekStart}
          />
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-card-dark border-t border-white/10 z-20">
        <div className="flex justify-around items-center py-3">
          {/* Month view */}
          <button
            onClick={() => switchView('month')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'month' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'month' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('month')}
            </span>
          </button>

          {/* Week view */}
          <button
            onClick={() => switchView('week')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'week' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'week' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('week')}
            </span>
          </button>

          {/* Desktop view */}
          <button
            onClick={() => switchView('desktop')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'desktop' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarRange className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'desktop' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('desktop')}
            </span>
          </button>

          {/* Agenda View */}
          <button
            onClick={() => switchView('agenda')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'agenda' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <List className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'agenda' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('agenda')}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => switchView('settings')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'settings' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'settings' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('settings')}
            </span>
          </button>
        </div>
      </div>

      {/* Event modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        initialEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;

