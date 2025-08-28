import { Lunar, Solar, LunarMonth } from 'lunar-javascript';

// Supported country/region codes
const REGIONS = {
  CN: 'CN', // China mainland
  TW: 'TW', // Taiwan
  JP: 'JP'  // Japan
};

// Language mapping
const LANGUAGE_MAP = {
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'en': 'en',
  'ja': 'ja'
};

// Lunar month and day names mapping
const LUNAR_TERMS = {
  'zh-CN': {
    monthNames: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    dayNames: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
              '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
              '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],
    leap: '闰'
  },
  'zh-TW': {
    monthNames: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'],
    dayNames: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
              '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
              '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],
    leap: '閏'
  },
  'en': {
    monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dayNames: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
              '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
              '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th'],
    leap: 'Leap '
  },
  'ja': {
    monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dayNames: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日',
              '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日',
              '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'],
    leap: '閏'
  }
};

/**
 * Convert solar date to lunar date
 * @param {Date} date - Solar date
 * @param {string} language - Language code
 * @returns {Object} Lunar information object
 */
export const solarToLunar = (date, language = 'zh-CN') => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const lang = LANGUAGE_MAP[language] || 'zh';
  const currentLanguage = language || 'zh-CN';
  
  // Get the lunar month object to determine if it's a leap month
  const lunarMonth = LunarMonth.fromYm(lunar.getYear(), lunar.getMonth());
  
  // Get the lunar month and day names in the corresponding language
  let monthIndex = lunar.getMonth() - 1;
  const dayIndex = lunar.getDay() - 1;
  
  let lunarMonthName, lunarDayName;
  
  // Ensure the language exists in the mapping table. If not, use Chinese by default.
  if (LUNAR_TERMS[currentLanguage]) {
    const terms = LUNAR_TERMS[currentLanguage];
    lunarMonthName = terms.monthNames[monthIndex];
    
    // Fix date name handling - ensure the date index is within the valid range.
    const safeDayIndex = Math.max(0, Math.min(29, dayIndex));
    lunarDayName = terms.dayNames[safeDayIndex];
    
      // Special handling for different languages
    if (currentLanguage === 'en') {
      // In English, add 'Month' after the lunar month number
      lunarMonthName = ' Month' + terms.monthNames[monthIndex] + ' ';
    } else if (currentLanguage === 'ja' || currentLanguage.startsWith('zh')) {
      // For Chinese and Japanese, add '月' after the lunar month number
      lunarMonthName = terms.monthNames[monthIndex] + '月';
    }
  } else {
    // Use Chinese by default
    lunarMonthName = lunar.getMonthInChinese();
    lunarDayName = lunar.getDayInChinese();
  }
  
  // Build the complete lunar date string according to different languages
  let fullString;
  
  switch (currentLanguage) {
    case 'zh-CN':
    case 'zh-TW':
      fullString = `${lunar.getYear()}年${lunarMonthName}月${lunarDayName}`;
      break;
    case 'en':
      fullString = `${lunarMonthName} Month ${lunarDayName}, ${lunar.getYear()}`;
      if (lunarMonth.isLeap()) {
        fullString = `Leap ${fullString}`;
      }
      break;
    case 'ja':
      fullString = `${lunar.getYear()}年${lunarMonthName}月${lunarDayName}`;
      if (lunarMonth.isLeap()) {
        fullString = `閏${fullString}`;
      }
      break;
    default:
      fullString = lang === 'zh' ? lunar.toString() : lunar.toFullString();
  }
  
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunarMonth.isLeap(),
    lunarMonthName: lunarMonthName,
    lunarDayName: lunarDayName,
    fullString: fullString,
    festivals: getFestivalsForDate(date, language),
    solarTerm: getSolarTermForDate(date, language)
  };
};

/**
 * Get holiday information for a specified date
 * @param {Date} date - Date
 * @param {string} language - Language code
 * @param {string} region - Region code
 * @returns {Array} Array of holidays
 */
export const getFestivalsForDate = (date, language = 'zh-CN', region = 'CN') => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const festivals = [];
  
  // Get solar festivals
  if (solar.getFestivals().length > 0) {
    solar.getFestivals().forEach(festival => {
      festivals.push({
        name: translateFestival(festival, language),
        type: 'solar',
        date: date
      });
    });
  }
  
  // Get lunar festivals
  if (lunar.getFestivals().length > 0) {
    lunar.getFestivals().forEach(festival => {
      festivals.push({
        name: translateFestival(festival, language),
        type: 'lunar',
        date: date
      });
    });
  }
  
  // Get region-specific holidays
  const regionFestivals = getRegionSpecificHolidays(date, region, language);
  festivals.push(...regionFestivals);
  
  return festivals;
};

/**
 * Get the solar term for a specified date
 * @param {Date} date - Date
 * @param {string} language - Language code
 * @returns {string|null} Solar term name
 */
export const getSolarTermForDate = (date, language = 'zh-CN') => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  // Get the solar term information
  const solarTerm = lunar.getJieQi();
  
  if (!solarTerm) return null;
  
  return translateSolarTerm(solarTerm, language);
};

/**
 * Get all holidays for a specified month
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {string} language - Language code
 * @param {string} region - Region code
 * @returns {Array} Array of holidays
 */
export const getHolidaysForMonth = (year, month, language = 'zh-CN', region = 'CN') => {
  const holidays = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayHolidays = getFestivalsForDate(date, language, region);
    
    if (dayHolidays.length > 0) {
      holidays.push({
        date: date,
        holidays: dayHolidays
      });
    }
  }
  
  return holidays;
};

/**
 * Translate the name of a festival
 * @param {string} festival - Festival name
 * @param {string} language - Language code
 * @returns {string} Translated festival name
 */
const translateFestival = (festival, language = 'zh-CN') => {
  // Add more festival multi-language translations as needed
  const translations = {
    'zh-CN': {
      '元旦': '元旦',
      '春节': '春节',
      '元宵节': '元宵节',
      '情人节': '情人节',
      '妇女节': '妇女节',
      '清明节': '清明节',
      '劳动节': '劳动节',
      '端午节': '端午节',
      '中秋节': '中秋节',
      '国庆节': '国庆节',
      '圣诞节': '圣诞节'
    },
    'zh-TW': {
      '元旦': '元旦',
      '春节': '春節',
      '元宵节': '元宵節',
      '情人节': '情人節',
      '妇女节': '婦女節',
      '清明节': '清明節',
      '劳动节': '勞動節',
      '端午节': '端午節',
      '中秋节': '中秋節',
      '国庆节': '國慶節',
      '圣诞节': '聖誕節'
    },
    'en': {
      '元旦': 'New Year\'s Day',
      '春节': 'Spring Festival',
      '元宵节': 'Lantern Festival',
      '情人节': 'Valentine\'s Day',
      '妇女节': 'Women\'s Day',
      '清明节': 'Qingming Festival',
      '劳动节': 'Labor Day',
      '端午节': 'Dragon Boat Festival',
      '中秋节': 'Mid-Autumn Festival',
      '国庆节': 'National Day',
      '圣诞节': 'Christmas Day'
    },
    'ja': {
      '元旦': '元日',
      '春节': '春節',
      '元宵节': '元宵節',
      '情人节': 'バレンタインデー',
      '妇女节': '女性の日',
      '清明节': '清明節',
      '劳动节': '労働者の日',
      '端午节': '端午の節句',
      '中秋节': '中秋節',
      '国庆节': '建国記念日',
      '圣诞节': 'クリスマス'
    }
  };
  
  if (translations[language] && translations[language][festival]) {
    return translations[language][festival];
  }
  
  // If no translation is found, return the original name
  return festival;
};

/**
 * Translate the name of a solar term
 * @param {string} solarTerm - Solar term name
 * @param {string} language - Language code
 * @returns {string} Translated solar term name
 */
const translateSolarTerm = (solarTerm, language = 'zh-CN') => {
  const translations = {
    'zh-CN': {
      '小寒': '小寒',
      '大寒': '大寒',
      '立春': '立春',
      '雨水': '雨水',
      '惊蛰': '惊蛰',
      '春分': '春分',
      '清明': '清明',
      '谷雨': '谷雨',
      '立夏': '立夏',
      '小满': '小满',
      '芒种': '芒种',
      '夏至': '夏至',
      '小暑': '小暑',
      '大暑': '大暑',
      '立秋': '立秋',
      '处暑': '处暑',
      '白露': '白露',
      '秋分': '秋分',
      '寒露': '寒露',
      '霜降': '霜降',
      '立冬': '立冬',
      '小雪': '小雪',
      '大雪': '大雪',
      '冬至': '冬至'
    },
    'zh-TW': {
      '小寒': '小寒',
      '大寒': '大寒',
      '立春': '立春',
      '雨水': '雨水',
      '惊蛰': '驚蟄',
      '春分': '春分',
      '清明': '清明',
      '谷雨': '穀雨',
      '立夏': '立夏',
      '小满': '小滿',
      '芒种': '芒種',
      '夏至': '夏至',
      '小暑': '小暑',
      '大暑': '大暑',
      '立秋': '立秋',
      '处暑': '處暑',
      '白露': '白露',
      '秋分': '秋分',
      '寒露': '寒露',
      '霜降': '霜降',
      '立冬': '立冬',
      '小雪': '小雪',
      '大雪': '大雪',
      '冬至': '冬至'
    },
    'en': {
      '小寒': 'Lesser Cold',
      '大寒': 'Greater Cold',
      '立春': 'Beginning of Spring',
      '雨水': 'Rain Water',
      '惊蛰': 'Awakening of Insects',
      '春分': 'Spring Equinox',
      '清明': 'Pure Brightness',
      '谷雨': 'Grain Rain',
      '立夏': 'Beginning of Summer',
      '小满': 'Lesser Fullness',
      '芒种': 'Grain in Ear',
      '夏至': 'Summer Solstice',
      '小暑': 'Lesser Heat',
      '大暑': 'Greater Heat',
      '立秋': 'Beginning of Autumn',
      '处暑': 'End of Heat',
      '白露': 'White Dew',
      '秋分': 'Autumn Equinox',
      '寒露': 'Cold Dew',
      '霜降': 'Frost Descent',
      '立冬': 'Beginning of Winter',
      '小雪': 'Lesser Snow',
      '大雪': 'Greater Snow',
      '冬至': 'Winter Solstice'
    },
    'ja': {
      '小寒': '小寒',
      '大寒': '大寒',
      '立春': '立春',
      '雨水': '雨水',
      '惊蛰': '啓蟄',
      '春分': '春分',
      '清明': '清明',
      '谷雨': '穀雨',
      '立夏': '立夏',
      '小满': '小満',
      '芒种': '芒種',
      '夏至': '夏至',
      '小暑': '小暑',
      '大暑': '大暑',
      '立秋': '立秋',
      '处暑': '処暑',
      '白露': '白露',
      '秋分': '秋分',
      '寒露': '寒露',
      '霜降': '霜降',
      '立冬': '立冬',
      '小雪': '小雪',
      '大雪': '大雪',
      '冬至': '冬至'
    }
  };
  
  if (translations[language] && translations[language][solarTerm]) {
    return translations[language][solarTerm];
  }
  
  return solarTerm;
};

/**
 * Get region-specific holidays for a specified date
 * @param {Date} date - Date
 * @param {string} region - Region code
 * @param {string} language - Language code
 * @returns {Array} Array of region-specific holidays
 */
const getRegionSpecificHolidays = (date, region, language) => {
  const holidays = [];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Add region-specific holidays
  switch (region) {
    case REGIONS.CN: // China
      // Add region-specific holidays for China
      break;
    case REGIONS.TW: // Taiwan
      // Add region-specific holidays for Taiwan
      if (month === 2 && day === 28) {
        holidays.push({
          name: language === 'zh-TW' ? '和平紀念日' : 'Peace Memorial Day',
          type: 'region',
          date: date
        });
      }
      break;
    case REGIONS.JP: // Japan
      // Add region-specific holidays for Japan
      if (month === 1 && day === 1) {
        holidays.push({
          name: language === 'ja' ? '元日' : 'New Year\'s Day',
          type: 'region',
          date: date
        });
      }
      if (month === 1 && day === 15) {
        holidays.push({
          name: language === 'ja' ? '成人の日' : 'Coming of Age Day',
          type: 'region',
          date: date
        });
      }
      if (month === 2 && day === 11) {
        holidays.push({
          name: language === 'ja' ? '建国記念の日' : 'National Foundation Day',
          type: 'region',
          date: date
        });
      }
      if (month === 3 && day === 21) {
        holidays.push({
          name: language === 'ja' ? '春分の日' : 'Spring Equinox Day',
          type: 'region',
          date: date
        });
      }
      break;
  }
  
  return holidays;
};

/**
 * Get detailed information for a specified date
 * @param {Date} date - Date
 * @param {string} language - Language code
 * @param {string} region - Region code
 * @returns {Object} Date details
 */
export const getDateDetail = (date, language = 'zh-CN', region = 'CN') => {
  const solarInfo = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay()
  };
  
  const lunarInfo = solarToLunar(date, language);
  const festivals = getFestivalsForDate(date, language, region);
  const solarTerm = getSolarTermForDate(date, language);
  
  return {
    solar: solarInfo,
    lunar: lunarInfo,
    festivals: festivals,
    solarTerm: solarTerm
  };
};

export default {
  solarToLunar,
  getFestivalsForDate,
  getSolarTermForDate,
  getHolidaysForMonth,
  getDateDetail,
  REGIONS
};