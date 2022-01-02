import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import installer from './helpers/LegendaryInstaller';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  if(!installer.isInstalled()) {
    await installer.install();
  }

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
