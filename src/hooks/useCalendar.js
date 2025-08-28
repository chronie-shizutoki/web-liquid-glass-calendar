import { useState, useMemo } from 'react';
import { useLanguage } from './useLanguage.js';
import lunarCalendar from '../lib/lunarCalendar.js';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const { currentLanguage, getTranslations } = useLanguage();
  const translations = getTranslations();

  // 获取月份数据
  const getMonthData = useMemo(() => {
    return (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();

      // 获取当月第一天和最后一天
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // 获取当月第一天是星期几（0=周日，1=周一...）
      const firstDayOfWeek = firstDay.getDay();

      // 获取当月天数
      const daysInMonth = lastDay.getDate();

      // 获取上个月的最后几天
      const prevMonth = new Date(year, month - 1, 0);
      const daysInPrevMonth = prevMonth.getDate();

      const days = [];

      // 添加上个月的最后几天
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

      // 添加当月的所有天
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

      // 添加下个月的前几天，补齐6行
      const remainingDays = 42 - days.length; // 6行 * 7天 = 42
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
  }, []);

  // 获取日期信息（农历、节气、节日等）
  const getDateInfo = (date) => {
    // 根据当前语言选择地区
    let region = lunarCalendar.REGIONS.CN;
    if (currentLanguage === 'zh-TW') {
      region = lunarCalendar.REGIONS.TW;
    } else if (currentLanguage === 'ja') {
      region = lunarCalendar.REGIONS.JP;
    }

    // 使用lunarCalendar工具获取日期详情
    const dateDetail = lunarCalendar.getDateDetail(date, currentLanguage, region);
    
    // 提取需要的信息
    const lunarDay = dateDetail.lunar.lunarDayName || '';
    const lunarMonth = dateDetail.lunar.lunarMonthName || '';
    const solarTerm = dateDetail.solarTerm || null;
    
    // 获取第一个节日作为主要节日显示
    const festival = dateDetail.festivals.length > 0 ? dateDetail.festivals[0].name : null;
    
    // 检查是否有事件
    const hasEvent = events.some(event =>
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

  // 检查是否是今天
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 检查是否是选中的日期
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // 切换月份
  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  // 切换周
  const changeWeek = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (increment * 7));
    setCurrentDate(newDate);
  };

  // 获取周数据
  const getWeekData = useMemo(() => {
    return (date) => {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
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
  }, []);

  // 获取当前周数据
  const weekData = useMemo(() => getWeekData(currentDate), [currentDate, getWeekData, events, currentLanguage]);

  // 跳转到今天
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // 格式化月份显示
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

  // 格式化日期显示
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 添加事件
  const addEvent = (event) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() }]);
  };

  // 删除事件
  const removeEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // 获取指定日期的事件
  const getEventsForDate = (date) => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  // 获取当前月份的所有事件
  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return events.filter(event => {
      const eventYear = event.date.getFullYear();
      const eventMonth = event.date.getMonth();
      return eventYear === year && eventMonth === month;
    });
  };

  // 获取即将到来的节日和事件
  const getUpcomingEvents = () => {
    const today = new Date();
    const upcomingEvents = [];
    
    // 检查接下来30天内的节日
    for (let i = 1; i <= 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const dateInfo = getDateInfo(checkDate);
      
      // 添加节气
      if (dateInfo.solarTerm) {
        upcomingEvents.push({
          name: dateInfo.solarTerm,
          date: new Date(checkDate),
          daysUntil: i,
          type: 'solarTerm',
          lunarDate: currentLanguage.startsWith('zh') ? `${dateInfo.lunarMonth}${dateInfo.lunarDay}` : null
        });
      }
      
      // 添加节日
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
    
    // 添加用户事件
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays <= 30) {
        upcomingEvents.push({
          name: event.title,
          date: eventDate,
          daysUntil: diffDays,
          type: 'userEvent',
          lunarDate: null
        });
      }
    });
    
    // 按天数排序，返回最近的一个
    upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil);
    return upcomingEvents[0] || null;
  };

  // 星期标题
  const weekDays = translations.weekdays;

  // 获取当前月份数据
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

