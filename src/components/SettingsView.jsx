import React, { useState } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Calendar, 
  Download, 
  Upload, 
  Trash2, 
  Info,
  Wifi,
  Battery,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import LanguageSelector from './LanguageSelector.jsx';
import { convertEventsToIcs, parseIcsToEvents } from '../lib/icsUtils.js';

const SettingsView = ({ 
  events, 
  addEvent, 
  removeEvent,
  currentLanguage,
  changeLanguage,
  showLunar,
  setShowLunar,
  weekStart,
  setWeekStart
}) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // 导出事件数据（JSON格式）
  const exportEventsAsJson = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendar-events-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  // 导出事件数据（ICS格式）
  const exportEventsAsIcs = () => {
    const icsContent = convertEventsToIcs(events);
    const dataBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendar-events-${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导入事件数据（JSON格式）
  const importEventsFromJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedEvents = JSON.parse(e.target.result);
          importedEvents.forEach(event => {
            addEvent({
              ...event,
              date: new Date(event.date)
            });
          });
          alert(t('importSuccess'));
        } catch (error) {
          alert(t('importFailedFormat'));
        }
      };
      reader.readAsText(file);
    }
  };
  
  // 导入事件数据（ICS格式）
  const importEventsFromIcs = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedEvents = parseIcsToEvents(e.target.result);
          importedEvents.forEach(event => {
            addEvent(event);
          });
          alert(t('importSuccess'));
        } catch (error) {
          alert(t('importFailedFormat'));
        }
      };
      reader.readAsText(file);
    }
  };

  // 清除所有事件
  const clearAllEvents = () => {
    if (confirm(t('confirmClearAllEvents'))) {
      events.forEach(event => removeEvent(event.id));
    }
  };

  const SettingItem = ({ icon: Icon, title, description, children, action }) => (
    <div className="glass-card rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass-button rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">{title}</div>
            {description && (
              <div className="text-white/60 text-sm">{description}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {action}
        </div>
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300
        ${checked ? 'bg-blue-500' : 'bg-white/20'}
      `}
    >
      <div className={`
        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
        ${checked ? 'translate-x-7' : 'translate-x-1'}
      `} />
    </button>
  );

  return (
    <div className="flex-1 p-4">
      {/* 设置页面头部 */}
      <div className="mb-6">
        <h2 className="text-white text-2xl font-light mb-2">{t('settings')}</h2>
        <p className="text-white/60 text-sm">{t('settingsTitle')}</p>
      </div>

      {/* 外观设置 */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-4">{t('appearanceSettings')}</h3>
        
        <SettingItem
          icon={Globe}
          title={t('languageSettings')}
          description={t('selectInterfaceLanguage')}
        >
          <LanguageSelector 
            currentLanguage={currentLanguage}
            onLanguageChange={changeLanguage}
          />
        </SettingItem>

        <SettingItem
          icon={darkMode ? Moon : Sun}
          title={t('darkMode')}
          description={t('toggleLightDarkTheme')}
        >
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </SettingItem>

        <SettingItem
          icon={Calendar}
          title={t('showLunarCalendar')}
          description={t('displayLunarInfoInCalendar')}
        >
          <Toggle checked={showLunar} onChange={setShowLunar} />
        </SettingItem>

        <SettingItem
          icon={Calendar}
          title={t('weekStartsOn')}
          description={t('setFirstDayOfWeek')}
        >
          <select
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="glass-button px-3 py-2 rounded-lg text-white text-sm bg-transparent border border-white/20"
          >
            <option value="saturday" className="bg-gray-800">{t('saturday')}</option>
            <option value="sunday" className="bg-gray-800">{t('sunday')}</option>
            <option value="monday" className="bg-gray-800">{t('monday')}</option>
          </select>
        </SettingItem>
      </div>

      {/* 通知设置 */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-4">{t('notificationSettings')}</h3>
        
        <SettingItem
          icon={Bell}
          title={t('eventReminders')}
          description={t('enableEventNotifications')}
        >
          <Toggle checked={notifications} onChange={setNotifications} />
        </SettingItem>
      </div>

      {/* 数据管理 */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-4">{t('dataManagement')}</h3>
        
        <SettingItem
          icon={Download}
          title={t('exportData')}
          description={`${t('export')} ${events.length} ${t('event')}`}
          action={
            <div className="flex gap-2">
              <button
                onClick={exportEventsAsJson}
                className="glass-button px-4 py-2 rounded-lg text-white text-sm"
              >
                {t('exportDataJson')}
              </button>
              <button
                onClick={exportEventsAsIcs}
                className="glass-button px-4 py-2 rounded-lg text-white text-sm"
              >
                {t('exportDataIcs')}
              </button>
            </div>
          }
        />

        <SettingItem
          icon={Upload}
          title={t('importData')}
          description={t('importData')}
          action={
            <div className="flex gap-2">
              <label className="glass-button px-4 py-2 rounded-lg text-white text-sm cursor-pointer">
                {t('importDataJson')}
                <input
                  type="file"
                  accept=".json"
                  onChange={importEventsFromJson}
                  className="hidden"
                />
              </label>
              <label className="glass-button px-4 py-2 rounded-lg text-white text-sm cursor-pointer">
                {t('importDataIcs')}
                <input
                  type="file"
                  accept=".ics,.ical"
                  onChange={importEventsFromIcs}
                  className="hidden"
                />
              </label>
            </div>
          }
        />

        <SettingItem
          icon={Trash2}
          title={t('clearData')}
          description={t('clearData')}
          action={
            <button
              onClick={clearAllEvents}
              className="glass-button px-4 py-2 rounded-lg text-red-400 text-sm border border-red-400/30"
            >
              {t('clear')}
            </button>
          }
        />
      </div>

      {/* 系统信息 */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-4">{t('systemInfo')}</h3>
        
        <div className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-white/60" />
                <span className="text-white/80 text-sm">{t('appVersion')}</span>
              </div>
              <span className="text-white text-sm">v1.0.0</span>
            </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className="text-white/80 text-sm">{t('totalEvents')}</span>
            </div>
            <span className="text-white text-sm">{events.length}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-white/60" />
              <span className="text-white/80 text-sm">{t('networkStatus')}</span>
            </div>
            <span className="text-green-400 text-sm">{t('connected')}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-white/60" />
              <span className="text-white/80 text-sm">{t('storageUsage')}</span>
            </div>
            <span className="text-white text-sm">
              {Math.round(JSON.stringify(events).length / 1024)} KB
            </span>
          </div>
        </div>
      </div>

      {/* 关于信息 */}
      <div className="glass-card rounded-xl p-4 text-center">
        <Info className="h-8 w-8 text-white/60 mx-auto mb-3" />
        <div className="text-white font-medium mb-2">{t('liquidGlassCalendar')}</div>
        <div className="text-white/60 text-sm mb-3">
          {t('modernCalendarApp')}
        </div>
        <div className="text-white/40 text-xs">
          {t('builtWith')}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;