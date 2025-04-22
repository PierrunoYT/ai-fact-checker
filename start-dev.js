const { spawn } = require('child_process');
const path = require('path');
const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

// Function to create a process with colored output
function createProcess(command, args, options, color) {
  const proc = spawn(command, args, {
    ...options,
    shell: true,
    stdio: 'pipe'
  });
  
  proc.stdout.on('data', (data) => {
    console.log(`\x1b[${color}m${data.toString()}\x1b[0m`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`\x1b[${color}m${data.toString()}\x1b[0m`);
  });
  
  proc.on('error', (error) => {
    console.error(`\x1b[31mProcess Error: ${error.message}\x1b[0m`);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\x1b[31mProcess exited with code ${code}\x1b[0m`);
    }
  });
  
  return proc;
}

console.log('Starting development servers...');

// Start backend server (blue output)
const backendProcess = createProcess(
  npmCommand,
  ['run', 'dev'],
  { cwd: path.join(__dirname, 'backend') },
  '36' // Cyan
);

// Start frontend server (green output)
const frontendProcess = createProcess(
  npmCommand,
  ['run', 'dev'],
  { cwd: path.join(__dirname, 'frontend') },
  '32' // Green
);

// Handle process termination
function cleanup() {
  console.log('\nShutting down development servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);