import { useState, useMemo } from 'react';
import { useLanguage } from './useLanguage.js';

// 农历数据
const lunarMonths = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 农历数据表 (1900-2050年) - 每个数字包含该年的月份信息
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63 // 2050
];

// 获取农历年的天数
const getLunarYearDays = (year) => {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
  }
  return sum + getLeapDays(year);
};

// 获取农历年闰月的天数
const getLeapDays = (year) => {
  if (getLeapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
};

// 获取农历年的闰月月份，没有闰月返回0
const getLeapMonth = (year) => {
  return lunarInfo[year - 1900] & 0xf;
};

// 获取农历月的天数
const getLunarMonthDays = (year, month) => {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
};

// 公历转农历
const solarToLunar = (solarYear, solarMonth, solarDay) => {
  // 参数校验
  if (solarYear < 1900 || solarYear > 2050) {
    // 超出范围时返回近似值
    const month = ((solarMonth - 1 + Math.floor(solarDay / 15)) % 12) + 1;
    const day = ((solarDay - 1) % 30) + 1;
    return {
      year: solarYear,
      month: month,
      day: day,
      isLeapMonth: false
    };
  }

  // 基准日期：1900年1月31日对应农历1900年正月初一
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(solarYear, solarMonth - 1, solarDay);

  // 计算天数差
  let offset = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

  let lunarYear = 1900;
  let lunarMonth = 1;
  let lunarDay = 1;
  let isLeapMonth = false;

  // 计算农历年
  let temp = 0;
  for (lunarYear = 1900; lunarYear < 2051 && offset > 0; lunarYear++) {
    temp = getLunarYearDays(lunarYear);
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    lunarYear--;
  }

  // 计算农历月
  const leap = getLeapMonth(lunarYear);
  let isLeap = false;

  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    // 闰月
    if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
      --lunarMonth;
      isLeap = true;
      temp = getLeapDays(lunarYear);
    } else {
      temp = getLunarMonthDays(lunarYear, lunarMonth);
    }

    // 解除闰月
    if (isLeap && lunarMonth === (leap + 1)) {
      isLeap = false;
      isLeapMonth = true;
    }

    offset -= temp;
    if (lunarMonth === leap) {
      isLeapMonth = false;
    }
  }

  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
    if (isLeap) {
      isLeapMonth = true;
    } else {
      isLeapMonth = false;
      --lunarMonth;
    }
  }

  if (offset < 0) {
    offset += temp;
    --lunarMonth;
  }

  lunarDay = offset + 1;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth: isLeapMonth
  };
};

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

// 传统节日数据（公历）
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

// 农历节日数据
const lunarFestivals = {
  '1-1': '春节',
  '1-15': '元宵节',
  '2-2': '龙抬头',
  '5-5': '端午节',
  '7-7': '七夕节',
  '7-15': '中元节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '12-8': '腊八节',
  '12-23': '小年',
  '12-30': '除夕'
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const key = `${month}-${day}`;

    // 农历计算
    let lunarDay = '';
    let lunarMonth = '';

    if (currentLanguage.startsWith('zh')) {
      const lunar = solarToLunar(year, month, day);
      lunarDay = lunarDays[lunar.day - 1] || '初一';
      lunarMonth = lunarMonths[lunar.month - 1] || '正月';
    }

    // 检查节气（仅中文显示）
    const solarTerm = currentLanguage.startsWith('zh') ? (solarTerms[month] && solarTerms[month][day]) : null;

    // 检查传统节日（公历）
    let festival = traditionalFestivals[key];

    // 检查农历节日
    if (currentLanguage.startsWith('zh') && !festival) {
      const lunar = solarToLunar(year, month, day);
      const lunarKey = `${lunar.month}-${lunar.day}`;
      festival = lunarFestivals[lunarKey];
    }

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

