import { app, BrowserWindow, dialog, FileFilter, ipcMain } from 'electron';
import contextMenu from 'electron-context-menu';
import squirrel from 'electron-squirrel-startup';
import path from 'path';
import { ProductDetails, VersionManagerEvent, VersionManagerEventHandler } from './types';
import VersionManager from './utils/versionManager';

let mainWindow: BrowserWindow | null = null;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrel) {
  app.quit();
}
contextMenu({
  showSaveImageAs: true
});

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // preload: path.join(__dirname, '../../dist/main.js'),
      nodeIntegration: true,
      webSecurity: false,
      // contextIsolation: false
    },
    show: false,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  mainWindow.maximize()
  mainWindow.show()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let versionManager = new VersionManager();

versionManager.emit = ((eventName: VersionManagerEvent, ...args: Parameters<VersionManagerEventHandler[typeof eventName]>) => {
  if (mainWindow) {
    mainWindow.webContents.send(eventName, ...args);
  }
});


safeIpcHandle('get-version-state', async (_, { options, expectedSizeBytes }: { options: ProductDetails, expectedSizeBytes: number }) => {
  return versionManager.getProductVersionState(options, expectedSizeBytes);
});

safeIpcHandle('new-product-download', async (_, { options }: { options: ProductDetails }) => {
  return versionManager.startProductVersionDownload(options);
});

safeIpcHandle('get-version-manager-state', async () => {
  return versionManager.getVersionManagerState();
});

safeIpcHandle('cancel-download', async (_, { options }) => {
  return versionManager.resetDownload(options);
})

safeIpcHandle('pause-download', async () => {
  return versionManager.pauseDownload();
})

safeIpcHandle('resume-download', async () => {
  return versionManager.resumeDownload();
})

safeIpcHandle('install-product', async (_, { options }: { options: ProductDetails }) => {
  return versionManager.startProductVersionInstall(options);
})
safeIpcHandle('start-product-export', async (_, { options, fullPath }: { options: ProductDetails, fullPath: string }) => {
  return versionManager.startProductVersionExport(options, fullPath);
});
safeIpcHandle('start-product-import', async (_, { fullPath }) => {
  return versionManager.startProductVersionImport(fullPath);
})

safeIpcHandle('uninstall-product', async (_, { options }: { options: ProductDetails }) => {
  return versionManager.startProductVersionUninstall(options);
});

safeIpcHandle('get-installed-versions', async (_) => {
  return versionManager.getInstalledProducts();
});
safeIpcHandle('launch-product', async (_, { options }: { options: ProductDetails }) => {
  return versionManager.launchProductVersion(options);
});

//filesystem
safeIpcHandle('open-directory-dialog', async (_, type: string) => {
  const filters: FileFilter[] = [];
  let title = '';
  if (type == 'openFile') {
    filters.push({ name: 'All Files', extensions: ['zip'] });
    title = 'Select a file to import';
  }
  const result = await dialog.showOpenDialog({
    properties: [type as any],
    title,
    filters
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});


function safeIpcHandle(channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any>) {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await listener(event, ...args);
    } catch (e) {
      if (mainWindow) {
        mainWindow.webContents.send('error', e);
      }
      return
    }
  });
}