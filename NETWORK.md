# Local Network Service Usage Guide

## 🚀 Quick Start

### Development Mode (Local Network Access)
```bash
# Start the development server and display network information
npm run dev:network
# or
pnpm dev:network
```

### Production Preview Mode (Local Network Access)
```bash
# Build the project first
npm run build

# Start the preview server and display network information
npm run preview:network
# or
pnpm preview:network
```

### View Network Information Only
```bash
npm run network-info
# or
pnpm network-info
```

## 📱 Access Methods

### Local Access
- `http://localhost:5173` (Development mode)
- `http://localhost:4173` (Preview mode)

### Local Network Access
After starting the service, the console will display all available local network addresses, for example:
- `http://192.168.1.100:5173`
- `http://10.0.0.50:5173`

## 🔧 Configuration Instructions

### Vite Configuration
The project has been configured to support local network access:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,      // Development server port
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0', // Also allow external access in preview mode
    port: 4173,      // Preview server port
    strictPort: false,
  }
})
```

## 🛡️ Security Notes

1. **Firewall Settings**: Ensure the firewall allows access to the corresponding ports
2. **Network Environment**: Use only in trusted local network environments
3. **Production Deployment**: Use professional web servers for production environments

## 📋 Frequently Asked Questions

### Q: Unable to access via local network?
A: Check the following:
- Are devices on the same local network
- Is the firewall blocking port access
- Is the network configuration correct

### Q: How to access on mobile devices?
A: 
1. Ensure mobile device is connected to the same WiFi network
2. Enter the displayed local network address in the mobile device browser
3. You can use a QR code generator to create quick access QR codes

### Q: What if the port is occupied?
A: 
- `strictPort: false` is set in the configuration, which will automatically try the next available port
- You can also manually specify a port: `vite --port 3000 --host 0.0.0.0`

## 🎯 Usage Scenarios

- **Multi-device testing**: Test application responsive design on different devices
- **Team collaboration**: Team members can access the developing application via local network
- **Demonstrations**: Show application features to clients or colleagues
- **Mobile debugging**: Debug applications on real mobile devices

## 📞 Technical Support

If you encounter network configuration issues, please check:
1. Network connection status
2. Firewall and security software settings
3. Router configuration
4. Operating system network permissions