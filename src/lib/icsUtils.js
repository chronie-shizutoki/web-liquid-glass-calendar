// ICS format utility functions
import ICAL from 'ical.js';

/**
 * Convert a list of events to ICS format string
 * @param {Array} events - Event list
 * @returns {string} ICS format string
 */
export const convertEventsToIcs = (events) => {
  const icsContent = [];
  
  // ICS file header
  icsContent.push('BEGIN:VCALENDAR');
  icsContent.push('VERSION:2.0');
  icsContent.push('PRODID:-//Liquid Glass Calendar//mxm.dk//');
  
  // Generate ICS entry for each event
  events.forEach((event) => {
    const { id, title, description, location, attendees, date } = event;
    
    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${id}@liquidglasscalendar`);
    icsContent.push(`DTSTAMP:${formatIcsDate(new Date())}`);
    
    // Set event start and end time
    const eventDate = new Date(date);
    icsContent.push(`DTSTART:${formatIcsDate(eventDate)}`);
    
    // Set event end time (default 1 hour duration)
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    icsContent.push(`DTEND:${formatIcsDate(endDate)}`);
    
    // Add event title
    if (title) {
      icsContent.push(`SUMMARY:${sanitizeIcsText(title)}`);
    }
    
    // Add event description
    if (description) {
      icsContent.push(`DESCRIPTION:${sanitizeIcsText(description)}`);
    }
    
    // Add event location
    if (location) {
      icsContent.push(`LOCATION:${sanitizeIcsText(location)}`);
    }
    
    // Add attendees
    if (attendees) {
      // Ensure attendees is an array
      if (Array.isArray(attendees)) {
        attendees.forEach((attendee) => {
          icsContent.push(`ATTENDEE:${sanitizeIcsText(attendee)}`);
        });
      } else if (typeof attendees === 'string') {
        // If attendees is a string, add directly
        icsContent.push(`ATTENDEE:${sanitizeIcsText(attendees)}`);
      }
    }
    
    icsContent.push('END:VEVENT');
  });
  
  // ICS file footer
  icsContent.push('END:VCALENDAR');
  
  return icsContent.join('\r\n');
};

/**
 * Parse ICS format string to event list
 * @param {string} icsContent - ICS format string
 * @returns {Array} Event list
 */
export const parseIcsToEvents = (icsContent) => {
  try {
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');
    
    return events.map((eventComp, index) => {
      // Create event object
      const event = {
        id: generateEventId(),
        title: '',
        description: '',
        location: '',
        attendees: [],
        date: new Date() // Default to current date to avoid empty date
      };
      
      // Parse event title
      const summary = eventComp.getFirstPropertyValue('summary');
      if (summary) {
        event.title = summary;
      }
      
      // Parse event description
      const description = eventComp.getFirstPropertyValue('description');
      if (description) {
        event.description = description;
      }
      
      // Parse event location
      const location = eventComp.getFirstPropertyValue('location');
      if (location) {
        event.location = location;
      }
      
      // Parse attendees
      const attendeeProps = eventComp.getAllProperties('attendee');
      if (attendeeProps.length > 0) {
        event.attendees = attendeeProps.map(prop => {
          const attendee = prop.getFirstValue();
          return typeof attendee === 'string' ? attendee : attendee.toString();
        });
      }
      
      // Parse event date
      const dtstart = eventComp.getFirstProperty('dtstart');
      if (dtstart) {
        const dateTime = dtstart.getFirstValue();
        if (dateTime) {
          event.date = new Date(dateTime.toJSDate());
        }
      }
      
      // Ensure event.date is always a valid Date object
      if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
        event.date = new Date();
      }
      
      return event;
    }).filter(event => {
      // Filter out invalid events (ensure date exists and is valid)
      return event.date && event.date instanceof Date && !isNaN(event.date.getTime());
    });
  } catch (error) {
    console.error('Parse ICS file failed:', error); 
    return [];
  }
};

/**
 * Format a Date object to an ICS format string
 * @param {Date} date - Date object
 * @returns {string} ICS format date string
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
 * Sanitize text for ICS format
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeIcsText = (text) => {
  if (!text) return '';
  
  // Replace newlines with \n
  // Escape semicolon, comma, and backslash
  return text
    .replace(/\\/g, '\\\\') // Escape backslash
    .replace(/;/g, '\\;')    // Escape semicolon
    .replace(/,/g, '\\,')    // Escape comma
    .replace(/\n/g, '\\n');  // Escape newline
};

/**
 * Generate a unique event ID
 * @returns {string} Unique ID
 */
const generateEventId = () => {
  return Math.random().toString(36).substr(2, 9);
};