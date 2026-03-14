const { app, BrowserWindow, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');

let mainWindow;
let backendProcess;

function getNodePath() {
  const possiblePaths = [
    '/usr/local/bin/node',
    '/usr/bin/node',
    '/opt/homebrew/bin/node',
    '/opt/local/bin/node',
  ];
  const fs = require('fs');
  for (const p of possiblePaths) {
    try { if (fs.existsSync(p)) return p; } catch (e) {}
  }
  return 'node';
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend/server.js')
    : path.join(__dirname, '../backend/server.js');

  const nodePath = getNodePath();
  console.log('Using node:', nodePath);
  console.log('Backend path:', backendPath);

  backendProcess = spawn(nodePath, [backendPath], {
    stdio: 'pipe',
    env: { ...process.env, PORT: '5050' }
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
  backendProcess.on('error', (err) => console.error('Failed to start backend:', err));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'TN Book Store - ERP',
    show: false,
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.openDevTools();

  const frontendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'frontend/dist/index.html')
    : path.join(__dirname, '../frontend/dist/index.html');

  console.log('Loading frontend from:', frontendPath);
  mainWindow.loadFile(frontendPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  startBackend();

  await waitOn({ resources: ['http://localhost:5050/test'], timeout: 15000 })
    .catch(() => console.log('Backend timeout — continuing anyway'));

  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});