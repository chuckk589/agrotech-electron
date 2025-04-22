import { contextBridge, ipcRenderer } from 'electron';
import { ProductDetails, VersionManagerEvent, VersionManagerEventHandler } from './types';

contextBridge.exposeInMainWorld('vmanager', {
    getVersionState: (options: ProductDetails) => ipcRenderer.invoke('get-version-state', { options }),
    getVersionManagerState: () => ipcRenderer.invoke('get-version-manager-state'),
    on: (event: VersionManagerEvent, callback: (...args: Parameters<VersionManagerEventHandler[typeof event]>) => void) => {
        ipcRenderer.on(event, (_, ...args) => callback(...args as any));
    },
    onError: (callback: (error: string) => void) => { ipcRenderer.on('error', (_, error) => callback(error)); },
    startDownload: (options: ProductDetails) => ipcRenderer.invoke('new-product-download', { options }),
    startInstall: (options: ProductDetails) => ipcRenderer.invoke('install-product', { options }),
    startUninstall: (options: ProductDetails) => ipcRenderer.invoke('uninstall-product', { options }),
    cancelDownload: (options: ProductDetails) => ipcRenderer.invoke('cancel-download', { options }),
    pauseDownload: () => ipcRenderer.invoke('pause-download'),
    resumeDownload: async (options: ProductDetails) => await ipcRenderer.invoke('resume-download', { options }),
    exportProduct: async (options: ProductDetails, fullPath: string) => await ipcRenderer.invoke('start-product-export', { options, fullPath }),
    importProduct: async (fullPath: string) => await ipcRenderer.invoke('start-product-import', { fullPath }),
    getInstalledProducts: async () => await ipcRenderer.invoke('get-installed-versions'),
    launchProduct: async (options: ProductDetails) => await ipcRenderer.invoke('launch-product', { options }),
});

contextBridge.exposeInMainWorld('filesystem', {
    openDirectoryDialog: async (type: string) => await ipcRenderer.invoke('open-directory-dialog', type)
});

contextBridge.exposeInMainWorld('guardant', {
    method: async <K extends keyof GuardantExposedMethods>(methodName: K, ...args: Parameters<GuardantExposedMethods[K]>) => await ipcRenderer.invoke('guardant', { options: { methodName, args } }),
});

contextBridge.exposeInMainWorld('shell', {
    openUrl: async (url: string) => await ipcRenderer.invoke('open-url', { url }),
});