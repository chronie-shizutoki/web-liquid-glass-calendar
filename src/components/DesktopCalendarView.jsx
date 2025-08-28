import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

const DesktopCalendarView = ({ 
  currentDate, 
  selectedDate, 
  setSelectedDate, 
  changeMonth, 
  monthData, 
  weekDays, 
  isToday, 
  isSelected, 
  formatMonth,
  getEventsForDate,
  getLunarDisplay,
  showLunar
}) => {
  const { currentLanguage, t } = useLanguage();

  return (
    <div className="flex-1 p-4">
      {/* 台历样式头部 */}
      <div className="glass-card rounded-t-3xl p-6 mb-0 bg-gradient-to-br from-white/20 to-white/5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="glass-button p-2 rounded-full"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          
          <div className="text-center">
            <h1 className="text-white text-2xl font-light">
              {formatMonth(currentDate)}
            </h1>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            className="glass-button p-2 rounded-full"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* 今日信息卡片 */}
        <div className="glass-card-dark rounded-2xl p-4 text-center">
          <div className="text-white text-4xl font-light mb-2">
            {new Date().getDate()}
          </div>
          <div className="text-white/80 text-lg">
            {new Date().toLocaleDateString(currentLanguage, { 
              weekday: 'long',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          {showLunar && currentLanguage.startsWith('zh') && (
            <div className="text-white/60 text-sm mt-2">
              {(() => {
                const today = new Date();
                const todayData = monthData.find(day => 
                  day.fullDate.toDateString() === today.toDateString()
                );
                return todayData ? getLunarDisplay(todayData) : '';
              })()}
            </div>
          )}
        </div>
      </div>

      {/* 台历主体 */}
      <div className="glass-card rounded-b-3xl rounded-t-none p-6 bg-gradient-to-br from-white/10 to-white/5">
        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-white/70 text-sm py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* 日期网格 - 台历样式 */}
        <div className="grid grid-cols-7 gap-2">
          {monthData.map((day, index) => {
            const dayEvents = getEventsForDate(day.fullDate);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day.fullDate)}
                className={`
                  relative aspect-square rounded-2xl text-center transition-all duration-300 p-2
                  ${day.isCurrentMonth 
                    ? (isSelected(day.fullDate) 
                        ? 'glass-card-selected scale-105 shadow-lg' 
                        : 'glass-card hover:glass-card-hover hover:scale-105'
                      )
                    : 'opacity-30 hover:opacity-50'
                  }
                  ${isToday(day.fullDate) ? 'ring-2 ring-blue-400/50 shadow-blue-400/25' : ''}
                `}
              >
                {/* 日期数字 */}
                <div className={`
                  text-lg font-medium mb-1
                  ${isToday(day.fullDate) 
                    ? 'text-blue-400 font-bold' 
                    : (day.isCurrentMonth ? 'text-white' : 'text-white/40')
                  }
                `}>
                  {day.date}
                </div>
                
                {/* 农历信息 */}
                {showLunar && currentLanguage.startsWith('zh') && day.isCurrentMonth && (
                  <div className={`
                    text-xs mb-1
                    ${day.solarTerm ? 'text-orange-400 font-medium' : 
                      day.festival ? 'text-red-400 font-medium' : 
                      'text-white/60'
                    }
                  `}>
                    {getLunarDisplay(day)}
                  </div>
                )}
                
                {/* 事件指示器 */}
                {dayEvents.length > 0 && day.isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex justify-center gap-1">
                      {dayEvents.slice(0, 2).map((_, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 选中日期详情 */}
        <div className="mt-6 glass-card-dark rounded-2xl p-4">
          <h3 className="text-white text-lg font-medium mb-3">
            {selectedDate.toLocaleDateString(currentLanguage, { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          
          {(() => {
            const selectedDateEvents = getEventsForDate(selectedDate);
            const selectedDayData = monthData.find(day => 
              day.fullDate.toDateString() === selectedDate.toDateString()
            );
            
            return (
              <div className="space-y-3">
                {/* 农历信息 */}
                {showLunar && currentLanguage.startsWith('zh') && selectedDayData && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/70 text-sm">{t('lunarInfo')}</span>
                    <span className="text-white text-sm">
                      {selectedDayData.lunarMonth}{selectedDayData.lunarDay}
                    </span>
                    {(selectedDayData.solarTerm || selectedDayData.festival) && (
                      <span className="text-orange-400 text-sm font-medium">
                        {selectedDayData.solarTerm || selectedDayData.festival}
                      </span>
                    )}
                  </div>
                )}
                
                {/* 事件列表 */}
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-white/70 text-sm">{t('todayEvents')}:</span>
                    {selectedDateEvents.map((event, index) => (
                      <div key={index} className="glass-card rounded-lg p-3">
                        <div className="text-white font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-white/70 text-sm mt-1">
                            {event.description}
                          </div>
                        )}
                        {event.time && (
                          <div className="text-blue-400 text-sm mt-1">
                            {event.time}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/50 text-sm text-center py-4">
                    {t('noEvents')}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DesktopCalendarView;