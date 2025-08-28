import { useState, useEffect } from 'react';

// 语言包
const translations = {
  'zh-CN': {
    // 基本词汇
    today: '今天',
    calendar: '日历',
    month: '月',
    week: '周',
    day: '日',
    year: '年',
    // 设置相关
    settingsTitle: '个性化您的日历体验',
    appearanceSettings: '外观设置',
    notificationSettings: '通知设置',
    dataManagement: '数据管理',
    systemInfo: '系统信息',
    about: '关于信息',
    weekStart: '一周开始',
    weekStartSunday: '周日',
    weekStartMonday: '周一',
    notifications: '事件提醒',
    exportData: '导出数据',
    importData: '导入数据',
    clearData: '清除数据',
    export: '导出',
    import: '导入',
    clear: '清除',
    liquidGlassCalendar: '液态玻璃日历',
    modernCalendarApp: '一个现代化的多功能日历应用',
    builtWith: '使用 React + Vite + Tailwind CSS 构建',
    appVersion: '应用版本',
    totalEvents: '事件总数',
    networkStatus: '网络状态',
    storageUsage: '存储使用',
    connected: '已连接',
    
    // 星期
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    weekdaysLong: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    
    // 月份
    months: ['一月', '二月', '三月', '四月', '五月', '六月', 
             '七月', '八月', '九月', '十月', '十一月', '十二月'],
    
    // 事件相关
    event: '事件',
    newEvent: '新建事件',
    editEvent: '编辑事件',
    eventTitle: '事件标题',
    eventDescription: '事件描述',
    eventTime: '时间',
    eventLocation: '地点',
    eventAttendees: '参与者',
    eventColor: '颜色标签',
    save: '保存',
    cancel: '取消',
    update: '更新',
    delete: '删除',
    
    // 占位符
    enterEventTitle: '输入事件标题...',
    enterEventDescription: '输入事件描述...',
    enterLocation: '输入地点...',
    enterAttendees: '输入参与者...',
    
    // 农历和节气
    lunarCalendar: '农历',
    solarTerms: '节气',
    
    // 设置
    settings: '设置',
    language: '语言',
    theme: '主题',
    
    // 视图
    agenda: '日程',
    desktop: '台历',
    
    // 状态
    noEvents: '暂无事件',
    
    // 导航
    previousMonth: '上个月',
    nextMonth: '下个月',
    goToToday: '回到今天',
    
    // 状态
    noEvents: '暂无事件',
    loading: '加载中...',
    error: '出错了',
    
    // 设置项
    languageSettings: '语言设置',
    selectInterfaceLanguage: '选择界面显示语言',
    darkMode: '深色模式',
    toggleLightDarkTheme: '切换浅色/深色主题',
    showLunarCalendar: '显示农历',
    displayLunarInfoInCalendar: '在日历中显示农历信息',
    weekStartsOn: '一周开始',
    setFirstDayOfWeek: '设置一周的第一天',
    sunday: '周日',
    monday: '周一',
    tuesday: '周二',
    wednesday: '周三',
    thursday: '周四',
    friday: '周五',
    saturday: '周六',
    eventReminders: '事件提醒',
    enableEventNotifications: '开启事件到期提醒',
    
    // 传统节日
    festivals: {
      'newYear': '元旦',
      'valentineDay': '情人节',
      'womenDay': '妇女节',
      'aprilFoolsDay': '愚人节',
      'laborDay': '劳动节',
      'childrenDay': '儿童节',
      'qixi': '七夕',
      'armyDay': '建军节',
      'teacherDay': '教师节',
      'nationalDay': '国庆节',
      'christmas': '圣诞节'
    }
  },
  
  'zh-TW': {
    today: '今天',
    calendar: '日曆',
    month: '月',
    week: '週',
    day: '日',
    year: '年',
    // 設置相關
    settingsTitle: '個性化您的日曆體驗',
    appearanceSettings: '外觀設置',
    notificationSettings: '通知設置',
    dataManagement: '數據管理',
    systemInfo: '系統資訊',
    about: '關於資訊',
    weekStart: '一週開始',
    weekStartSunday: '周日',
    weekStartMonday: '周一',
    notifications: '事件提醒',
    exportData: '匯出數據',
    importData: '匯入數據',
    clearData: '清除數據',
    export: '匯出',
    import: '匯入',
    clear: '清除',
    liquidGlassCalendar: '液態玻璃日曆',
    modernCalendarApp: '一個現代化的多功能日曆應用',
    builtWith: '使用 React + Vite + Tailwind CSS 構建',
    appVersion: '應用版本',
    totalEvents: '事件總數',
    networkStatus: '網路狀態',
    storageUsage: '儲存使用',
    connected: '已連接',
    
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    weekdaysLong: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    
    months: ['一月', '二月', '三月', '四月', '五月', '六月', 
             '七月', '八月', '九月', '十月', '十一月', '十二月'],
    
    event: '事件',
    newEvent: '新建事件',
    editEvent: '編輯事件',
    eventTitle: '事件標題',
    eventDescription: '事件描述',
    eventTime: '時間',
    eventLocation: '地點',
    eventAttendees: '參與者',
    eventColor: '顏色標籤',
    save: '保存',
    cancel: '取消',
    update: '更新',
    delete: '刪除',
    
    enterEventTitle: '輸入事件標題...',
    enterEventDescription: '輸入事件描述...',
    enterLocation: '輸入地點...',
    enterAttendees: '輸入參與者...',
    
    lunarCalendar: '農曆',
    solarTerms: '節氣',
    
    settings: '設置',
    language: '語言',
    theme: '主題',
    
    // 視圖
    agenda: '日程',
    desktop: '台曆',
    
    previousMonth: '上個月',
    nextMonth: '下個月',
    goToToday: '回到今天',
    
    noEvents: '暫無事件',
    loading: '載入中...',
    error: '出錯了',
    
    // 設置項
    languageSettings: '語言設置',
    selectInterfaceLanguage: '選擇介面顯示語言',
    darkMode: '深色模式',
    toggleLightDarkTheme: '切換淺色/深色主題',
    showLunarCalendar: '顯示農曆',
    displayLunarInfoInCalendar: '在日曆中顯示農曆資訊',
    weekStartsOn: '一週開始',
    sunday: '周日',
    monday: '周一',
    tuesday: '周二',
    wednesday: '周三',
    thursday: '周四',
    friday: '周五',
    saturday: '周六',
    setFirstDayOfWeek: '設定一週的第一天',
    eventReminders: '事件提醒',
    enableEventNotifications: '開啟事件到期提醒',
    
    festivals: {
      'newYear': '元旦',
      'valentineDay': '情人節',
      'womenDay': '婦女節',
      'aprilFoolsDay': '愚人節',
      'laborDay': '勞動節',
      'childrenDay': '兒童節',
      'qixi': '七夕',
      'armyDay': '建軍節',
      'teacherDay': '教師節',
      'nationalDay': '國慶節',
      'christmas': '聖誕節'
    }
  },
  
  'en': {
    today: 'Today',
    calendar: 'Calendar',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    year: 'Year',
    // Settings
    settingsTitle: 'Personalize your calendar experience',
    appearanceSettings: 'Appearance',
    notificationSettings: 'Notifications',
    dataManagement: 'Data Management',
    systemInfo: 'System Info',
    about: 'About',
    weekStart: 'Week Start',
    weekStartSunday: 'Sunday',
    weekStartMonday: 'Monday',
    notifications: 'Event Reminders',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear Data',
    export: 'Export',
    import: 'Import',
    clear: 'Clear',
    liquidGlassCalendar: 'Liquid Glass Calendar',
    modernCalendarApp: 'A modern multifunctional calendar application',
    builtWith: 'Built with React + Vite + Tailwind CSS',
    appVersion: 'App Version',
    totalEvents: 'Total Events',
    networkStatus: 'Network Status',
    storageUsage: 'Storage Usage',
    connected: 'Connected',
    
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    
    months: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
    
    event: 'Event',
    newEvent: 'New Event',
    editEvent: 'Edit Event',
    eventTitle: 'Event Title',
    eventDescription: 'Description',
    eventTime: 'Time',
    eventLocation: 'Location',
    eventAttendees: 'Attendees',
    eventColor: 'Color Label',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    delete: 'Delete',
    
    enterEventTitle: 'Enter event title...',
    enterEventDescription: 'Enter event description...',
    enterLocation: 'Enter location...',
    enterAttendees: 'Enter attendees...',
    
    lunarCalendar: 'Lunar Calendar',
    solarTerms: 'Solar Terms',
    
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    
    // Views
    agenda: 'Agenda',
    desktop: 'Desktop',
    
    noEvents: 'No Events',
    
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    goToToday: 'Go to Today',
    
    noEvents: 'No Events',
    loading: 'Loading...',
    error: 'Error',
    
    // Settings items
    languageSettings: 'Language Settings',
    selectInterfaceLanguage: 'Select interface display language',
    darkMode: 'Dark Mode',
    toggleLightDarkTheme: 'Toggle light/dark theme',
    showLunarCalendar: 'Show Lunar Calendar',
    displayLunarInfoInCalendar: 'Display lunar information in calendar',
    weekStartsOn: 'Week Starts On',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    setFirstDayOfWeek: 'Set first day of week',
    eventReminders: 'Event Reminders',
    enableEventNotifications: 'Enable event notifications',
    
    festivals: {
      'newYear': 'New Year',
      'valentineDay': 'Valentine\'s Day',
      'womenDay': 'Women\'s Day',
      'aprilFoolsDay': 'April Fool\'s Day',
      'laborDay': 'Labor Day',
      'childrenDay': 'Children\'s Day',
      'qixi': 'Qixi Festival',
      'armyDay': 'Army Day',
      'teacherDay': 'Teacher\'s Day',
      'nationalDay': 'National Day',
      'christmas': 'Christmas'
    }
  },
  
  'ja': {
    today: '今日',
    calendar: 'カレンダー',
    month: '月',
    week: '週',
    day: '日',
    year: '年',
    // 設定
    settingsTitle: 'カレンダー体験をカスタマイズ',
    appearanceSettings: '外観設定',
    notificationSettings: '通知設定',
    dataManagement: 'データ管理',
    systemInfo: 'システム情報',
    about: 'について',
    weekStart: '週の始まり',
    weekStartSunday: '日曜日',
    weekStartMonday: '月曜日',
    notifications: 'イベントリマインダー',
    exportData: 'データをエクスポート',
    importData: 'データをインポート',
    clearData: 'データを消去',
    export: 'エクスポート',
    import: 'インポート',
    clear: '消去',
    liquidGlassCalendar: 'リキッドグラスカレンダー',
    modernCalendarApp: '現代的な多機能カレンダーアプリケーション',
    builtWith: 'React + Vite + Tailwind CSS で構築',
    appVersion: 'アプリバージョン',
    totalEvents: '総イベント数',
    networkStatus: 'ネットワーク状態',
    storageUsage: 'ストレージ使用量',
    connected: '接続済み',
    
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    weekdaysLong: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    
    months: ['1月', '2月', '3月', '4月', '5月', '6月',
             '7月', '8月', '9月', '10月', '11月', '12月'],
    
    event: 'イベント',
    newEvent: '新しいイベント',
    editEvent: 'イベントを編集',
    eventTitle: 'イベントタイトル',
    eventDescription: '説明',
    eventTime: '時間',
    eventLocation: '場所',
    eventAttendees: '参加者',
    eventColor: 'カラーラベル',
    save: '保存',
    cancel: 'キャンセル',
    update: '更新',
    delete: '削除',
    
    enterEventTitle: 'イベントタイトルを入力...',
    enterEventDescription: 'イベントの説明を入力...',
    enterLocation: '場所を入力...',
    enterAttendees: '参加者を入力...',
    
    lunarCalendar: '旧暦',
    solarTerms: '二十四節気',
    
    settings: '設定',
    language: '言語',
    theme: 'テーマ',
    
    // ビュー
    agenda: 'アジェンダ',
    desktop: 'デスクトップ',
    
    previousMonth: '前月',
    nextMonth: '翌月',
    goToToday: '今日に戻る',
    
    noEvents: 'イベントなし',
    loading: '読み込み中...',
    error: 'エラー',
    
    // 設定アイテム
    languageSettings: '言語設定',
    selectInterfaceLanguage: 'インターフェース表示言語を選択',
    darkMode: 'ダークモード',
    toggleLightDarkTheme: '明るい/暗いテーマを切り替え',
    showLunarCalendar: '旧暦を表示',
    displayLunarInfoInCalendar: 'カレンダーに旧暦情報を表示',
    weekStartsOn: '週の開始',
    sunday: '日曜日',
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    setFirstDayOfWeek: '週の最初の日を設定',
    eventReminders: 'イベントリマインダー',
    enableEventNotifications: 'イベント通知を有効にする',
    
    festivals: {
      'newYear': '元旦',
      'valentineDay': 'バレンタインデー',
      'womenDay': '国際女性デー',
      'aprilFoolsDay': 'エイプリルフール',
      'laborDay': 'メーデー',
      'childrenDay': 'こどもの日',
      'qixi': '七夕',
      'armyDay': '建軍記念日',
      'teacherDay': '教師の日',
      'nationalDay': '国慶節',
      'christmas': 'クリスマス'
    }
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // 从本地存储获取语言设置，或使用浏览器语言
    const savedLanguage = localStorage.getItem('calendar-language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
    
    // 检测浏览器语言
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('zh')) {
      return browserLanguage.includes('TW') || browserLanguage.includes('HK') ? 'zh-TW' : 'zh-CN';
    } else if (browserLanguage.startsWith('ja')) {
      return 'ja';
    } else {
      return 'en';
    }
  });

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem('calendar-language', currentLanguage);
  }, [currentLanguage]);

  // 获取翻译文本
  const t = (key, fallback = key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  };

  // 获取当前语言的翻译对象
  const getTranslations = () => {
    return translations[currentLanguage] || translations['zh-CN'];
  };

  // 切换语言
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  // 格式化日期
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(currentLanguage, { ...defaultOptions, ...options });
  };

  // 格式化时间
  const formatTime = (date) => {
    return date.toLocaleTimeString(currentLanguage, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    getTranslations,
    formatDate,
    formatTime
  };
};

