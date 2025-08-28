import { useState, useEffect } from 'react';

export const useStatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [networkType, setNetworkType] = useState('WiFi');
  const [signalStrength, setSignalStrength] = useState(4); // 1-4 bars

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get battery information (if supported)
  useEffect(() => {
    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        } catch (error) {
          // Fallback to mock data if battery API is not available
          setBatteryLevel(Math.floor(Math.random() * 40) + 60); // 60-100%
          setIsCharging(Math.random() > 0.7);
        }
      } else {
        // Fallback for browsers that don't support battery API
        setBatteryLevel(Math.floor(Math.random() * 40) + 60);
        setIsCharging(Math.random() > 0.7);
      }
    };

    getBatteryInfo();
  }, []);

  // Get network information (if supported)
  useEffect(() => {
    const getNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === '4g') {
            setNetworkType('5G'); // Simulate 5G for modern experience
          } else if (effectiveType === '3g') {
            setNetworkType('4G');
          } else {
            setNetworkType('WiFi');
          }
          
          // Simulate signal strength based on connection quality
          const downlink = connection.downlink || 10;
          if (downlink > 10) setSignalStrength(4);
          else if (downlink > 5) setSignalStrength(3);
          else if (downlink > 1) setSignalStrength(2);
          else setSignalStrength(1);
        }
      }
    };

    getNetworkInfo();
  }, []);

  // Format time as HH:MM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get current temperature (mock data - in real app you'd use weather API)
  const getCurrentTemperature = () => {
    const hour = currentTime.getHours();
    // Simulate temperature variation throughout the day
    const baseTemp = 20;
    const variation = Math.sin((hour - 6) * Math.PI / 12) * 8;
    return (baseTemp + variation).toFixed(1);
  };

  return {
    currentTime: formatTime(currentTime),
    batteryLevel,
    isCharging,
    networkType,
    signalStrength,
    temperature: getCurrentTemperature()
  };
};