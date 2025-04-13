import { app, BrowserWindow, dialog, FileFilter, ipcMain } from 'electron';
import contextMenu from 'electron-context-menu';
import squirrel from 'electron-squirrel-startup';
import path, { join } from 'path';
import { Guardant } from './guardant';
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


  // console.log('getApiVersion', guardant.core.getApiVersion());
  // console.log('getLicenseInfo', JSON.stringify(guardant.core.getLicenseInfo("{\"dongleModel\":  0, \"remoteMode\": 3}")));
  // console.log('verifyDigest', guardant.core.verifyDigest(new Uint8Array(40), new Uint8Array([1, 2, 3]), new Uint8Array(20)));
  // console.log('checkSerialNumberFormat', guardant.core.checkSerialNumberFormat("uNfLMh-a8A6pn-vPJhHi-MCnDM3-mcJMqa"))
  // console.log('ledBlink', guardant.core.ledBlink(12345678));
  // console.log('getErrorMessage', guardant.core.getErrorMessage(GuardantStatus.INVALID_LICENSE));
  // console.log(guardant.core.free(Buffer.alloc(64)));
  // console.log('licenseActivate', guardant.core.licenseActivate("uNfLMh-a8A6pn-vPJhHi-MCnDM3-mcJMqa"));
  // console.log('licenseRemove', guardant.core.licenseRemove(-1957431430));
  // console.log('licenseCheckUpdateAvailable', guardant.core.licenseCheckUpdateAvailable(12345678, '{"dongleModel":1024}'));
  // console.log('licenseCheckIsNotBanned', guardant.core.licenseCheckIsNotBanned(12345678, '{"dongleModel":1024}'));
  // console.log('licenseCreateActivationRequest', guardant.core.licenseCreateActivationRequest());
  // console.log('licenseSendActivationRequest', guardant.core.licenseSendActivationRequest("activation.guardant.com", "443", new Uint8Array([1, 2, 3]), '{"remoteMode":1}'));
  // console.log('licenseCreateUpdateRequest', guardant.core.licenseCreateUpdateRequest(12345678));
  // console.log('licenseSendUpdateRequest', guardant.core.licenseSendUpdateRequest(new Uint8Array([1, 2, 3]), '{"dongleModel":1024}'));
  // console.log('licenseInstall', guardant.core.licenseInstall(new Uint8Array([1, 2, 3])));
  // console.log('featureLogin', guardant.core.featureLogin(12345678, '{"featureNumber": 1}'));
  // console.log('featureLogout', guardant.core.featureLogout(987654321));
  // console.log('featureGetInfo', guardant.core.featureGetInfo(987654321));

  // console.log('featureCheck', guardant.core.featureCheck(987654321, 1));

  // const input = new Uint8Array([1, 2, 3, 4]);
  // const output = new Uint8Array(4);
  // console.log('featureEncrypt', guardant.core.featureEncrypt(987654321, 0, input, output));
  // console.log('featureDecrypt', guardant.core.featureDecrypt(987654321, 0, input, output));
  // console.log('featureSign', guardant.core.featureSign(987654321, 0, input, new Uint8Array(20)));

  // console.log('featureGetTimeLimit', guardant.core.featureGetTimeLimit(987654321));
  // console.log('featureGetRunCounter', guardant.core.featureGetRunCounter(987654321));
  // console.log('featureGetMaxConcurrentResource', guardant.core.featureGetMaxConcurrentResource(987654321));
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

const libPath = app.isPackaged ? join(process.resourcesPath, 'guardant') : join(app.getAppPath(), 'guardant');

const guardant = new Guardant(libPath)

safeIpcHandle('guardant', async <K extends keyof GuardantExposedMethods>(_, { options }: { options: { methodName: K, args: Parameters<GuardantExposedMethods[K]> } }) => {
  return (guardant[options.methodName] as any)(...options.args)
});

const versionManager = new VersionManager();

versionManager.emit = ((eventName: VersionManagerEvent, ...args: Parameters<VersionManagerEventHandler[typeof eventName]>) => {
  if (mainWindow) {
    mainWindow.webContents.send(eventName, ...args);
  }
});

safeIpcHandle('get-version-state', async (_, { options }: { options: ProductDetails }) => {
  return versionManager.getProductVersionState(options);
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