// ICS格式工具函数
import ICAL from 'ical.js';

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
    if (attendees) {
      // 确保attendees是数组
      if (Array.isArray(attendees)) {
        attendees.forEach((attendee) => {
          icsContent.push(`ATTENDEE:${sanitizeIcsText(attendee)}`);
        });
      } else if (typeof attendees === 'string') {
        // 如果attendees是字符串，直接添加
        icsContent.push(`ATTENDEE:${sanitizeIcsText(attendees)}`);
      }
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
  try {
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');
    
    return events.map((eventComp, index) => {
      // 创建事件对象
      const event = {
        id: generateEventId(),
        title: '',
        description: '',
        location: '',
        attendees: [],
        date: new Date() // 默认为当前日期，避免日期为空
      };
      
      // 解析事件标题
      const summary = eventComp.getFirstPropertyValue('summary');
      if (summary) {
        event.title = summary;
      }
      
      // 解析事件描述
      const description = eventComp.getFirstPropertyValue('description');
      if (description) {
        event.description = description;
      }
      
      // 解析事件地点
      const location = eventComp.getFirstPropertyValue('location');
      if (location) {
        event.location = location;
      }
      
      // 解析参与者
      const attendeeProps = eventComp.getAllProperties('attendee');
      if (attendeeProps.length > 0) {
        event.attendees = attendeeProps.map(prop => {
          const attendee = prop.getFirstValue();
          return typeof attendee === 'string' ? attendee : attendee.toString();
        });
      }
      
      // 解析事件日期
      const dtstart = eventComp.getFirstProperty('dtstart');
      if (dtstart) {
        const dateTime = dtstart.getFirstValue();
        if (dateTime) {
          event.date = new Date(dateTime.toJSDate());
        }
      }
      
      // 确保event.date始终是有效的Date对象
      if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
        event.date = new Date();
      }
      
      return event;
    }).filter(event => {
      // 过滤掉无效事件（确保日期存在且有效）
      return event.date && event.date instanceof Date && !isNaN(event.date.getTime());
    });
  } catch (error) {
    console.error('解析ICS文件失败:', error);
    return [];
  }
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