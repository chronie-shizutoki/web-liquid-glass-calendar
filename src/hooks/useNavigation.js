import { useState } from 'react';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState('month');

  const views = {
    month: {
      id: 'month',
      name: 'month',
      icon: 'calendar'
    },
    week: {
      id: 'week', 
      name: 'week',
      icon: 'calendar-days'
    },
    desktop: {
      id: 'desktop',
      name: 'desktop',
      icon: 'calendar-range'
    },
    agenda: {
      id: 'agenda',
      name: 'agenda', 
      icon: 'list'
    },
    settings: {
      id: 'settings',
      name: 'settings',
      icon: 'settings'
    }
  };

  const switchView = (viewId) => {
    if (views[viewId]) {
      setCurrentView(viewId);
    }
  };

  const getCurrentView = () => views[currentView];

  return {
    currentView,
    views,
    switchView,
    getCurrentView
  };
};