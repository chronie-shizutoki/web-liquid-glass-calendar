import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

const EventModal = ({ isOpen, onClose, onSave, selectedDate, initialEvent = null }) => {
  const { t, formatDate } = useLanguage();
  
  const [event, setEvent] = useState({
    title: initialEvent?.title || '',
    description: initialEvent?.description || '',
    time: initialEvent?.time || '09:00',
    location: initialEvent?.location || '',
    attendees: initialEvent?.attendees || '',
    color: initialEvent?.color || '#4A90E2',
    ...initialEvent
  });

  const handleSave = () => {
    if (!event.title.trim()) return;
    
    const eventData = {
      ...event,
      date: selectedDate,
      id: initialEvent?.id || Date.now()
    };
    
    onSave(eventData);
    onClose();
    
    // Reset the form
    setEvent({
      title: '',
      description: '',
      time: '09:00',
      location: '',
      attendees: '',
      color: '#4A90E2'
    });
  };

  const handleChange = (field, value) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const colorOptions = [
    // Primary Colors
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Lime
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan

    // Blue Shades
    '#4A90E2', // Blue
    '#45B7D1', // Light Blue
    '#87CEFA', // Light Sky Blue
    '#000080', // Navy
    '#6A5ACD', // Slate Blue
    '#8A2BE2', // Blue Violet

    // Purple Shades
    '#7B68EE', // Purple
    '#800080', // Purple
    '#DDA0DD', // Plum

    // Red Shades
    '#FF6B6B', // Red
    '#FF6347', // Tomato
    '#FF4500', // Orange Red
    '#800000', // Maroon

    // Green Shades
    '#96CEB4', // Green
    '#008000', // Green
    '#32CD32', // Lime Green
    '#90EE90', // Light Green
    '#7FFFD4', // Aquamarine

    // Yellow and Orange Shades
    '#FFEAA7', // Yellow
    '#FFD700', // Gold
    '#FF8C00', // Dark Orange
    '#DAA520', // Goldenrod
    '#F0E68C', // Khaki

    // Brown Shades
    '#8B4513', // Saddle Brown
    '#A0522D', // Sienna
    '#D2691E', // Chocolate
    '#BC8F8F', // Rosy Brown
    '#F4A460', // Sandy Brown

    // Pink Shades
    '#FF1493', // Deep Pink
    '#FFB6C1', // Light Pink
    '#FFA07A', // Light Salmon
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background mask */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="glass-card rounded-2xl p-6 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            {initialEvent ? t('editEvent') : t('newEvent')}
          </h2>
          <button
            onClick={onClose}
            className="glass-button p-2 rounded-full"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Form content */}
        <div className="space-y-4">
          {/* Event title */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t('eventTitle')}
            </label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('enterEventTitle')}
              className="w-full glass-card rounded-lg px-4 py-3 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Event date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                {t('day')}
              </label>
              <div className="glass-card rounded-lg px-4 py-3 text-white">
                {formatDate(selectedDate)}
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                {t('eventTime')}
              </label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full glass-card rounded-lg px-4 py-3 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Event location */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {t('eventLocation')}
            </label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={t('enterLocation')}
              className="w-full glass-card rounded-lg px-4 py-3 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Event attendees */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <User className="inline h-4 w-4 mr-1" />
              {t('eventAttendees')}
            </label>
            <input
              type="text"
              value={event.attendees}
              onChange={(e) => handleChange('attendees', e.target.value)}
              placeholder={t('enterAttendees')}
              className="w-full glass-card rounded-lg px-4 py-3 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Event description */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t('eventDescription')}
            </label>
            <textarea
              value={event.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('enterEventDescription')}
              rows={3}
              className="w-full glass-card rounded-lg px-4 py-3 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          {/* Event color */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              {t('eventColor')}
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    event.color === color 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 glass-button py-3 rounded-lg text-white font-medium"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!event.title.trim()}
            className={`flex-1 py-3 rounded-lg text-white font-medium transition-all ${
              event.title.trim()
                ? 'bg-blue-500 hover:bg-blue-600 pulse-glow'
                : 'bg-white/20 cursor-not-allowed'
            }`}
          >
            {initialEvent ? t('update') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

