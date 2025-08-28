// ICS格式工具函数

/**
 * 将事件列表转换为ICS格式字符串
 * @param {Array} events - 事件列表
 * @returns {string} ICS格式字符串
 */
export const convertEventsToIcs = (events) => {
  const icsContent = [];
  
  // ICS文件头部
  icsContent.push('BEGIN:VCALENDAR');
  icsContent.push('VERSION:2.0');
  icsContent.push('PRODID:-//Liquid Glass Calendar//mxm.dk//');
  
  // 为每个事件生成ICS条目
  events.forEach((event) => {
    const { id, title, description, location, attendees, date } = event;
    
    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${id}@liquidglasscalendar`);
    icsContent.push(`DTSTAMP:${formatIcsDate(new Date())}`);
    
    // 设置事件开始和结束时间
    const eventDate = new Date(date);
    icsContent.push(`DTSTART:${formatIcsDate(eventDate)}`);
    
    // 假设事件默认持续1小时
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    icsContent.push(`DTEND:${formatIcsDate(endDate)}`);
    
    // 添加事件标题
    if (title) {
      icsContent.push(`SUMMARY:${sanitizeIcsText(title)}`);
    }
    
    // 添加事件描述
    if (description) {
      icsContent.push(`DESCRIPTION:${sanitizeIcsText(description)}`);
    }
    
    // 添加事件地点
    if (location) {
      icsContent.push(`LOCATION:${sanitizeIcsText(location)}`);
    }
    
    // 添加参与者
    if (attendees && attendees.length > 0) {
      attendees.forEach((attendee) => {
        icsContent.push(`ATTENDEE:${sanitizeIcsText(attendee)}`);
      });
    }
    
    icsContent.push('END:VEVENT');
  });
  
  // ICS文件尾部
  icsContent.push('END:VCALENDAR');
  
  return icsContent.join('\r\n');
};

/**
 * 将ICS格式字符串解析为事件列表
 * @param {string} icsContent - ICS格式字符串
 * @returns {Array} 事件列表
 */
export const parseIcsToEvents = (icsContent) => {
  const events = [];
  const lines = icsContent.split(/\r\n|\n/);
  
  let currentEvent = null;
  let inEvent = false;
  
  lines.forEach((line) => {
    // 处理换行续行（以空格或制表符开头的行）
    if (line.match(/^[ \t]/)) {
      if (currentEvent && currentEvent.lastLine) {
        currentEvent.lastLine += line.substring(1);
        return;
      }
    }
    
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();
    
    if (key === 'BEGIN' && value === 'VEVENT') {
      inEvent = true;
      currentEvent = {
        id: generateEventId(),
        lastLine: null
      };
    } else if (key === 'END' && value === 'VEVENT') {
      inEvent = false;
      
      // 移除临时属性
      delete currentEvent.lastLine;
      
      // 转换日期格式
      if (currentEvent.dtstart) {
        currentEvent.date = parseIcsDate(currentEvent.dtstart);
        delete currentEvent.dtstart;
      }
      
      events.push(currentEvent);
    } else if (inEvent && key && value) {
      switch (key) {
        case 'SUMMARY':
          currentEvent.title = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value;
          break;
        case 'LOCATION':
          currentEvent.location = value;
          break;
        case 'DTSTART':
          currentEvent.dtstart = value;
          break;
        case 'ATTENDEE':
          if (!currentEvent.attendees) {
            currentEvent.attendees = [];
          }
          currentEvent.attendees.push(value);
          break;
        default:
          // 忽略其他不相关的字段
          break;
      }
    }
  });
  
  return events;
};

/**
 * 格式化日期为ICS格式
 * @param {Date} date - 日期对象
 * @returns {string} ICS格式日期字符串
 */
const formatIcsDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * 解析ICS格式日期为Date对象
 * @param {string} icsDate - ICS格式日期字符串
 * @returns {Date} Date对象
 */
const parseIcsDate = (icsDate) => {
  // 简单解析ISO格式日期，实际应用中可能需要更复杂的解析逻辑
  if (icsDate.includes('T')) {
    const [datePart, timePart] = icsDate.split('T');
    const year = datePart.substring(0, 4);
    const month = datePart.substring(4, 6) - 1; // 月份从0开始
    const day = datePart.substring(6, 8);
    
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (timePart) {
      hours = timePart.substring(0, 2);
      minutes = timePart.substring(2, 4);
      seconds = timePart.substring(4, 6).replace('Z', '');
    }
    
    return new Date(year, month, day, hours, minutes, seconds);
  }
  
  return new Date(icsDate);
};

/**
 * 清理ICS文本中的特殊字符
 * @param {string} text - 需要清理的文本
 * @returns {string} 清理后的文本
 */
const sanitizeIcsText = (text) => {
  if (!text) return '';
  
  // 替换换行符为 \n
  // 转义分号、逗号和反斜杠
  return text
    .replace(/\\/g, '\\\\') // 转义反斜杠
    .replace(/;/g, '\\;')    // 转义分号
    .replace(/,/g, '\\,')    // 转义逗号
    .replace(/\n/g, '\\n');  // 转义换行符
};

/**
 * 生成事件ID
 * @returns {string} 唯一ID
 */
const generateEventId = () => {
  return Math.random().toString(36).substr(2, 9);
};