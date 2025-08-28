import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from './useLanguage.js';

// 农历数据（简化版本）
const lunarMonths = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 节气数据
const solarTerms = {
  1: { 5: '小寒', 20: '大寒' },
  2: { 4: '立春', 19: '雨水' },
  3: { 6: '惊蛰', 21: '春分' },
  4: { 5: '清明', 20: '谷雨' },
  5: { 6: '立夏', 21: '小满' },
  6: { 6: '芒种', 21: '夏至' },
  7: { 7: '小暑', 23: '大暑' },
  8: { 7: '立秋', 23: '处暑' },
  9: { 8: '白露', 23: '秋分' },
  10: { 8: '寒露', 23: '霜降' },
  11: { 7: '立冬', 22: '小雪' },
  12: { 7: '大雪', 22: '冬至' }
};

// 传统节日数据
const traditionalFestivals = {
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '4-1': '愚人节',
  '5-1': '劳动节',
  '6-1': '儿童节',
  '7-7': '七夕',
  '8-1': '建军节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '12-25': '圣诞节'
};

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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const key = `${month}-${day}`;
    
    // 简化的农历计算（实际项目中应使用专门的农历库）
    const lunarDay = currentLanguage.startsWith('zh') ? lunarDays[(day - 1) % 30] : '';
    const lunarMonth = currentLanguage.startsWith('zh') ? lunarMonths[(month - 1) % 12] : '';
    
    // 检查节气（仅中文显示）
    const solarTerm = currentLanguage.startsWith('zh') ? (solarTerms[month] && solarTerms[month][day]) : null;
    
    // 检查传统节日
    const festivalKey = Object.keys(translations.festivals || {}).find(key => {
      const festivalDate = traditionalFestivals[`${month}-${day}`];
      return festivalDate && translations.festivals[key];
    });
    const festival = festivalKey ? translations.festivals[festivalKey] : traditionalFestivals[key];
    
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
    weekDays,
    isToday,
    isSelected,
    changeMonth,
    goToToday,
    formatMonth,
    formatDate,
    addEvent,
    removeEvent,
    getEventsForDate,
    getEventsForMonth,
    getDateInfo
  };
};

