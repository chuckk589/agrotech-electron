/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  vmanager: {
    onError: (callback: (error: any) => void) => void;
    onStatusChange: (callback: (options: ProductDetails, status: VersionManagerState) => void) => void;
    onDownloadProgress: (callback: (progressDetails: { bytesLeft: number, rate: number }) => void) => void;
    getVersionState: (options: ProductDetails, expectedSizeBytes: number) => Promise<VersionStats>;
    getVersionManagerState: () => Promise<VersionManagerStats>;
    startDownload: (options: ProductDetails) => Promise<number>;
    startInstall: (options: ProductDetails) => Promise<void>;
    startUninstall: (options: ProductDetails) => Promise<void>;
    cancelDownload: (options: ProductDetails) => Promise<void>;
    pauseDownload: () => Promise<void>;
    resumeDownload: () => Promise<void>;
    exportProduct: (options: ProductDetails, fullPath: string) => Promise<void>;
    importProduct: (fullPath: string) => Promise<void>;
    getInstalledProducts: () => Promise<ProductDetails[]>;
    launchProduct: (options: ProductDetails) => Promise<void>;
  },
  filesystem: {
    openDirectoryDialog: (type: 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent') => Promise<string | null>;
  }
}

