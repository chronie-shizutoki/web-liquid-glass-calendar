#!/usr/bin/env node

import { networkInterfaces } from 'os';

function getLocalIPs() {
  const interfaces = networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // 跳过内部地址和非IPv4地址
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
  console.log('\n🌐 局域网服务已启动！');
  console.log('=' .repeat(50));
  
  const ips = getLocalIPs();
  const port = process.env.PORT || '5173';
  
  if (ips.length === 0) {
    console.log('❌ 未找到可用的网络接口');
    return;
  }
  
  console.log('📱 可通过以下地址访问：');
  console.log('');
  
  // 本地访问
  console.log('🏠 本地访问：');
  console.log(`   http://localhost:${port}`);
  console.log(`   http://127.0.0.1:${port}`);
  console.log('');
  
  // 局域网访问
  console.log('🌐 局域网访问：');
  ips.forEach(ip => {
    console.log(`   http://${ip.address}:${port} (${ip.name})`);
  });
  
  console.log('');
  console.log('💡 提示：');
  console.log('   • 确保设备连接在同一局域网内');
  console.log('   • 检查防火墙设置是否允许访问');
  console.log('   • 移动设备可扫描二维码快速访问');
  console.log('');
}

displayNetworkInfo();