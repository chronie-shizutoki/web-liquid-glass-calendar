import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CalendarDays, CalendarRange, List, Settings } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useNavigation } from '../hooks/useNavigation.js';
import EventModal from './EventModal.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import WeekView from './WeekView.jsx';
import DesktopCalendarView from './DesktopCalendarView.jsx';
import AgendaView from './AgendaView.jsx';
import SettingsView from './SettingsView.jsx';

const Calendar = () => {
  const {
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
    addEvent,
    removeEvent,
    getEventsForDate,
    getEventsForMonth,
    getUpcomingEvents
  } = useCalendar();



  const {
    currentLanguage,
    changeLanguage,
    t,
    formatDate
  } = useLanguage();

  const { currentView, switchView } = useNavigation();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // 处理日期点击
  const handleDateClick = (day) => {
    setSelectedDate(day.fullDate);
  };

  // 处理添加事件
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // 处理保存事件
  const handleSaveEvent = (eventData) => {
    addEvent(eventData);
  };

  // 获取选中日期的事件
  const selectedDateEvents = getEventsForDate(selectedDate);

  // 获取农历信息显示
  const getLunarDisplay = (day) => {
    if (day.solarTerm) return day.solarTerm;
    if (day.festival) return day.festival;
    return day.lunarDay;
  };

  return (
    <div className="min-h-screen liquid-gradient-bg p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>



      {/* 顶部操作栏 */}
      {currentView !== 'settings' && (
        <div className="flex justify-between items-center mb-8 px-2 relative z-10">
          {/* 导航按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentView === 'week' ? changeWeek(-1) : changeMonth(-1)}
              className="glass-button p-2 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => currentView === 'week' ? changeWeek(1) : changeMonth(1)}
              className="glass-button p-2 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={goToToday}
              className="glass-button px-4 py-2 rounded-full text-white text-sm"
            >
              {t('today')}
            </button>
          </div>

          {/* 右侧操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleAddEvent}
              className="glass-button p-3 rounded-full"
            >
              <Plus className="h-6 w-6 text-white" />
            </button>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={changeLanguage}
            />
            <button 
              onClick={() => switchView('settings')}
              className="glass-button p-3 rounded-full"
            >
              <Settings className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* 主要内容区域 - 根据当前视图显示不同组件 */}
      <div className="flex-1 relative z-10 pb-20">
        {currentView === 'month' && (
          <div>
            {/* 月份标题 */}
            <div className="text-white text-5xl font-light mb-8 px-2 shimmer">
              {formatMonth(currentDate)}
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-4 px-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-white text-center py-2 text-sm font-medium opacity-80">
                  {day}
                </div>
              ))}
            </div>

            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1 px-2 mb-8">
              {monthData.map((day, index) => (
                <div
                  key={index}
                  className={`
                    date-cell p-3 text-center cursor-pointer rounded-lg relative
                    ${day.isCurrentMonth ? 'text-white' : 'text-white/40'}
                    ${isToday(day.fullDate) ? 'bg-blue-500 pulse-glow' : ''}
                    ${isSelected(day.fullDate) && !isToday(day.fullDate) ? 'glass-card' : ''}
                    ${!isToday(day.fullDate) && !isSelected(day.fullDate) ? 'hover:glass-card' : ''}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-lg font-medium">{day.date}</div>
                  <div className={`text-xs mt-1 ${day.solarTerm ? 'text-yellow-300' :
                    day.festival ? 'text-red-300' :
                      'text-white/60'
                    }`}>
                    {getLunarDisplay(day)}
                  </div>

                  {/* 事件指示器 */}
                  {day.hasEvent && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-red-400 rounded-full pulse-glow"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 底部事件卡片 */}
            <div className="space-y-4 px-2">
              {/* 选中日期信息 */}
              <div className="glass-card rounded-2xl p-4 floating-animation">
                <div className="text-white text-lg font-medium mb-2">
                  {formatDate(selectedDate, {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
                {currentLanguage.startsWith('zh') && (
                  <div className="text-white/70 text-sm mb-3">
                    {monthData.find(day => day.fullDate.toDateString() === selectedDate.toDateString())?.lunarMonth || '七月'}
                    {monthData.find(day => day.fullDate.toDateString() === selectedDate.toDateString())?.lunarDay || '初五'}
                  </div>
                )}

                {/* 当日事件列表 */}
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-2 glass-card rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{event.title}</div>
                          {event.time && (
                            <div className="text-white/60 text-xs">{event.time}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60 text-sm text-center py-4">
                    {t('noEvents')}
                  </div>
                )}
              </div>

              {/* 即将到来的事件 */}
              {(() => {
                const upcomingEvent = getUpcomingEvents();
                if (upcomingEvent) {
                  return (
                    <div className="glass-card rounded-2xl p-4 flex justify-between items-center floating-animation" style={{ animationDelay: '1s' }}>
                      <div>
                        <div className="text-white text-lg font-medium">{upcomingEvent.name}</div>
                        <div className="text-white/70 text-sm">
                          {upcomingEvent.lunarDate || formatDate(upcomingEvent.date)}
                        </div>
                      </div>
                      <div className="text-white text-2xl font-light">
                        {upcomingEvent.daysUntil}<span className="text-sm">{currentLanguage.startsWith('zh') ? '天' : 'd'}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <WeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            changeWeek={changeWeek}
            weekData={weekData}
            weekDays={weekDays}
            isToday={isToday}
            isSelected={isSelected}
            getEventsForDate={getEventsForDate}
            getLunarDisplay={getLunarDisplay}
          />
        )}

        {currentView === 'desktop' && (
          <DesktopCalendarView
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            changeMonth={changeMonth}
            monthData={monthData}
            weekDays={weekDays}
            isToday={isToday}
            isSelected={isSelected}
            formatMonth={formatMonth}
            getEventsForDate={getEventsForDate}
            getLunarDisplay={getLunarDisplay}
          />
        )}

        {currentView === 'agenda' && (
          <AgendaView
            events={events}
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            getEventsForMonth={getEventsForMonth}
            removeEvent={removeEvent}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            events={events}
            addEvent={addEvent}
            removeEvent={removeEvent}
            currentLanguage={currentLanguage}
            changeLanguage={changeLanguage}
          />
        )}
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 glass-card-dark border-t border-white/10 z-20">
        <div className="flex justify-around items-center py-3">
          {/* 月视图 */}
          <button
            onClick={() => switchView('month')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'month' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'month' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('month')}
            </span>
          </button>

          {/* 周视图 */}
          <button
            onClick={() => switchView('week')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'week' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'week' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('week')}
            </span>
          </button>

          {/* 台历视图 */}
          <button
            onClick={() => switchView('desktop')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'desktop' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <CalendarRange className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'desktop' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('desktop')}
            </span>
          </button>

          {/* 日程视图 */}
          <button
            onClick={() => switchView('agenda')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'agenda' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <List className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'agenda' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('agenda')}
            </span>
          </button>

          {/* 设置 */}
          <button
            onClick={() => switchView('settings')}
            className="flex flex-col items-center"
          >
            <div className={`w-8 h-8 rounded-lg mb-1 flex items-center justify-center transition-all ${
              currentView === 'settings' ? 'bg-blue-500 pulse-glow' : 'glass-button'
            }`}>
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span className={`text-xs ${currentView === 'settings' ? 'text-blue-400' : 'text-white/70'}`}>
              {t('settings')}
            </span>
          </button>
        </div>
      </div>

      {/* 事件模态框 */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        initialEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;

