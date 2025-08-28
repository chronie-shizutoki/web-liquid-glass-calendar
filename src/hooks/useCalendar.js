import { useState, useMemo } from 'react';
import { useLanguage } from './useLanguage.js';
import lunarCalendar from '../lib/lunarCalendar.js';

export const useCalendar = (weekStart = 'sunday') => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const { currentLanguage, getTranslations } = useLanguage();
  const translations = getTranslations();

  // Get month data
  const getMonthData = useMemo(() => {
    return (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();

      // Get first day and last day of the month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Get day of the week for the first day (0=Sunday, 1=Monday...)
      let firstDayOfWeek = firstDay.getDay();
      
      // Adjust the first day based on weekStart
      if (weekStart === 'monday') {
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      } else if (weekStart === 'saturday') {
        firstDayOfWeek = (firstDayOfWeek + 1) % 7;
      }

      // Get the number of days in the current month
      const daysInMonth = lastDay.getDate();

      // Get the last few days of the previous month
      const prevMonth = new Date(year, month - 1, 0);
      const daysInPrevMonth = prevMonth.getDate();

      const days = [];

      // Add the last few days of the previous month
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        const fullDate = new Date(year, month - 1, date);
        days.push({
          date,
          isCurrentMonth: false,
          isPrevMonth: true,
          fullDate,
          ...getDateInfo(fullDate)
        });
      }

      // Add all days of the current month
      for (let date = 1; date <= daysInMonth; date++) {
        const fullDate = new Date(year, month, date);
        days.push({
          date,
          isCurrentMonth: true,
          isPrevMonth: false,
          fullDate,
          ...getDateInfo(fullDate)
        });
      }

      // Add the first few days of the next month to complete 6 rows
      const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
      for (let date = 1; date <= remainingDays; date++) {
        const fullDate = new Date(year, month + 1, date);
        days.push({
          date,
          isCurrentMonth: false,
          isPrevMonth: false,
          fullDate,
          ...getDateInfo(fullDate)
        });
      }

      return days;
    };
  }, [weekStart]);

  // Get date information (lunar calendar, solar terms, festivals, etc.)
  const getDateInfo = (date) => {
    // Select the region based on the current language
    let region = lunarCalendar.REGIONS.CN;
    if (currentLanguage === 'zh-TW') {
      region = lunarCalendar.REGIONS.TW;
    } else if (currentLanguage === 'ja') {
      region = lunarCalendar.REGIONS.JP;
    }

    // Use the lunarCalendar tool to get date details
    const dateDetail = lunarCalendar.getDateDetail(date, currentLanguage, region);
    
    // Extract the required information
    const lunarDay = dateDetail.lunar.lunarDayName || '';
    const lunarMonth = dateDetail.lunar.lunarMonthName || '';
    const solarTerm = dateDetail.solarTerm || null;
    
    // Get the first festival as the main festival to display
    const festival = dateDetail.festivals.length > 0 ? dateDetail.festivals[0].name : null;
    
    // Check if there are any events on this date
    const hasEvent = events.some(event =>
      event && event.date && event.date instanceof Date && 
      !isNaN(event.date.getTime()) &&
      event.date.toDateString() === date.toDateString()
    );

    return {
      lunarDay,
      lunarMonth,
      solarTerm,
      festival,
      hasEvent
    };
  };

  // Check if the date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if the date is selected
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Switch month
  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  // Switch week
  const changeWeek = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (increment * 7));
    setCurrentDate(newDate);
  };

  // Get week data
  const getWeekData = useMemo(() => {
    return (date) => {
      const startOfWeek = new Date(date);
      let day = startOfWeek.getDay();
      
      // Adjust the start of the week based on the weekStart setting
      if (weekStart === 'monday') {
        day = day === 0 ? 6 : day - 1;
      } else if (weekStart === 'saturday') {
        day = (day + 1) % 7;
      }
      
      startOfWeek.setDate(date.getDate() - day);
      
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        weekDays.push({
          date: currentDay.getDate(),
          fullDate: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === date.getMonth(),
          ...getDateInfo(currentDay)
        });
      }
      
      return weekDays;
    };
  }, [weekStart]);

  // Get current week data
  const weekData = useMemo(() => getWeekData(currentDate), [currentDate, getWeekData, events, currentLanguage]);

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Format month display
  const formatMonth = (date) => {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    if (currentLanguage.startsWith('zh')) {
      return `${year} / ${monthIndex + 1}`;
    } else if (currentLanguage === 'ja') {
      return `${year}年 ${monthIndex + 1}月`;
    } else {
      return `${translations.months[monthIndex]} ${year}`;
    }
  };

  // Format date display
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add event
  const addEvent = (event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() }]);
  };

  // Delete event
  const removeEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    // Defensive programming: ensure date is a valid Date object
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }
    
    return events.filter(event => {
      // Defensive programming: ensure event.date exists and is a valid Date object
      return event && event.date && event.date instanceof Date && 
             !isNaN(event.date.getTime()) &&
             event.date.toDateString() === date.toDateString();
    });
  };

  // Get all events for the current month
  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return events.filter(event => {
      // Defensive programming: ensure event.date exists and is a valid Date object
      return event && event.date && event.date instanceof Date && 
             !isNaN(event.date.getTime()) &&
             event.date.getFullYear() === year && 
             event.date.getMonth() === month;
    });
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const today = new Date();
    const upcomingEvents = [];
    
    // Check next 30 days for festivals
    for (let i = 1; i <= 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const dateInfo = getDateInfo(checkDate);
      
      // Add solar terms
      if (dateInfo.solarTerm) {
        upcomingEvents.push({
          name: dateInfo.solarTerm,
          date: new Date(checkDate),
          daysUntil: i,
          type: 'solarTerm',
          lunarDate: currentLanguage.startsWith('zh') ? `${dateInfo.lunarMonth}${dateInfo.lunarDay}` : null
        });
      }
      
      // Add festivals
      if (dateInfo.festival) {
        upcomingEvents.push({
          name: dateInfo.festival,
          date: new Date(checkDate),
          daysUntil: i,
          type: 'festival',
          lunarDate: currentLanguage.startsWith('zh') ? `${dateInfo.lunarMonth}${dateInfo.lunarDay}` : null
        });
      }
    }
    
    // Add user events
    events.forEach(event => {
      // Defensive programming: ensure event.date exists and is a valid Date object
      if (!event || !event.date || !(event.date instanceof Date) || isNaN(event.date.getTime())) {
        return;
      }
      
      const eventDate = new Date(event.date);
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays <= 30) {
        upcomingEvents.push({
          name: event.title || 'Untitled Event',
          date: eventDate,
          daysUntil: diffDays,
          type: 'userEvent',
          lunarDate: null
        });
      }
    });
    
    // Sort by days until, return the nearest one
    upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil);
    return upcomingEvents[0] || null;
  };

  // Week day titles - adjust order based on weekStart
  const weekDays = useMemo(() => {
    const days = translations.weekdays;
    if (weekStart === 'monday') {
      // Move Sunday to the end: Mon to Sun
      return [...days.slice(1), days[0]];
    } else if (weekStart === 'saturday') {
      // Move Saturday to the front: Sat, Sun, Mon to Fri
      return [days[6], ...days.slice(0, 6)];
    }
    return days;
  }, [translations.weekdays, weekStart]);

  // Get current month data
  const monthData = useMemo(() => getMonthData(currentDate), [currentDate, getMonthData, events, currentLanguage]);

  return {
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
    formatDate,
    addEvent,
    removeEvent,
    getEventsForDate,
    getEventsForMonth,
    getDateInfo,
    getUpcomingEvents
  };
};

