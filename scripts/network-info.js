#!/usr/bin/env node

import { networkInterfaces } from 'os';

function getLocalIPs() {
  const interfaces = networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal addresses and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        ips.push({
          name: name,
          address: interface.address
        });
      }
    }
  }
  
  return ips;
}

function displayNetworkInfo() {
  console.log('\n🌐 Local Area Network service has been started!');
  console.log('='.repeat(50));
  
  const ips = getLocalIPs();
  const port = process.env.PORT || '5173';
  
  if (ips.length === 0) {
    console.log('❌ No available network interfaces found');
    return;
  }
  
  console.log('📱 You can access via the following addresses:');
  console.log('');
  
  // Local access
  console.log('🏠 Local access:');
  console.log(`   http://localhost:${port}`);
  console.log(`   http://127.0.0.1:${port}`);
  console.log('');
  
  // LAN access
  console.log('🌐 LAN access:');
  ips.forEach(ip => {
    console.log(`   http://${ip.address}:${port} (${ip.name})`);
  });
  
  console.log('');
  console.log('💡 Tips:');
  console.log('   • Make sure your devices are connected to the same LAN');
  console.log('   • Check if your firewall settings allow access');
  console.log('   • Mobile devices can scan the QR code for quick access');
  console.log('');
}

displayNetworkInfo();