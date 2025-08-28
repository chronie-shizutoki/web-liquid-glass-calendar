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
    
    // 重置表单
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
    '#4A90E2', // 蓝色
    '#7B68EE', // 紫色
    '#FF6B6B', // 红色
    '#4ECDC4', // 青色
    '#45B7D1', // 天蓝色
    '#96CEB4', // 绿色
    '#FFEAA7', // 黄色
    '#DDA0DD', // 梅红色
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* 模态框内容 */}
      <div className="glass-card rounded-2xl p-6 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
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

        {/* 表单内容 */}
        <div className="space-y-4">
          {/* 标题 */}
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

          {/* 日期和时间 */}
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

          {/* 地点 */}
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

          {/* 参与者 */}
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

          {/* 描述 */}
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

          {/* 颜色选择 */}
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

        {/* 底部按钮 */}
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

