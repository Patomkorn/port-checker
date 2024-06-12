const net = require('net');
const fs = require('fs');

const baseIp = '192.168.1.'; // Base IP for the subnet
const ports = [80, 443, 22]; // Replace with your target ports
const startIp = 0;
const endIp = 255;

const checkPort = (ip, port) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = 2000; // Timeout in milliseconds

    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, ip);
  });
};

const logStatus = (ip, port, status) => {
  const logMessage = `IP: ${ip}, Port: ${port}, Status: ${status ? 'Open' : 'Closed'}, Timestamp: ${new Date().toISOString()}\n`;
  fs.appendFile('portStatus.log', logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      console.log('Log saved:', logMessage);
    }
  });
};

const scanSubnet = async (baseIp, startIp, endIp, ports) => {
  for (let i = startIp; i <= endIp; i++) {
    const ip = `${baseIp}${i}`;
    for (let port of ports) {
      try {
        const status = await checkPort(ip, port);
        logStatus(ip, port, status);
      } catch (error) {
        console.error(`Error checking port status for ${ip}:${port}`, error);
      }
    }
  }
};

scanSubnet(baseIp, startIp, endIp, ports);
