import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight, Filter } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

const AgendaView = ({ 
  events, 
  currentDate, 
  getEventsForDate,
  getEventsForMonth,
  removeEvent 
}) => {
  const { currentLanguage, t, formatDate } = useLanguage();
  const [filterType, setFilterType] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('date'); // date, title, type

  // Get filtered events
  const getFilteredEvents = () => {
    let filteredEvents = [...events];
    const today = new Date();
    
    switch (filterType) {
      case 'today':
        filteredEvents = getEventsForDate(today);
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= weekStart && eventDate <= weekEnd;
        });
        break;
      case 'month':
        filteredEvents = getEventsForMonth();
        break;
      default:
        // Show events for the next 30 days
        const futureLimit = new Date(today);
        futureLimit.setDate(today.getDate() + 30);
        filteredEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= futureLimit;
        });
    }

    // Sort events
    filteredEvents.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });

    return filteredEvents;
  };

  const filteredEvents = getFilteredEvents();

  // Group events by date
  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach(event => {
      const dateKey = event.date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(filteredEvents);

  const getEventTypeColor = (type) => {
    const colors = {
      work: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      personal: 'bg-green-500/20 text-green-400 border-green-500/30',
      meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      reminder: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[type] || colors.default;
  };

  const isEventToday = (eventDate) => {
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const isEventPast = (eventDate) => {
    const today = new Date();
    return eventDate < today;
  };

  return (
    <div className="flex-1 p-4">
      {/* Agenda View Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-light">{t('agenda')}</h2>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-button px-3 py-2 rounded-lg text-white text-sm bg-transparent border border-white/20"
          >
            <option value="all" className="bg-gray-800">{t('all')}</option>
            <option value="today" className="bg-gray-800">{t('today')}</option>
            <option value="week" className="bg-gray-800">{t('week')}</option>
            <option value="month" className="bg-gray-800">{t('month')}</option>
          </select>
          <button className="glass-button p-2 rounded-lg">
            <Filter className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-white text-2xl font-light mb-1">
            {getEventsForDate(new Date()).length}
          </div>
          <div className="text-white/70 text-sm">{t('todayEvents')}</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-white text-2xl font-light mb-1">
            {(() => {
              const today = new Date();
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              return events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= weekStart && eventDate <= weekEnd;
              }).length;
            })()}
          </div>
          <div className="text-white/70 text-sm">{t('weekEvents')}</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-white text-2xl font-light mb-1">
            {getEventsForMonth().length}
          </div>
          <div className="text-white/70 text-sm">{t('monthEvents')}</div>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
            const eventDate = new Date(dateKey);
            
            return (
              <div key={dateKey} className="glass-card rounded-2xl p-4">
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium
                    ${isEventToday(eventDate) 
                      ? 'bg-blue-500 text-white' 
                      : isEventPast(eventDate)
                        ? 'bg-gray-500/30 text-gray-400'
                        : 'bg-white/10 text-white'
                    }
                  `}>
                    {eventDate.getDate()}
                  </div>
                  <div>
                    <div className={`
                      text-lg font-medium
                      ${isEventToday(eventDate) 
                        ? 'text-blue-400' 
                        : isEventPast(eventDate)
                          ? 'text-gray-400'
                          : 'text-white'
                      }
                    `}>
                      {eventDate.toLocaleDateString(currentLanguage, { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-white/60 text-sm">
                      {dayEvents.length} {t('eventsCount')}
                    </div>
                  </div>
                  {isEventToday(eventDate) && (
                    <div className="ml-auto">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                        {t('today')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Event List */}
                <div className="space-y-3">
                  {dayEvents.map((event, index) => (
                    <div
                      key={event.id || index}
                      className={`
                        glass-card-dark rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]
                        ${isEventPast(eventDate) ? 'opacity-60' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-3 h-3 rounded-full mt-2 flex-shrink-0
                          ${event.type === 'work' ? 'bg-blue-400' :
                            event.type === 'personal' ? 'bg-green-400' :
                            event.type === 'meeting' ? 'bg-purple-400' :
                            'bg-gray-400'
                          }
                        `} />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{event.title}</h4>
                            {event.type && (
                              <span className={`
                                px-2 py-1 rounded-full text-xs border
                                ${getEventTypeColor(event.type)}
                              `}>
                                {event.type}
                              </span>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-white/70 text-sm mb-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            {event.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.time}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.attendees}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <div className="text-white/60 text-lg mb-2">{t('noEvents')}</div>
            <div className="text-white/40 text-sm">
              {filterType === 'today' ? t('noEventsToday') :
               filterType === 'week' ? t('noEventsWeek') :
               filterType === 'month' ? t('noEventsMonth') :
               t('noEventsRecent')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaView;