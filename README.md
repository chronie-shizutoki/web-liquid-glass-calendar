# 🌊 Liquid Glass Calendar

A beautiful, modern calendar application with a stunning liquid glass design and real-time status bar. Built with React, Vite, and Tailwind CSS.

![Calendar Preview](https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Liquid+Glass+Calendar)

## ✨ Features

### 🎨 Visual Design
- **Liquid Glass Effect**: Stunning glassmorphism UI with flowing animations
- **Gradient Backgrounds**: Dynamic liquid gradient backgrounds with floating elements
- **Pulse Animations**: Smooth glowing effects and transitions
- **Mobile-First**: Responsive design optimized for mobile devices

### 📅 Calendar Functionality
- **Month Navigation**: Smooth navigation between months
- **Date Selection**: Interactive date picking with visual feedback
- **Today Highlight**: Current date prominently displayed
- **Lunar Calendar**: Traditional Chinese lunar calendar integration
- **Solar Terms & Festivals**: Display of traditional Chinese calendar events

### 📱 Real-Time Status Bar
- **Live Clock**: Real-time display of current time
- **Battery Status**: Actual battery level and charging indicator
- **Network Info**: Dynamic network type detection (5G/4G/WiFi)
- **Signal Strength**: Live signal strength indicators
- **Temperature**: Dynamic temperature display

### 🎯 Event Management
- **Add Events**: Create and manage calendar events
- **Event Indicators**: Visual markers for dates with events
- **Event Details**: View event information for selected dates
- **Color Coding**: Customizable event colors

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liquid-glass-calendar
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   # 本地开发
   pnpm dev
   # or
   npm run dev
   
   # 局域网访问（支持多设备访问）
   pnpm dev:network
   # or
   npm run dev:network
   ```

4. **Open in browser**
   - 本地访问: `http://localhost:5173`
   - 局域网访问: 启动后控制台会显示可用的网络地址

### Build for Production

```bash
# 构建项目
pnpm build
# or
npm run build

# 预览构建结果（支持局域网访问）
pnpm preview:network
# or
npm run preview:network
```

### 🌐 局域网服务

支持在局域网内多设备访问，适用于：
- 多设备测试和调试
- 团队协作开发
- 移动端真机测试
- 客户演示展示

详细配置请参考 [NETWORK.md](./NETWORK.md)

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### Utilities
- **date-fns** - Modern JavaScript date utility library
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Calendar.jsx     # Main calendar component
│   ├── EventModal.jsx   # Event creation modal
│   └── LanguageSelector.jsx
├── hooks/               # Custom React hooks
│   ├── useCalendar.js   # Calendar logic and state
│   ├── useStatusBar.js  # Real-time status bar data
│   ├── useLanguage.js   # Internationalization
│   └── use-mobile.js    # Mobile detection
├── lib/                 # Utility functions
│   └── utils.js         # Helper functions
├── assets/              # Static assets
├── App.jsx              # Root component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Customization

### Themes and Colors
The calendar uses CSS custom properties for easy theming. Modify the gradient colors in `index.css`:

```css
:root {
  --gradient-start: #667eea;
  --gradient-end: #764ba2;
  --glass-bg: rgba(255, 255, 255, 0.1);
}
```

### Adding Custom Events
Events are managed through the `useCalendar` hook. You can extend the event system by modifying the event structure:

```javascript
const eventData = {
  id: generateId(),
  title: 'Event Title',
  date: selectedDate,
  time: '14:00',
  color: '#3b82f6',
  description: 'Event description'
};
```

### Status Bar Customization
The status bar data comes from `useStatusBar` hook. You can integrate real weather APIs or other data sources:

```javascript
// In useStatusBar.js
const getWeatherData = async () => {
  const response = await fetch('your-weather-api');
  const data = await response.json();
  return data.temperature;
};
```

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Battery API**: Limited browser support (Chrome, Edge)
- **Network API**: Experimental feature, fallbacks provided

## 📱 Mobile Features

- Touch-friendly interface
- Responsive design for all screen sizes
- Native-like status bar simulation
- Smooth touch animations

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Code Style
- ESLint configuration included
- Prettier recommended for formatting
- Component-based architecture
- Custom hooks for logic separation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Chinese Calendar** algorithms for lunar calendar integration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and error messages

---

Made with ❤️ and modern web technologies