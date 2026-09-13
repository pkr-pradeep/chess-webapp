// stop-server.js
const { exec } = require('child_process');
const port = 3000;

// Function to kill process on specified port for Windows
function killProcessOnPort() {
  // Find the PID using netstat and kill it
  exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error checking port ${port}:`, error);
      return;
    }

    const lines = stdout.trim().split('\n');
    let pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && parts[1].includes(`:${port}`) && parts[4] !== '0') {
        pids.add(parts[4]);
      }
    });

    if (pids.size === 0) {
      console.log(`No process found running on port ${port}`);
      return;
    }

    pids.forEach(pid => {
      exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Failed to kill PID ${pid}:`, err);
          return;
        }
        console.log(`Successfully killed process ${pid} (port ${port})`);
      });
    });
  });
}

killProcessOnPort();