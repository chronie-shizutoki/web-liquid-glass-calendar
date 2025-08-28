import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

const WeekView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  changeWeek,
  weekData,
  weekDays,
  isToday,
  isSelected,
  getEventsForDate,
  getLunarDisplay,
  showLunar
}) => {
  const { currentLanguage } = useLanguage();

  const formatWeekRange = () => {
    const startOfWeek = new Date(weekData[0].fullDate);
    const endOfWeek = new Date(weekData[6].fullDate);

    if (currentLanguage.startsWith('zh')) {
      return `${startOfWeek.getMonth() + 1}月${startOfWeek.getDate()}日 - ${endOfWeek.getMonth() + 1}月${endOfWeek.getDate()}日`;
    } else {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  return (
    <div className="flex-1 p-4">
      {/* 周视图头部 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeWeek(-1)}
          className="glass-button p-3 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <div className="text-center">
          <h2 className="text-white text-xl font-light">
            {formatWeekRange()}
          </h2>
          <p className="text-white/70 text-sm">
            {currentDate.getFullYear()}
          </p>
        </div>

        <button
          onClick={() => changeWeek(1)}
          className="glass-button p-3 rounded-full"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-white/70 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 周视图日期 */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekData.map((day, index) => {
          const dayEvents = getEventsForDate(day.fullDate);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day.fullDate)}
              className={`
                relative p-3 rounded-xl text-center transition-all duration-300 min-h-[80px]
                ${isSelected(day.fullDate)
                  ? 'glass-card-selected scale-105'
                  : 'glass-card hover:glass-card-hover'
                }
                ${isToday(day.fullDate) ? 'ring-2 ring-blue-400/50' : ''}
              `}
            >
              <div className={`
                text-lg font-medium mb-1
                ${isToday(day.fullDate) ? 'text-blue-400' : 'text-white'}
              `}>
                {day.date}
              </div>

              {showLunar && currentLanguage.startsWith('zh') && (
                <div className="text-xs text-white/60 mb-1">
                  {getLunarDisplay(day)}
                </div>
              )}

              {/* 事件指示器 */}
              {dayEvents.length > 0 && (
                <div className="flex justify-center gap-1">
                  {dayEvents.slice(0, 3).map((_, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-blue-400">+{dayEvents.length - 3}</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 时间轴视图 */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-white text-lg font-medium mb-4">
          {selectedDate.toLocaleDateString(currentLanguage, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Array.from({ length: 24 }, (_, hour) => {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            const selectedDateEvents = getEventsForDate(selectedDate);
            const hourEvents = selectedDateEvents.filter(event => {
              const eventHour = new Date(event.date).getHours();
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex items-center gap-3 py-1">
                <div className="text-white/60 text-sm w-12 text-right">
                  {timeSlot}
                </div>
                <div className="flex-1 border-l border-white/10 pl-3">
                  {hourEvents.length > 0 ? (
                    hourEvents.map((event, index) => (
                      <div key={index} className="glass-card-dark rounded-lg p-2 mb-1">
                        <div className="text-white text-sm font-medium">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-white/70 text-xs">
                            {event.description}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-6"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;