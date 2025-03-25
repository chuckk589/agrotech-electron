import { contextBridge, ipcRenderer } from 'electron';
import { ProductDetails } from './types';

contextBridge.exposeInMainWorld('vmanager', {
    // getVersionState: (productName: string, fullVersion: string, sizeBytes: number) => ipcRenderer.invoke('get-version-state', { productName, fullVersion, sizeBytes }),
    getVersionState: (options: ProductDetails, expectedSizeBytes: number) => ipcRenderer.invoke('get-version-state', { options, expectedSizeBytes }),
    getVersionManagerState: () => ipcRenderer.invoke('get-version-manager-state'),
    // onStatusChange: (callback: (status: string) => void) => { ipcRenderer.on('status-change', (_, status) => callback(status)); },
    onStatusChange: (callback: (options: ProductDetails, status: string) => void) => { ipcRenderer.on('status-change', (_, options, status) => callback(options, status)); },
    onDownloadProgress: (callback: (progressDetails: { bytesLeft: number, rate: number }) => void) => { ipcRenderer.on('download-progress', (_, progress) => callback(progress)); },
    onError: (callback: (error: string) => void) => { ipcRenderer.on('error', (_, error) => callback(error)); },
    startDownload: (options: ProductDetails) => ipcRenderer.invoke('new-product-download', { options }),
    startInstall: (options: ProductDetails) => ipcRenderer.invoke('install-product', { options }),
    startUninstall: (options: ProductDetails) => ipcRenderer.invoke('uninstall-product', { options }),
    cancelDownload: (fullVersion: string) => ipcRenderer.invoke('cancel-download', { fullVersion }),
    pauseDownload: () => ipcRenderer.invoke('pause-download'),
    resumeDownload: async () => await ipcRenderer.invoke('resume-download'),
    exportProduct: async (options: ProductDetails, fullPath: string) => await ipcRenderer.invoke('start-product-export', { options, fullPath }),
    importProduct: async (productName: string, fullPath: string) => await ipcRenderer.invoke('start-product-import', { productName, fullPath }),
    getInstalledProducts: async () => await ipcRenderer.invoke('get-installed-versions'),
    launchProduct: async (options: ProductDetails) => await ipcRenderer.invoke('launch-product', { options })
});

contextBridge.exposeInMainWorld('filesystem', {
    openDirectoryDialog: async (type: string) => await ipcRenderer.invoke('open-directory-dialog', type)
});
