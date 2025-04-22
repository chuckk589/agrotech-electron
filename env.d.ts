/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly RENDERER_VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}



interface Window {
  guardant: {
    method: <K extends keyof GuardantExposedMethods>(methodName: K, ...args: Parameters<GuardantExposedMethods[K]>) => Promise<ReturnType<GuardantExposedMethods[K]>>;
  },
  vmanager: {
    onError: (callback: (error: any) => void) => void;
    on<T extends VersionManagerEvent>(event: T, callback: (...args: Parameters<VersionManagerEventHandler[T]>) => void): void;
    getVersionState: (options: ProductDetails) => Promise<VersionStats>;
    getVersionManagerState: () => Promise<VersionManagerStats>;
    startDownload: (options: ProductDetails) => Promise<void>;
    startInstall: (options: ProductDetails) => Promise<void>;
    startUninstall: (options: ProductDetails) => Promise<void>;
    cancelDownload: (options: ProductDetails) => Promise<void>;
    pauseDownload: () => Promise<void>;
    resumeDownload: (options: ProductDetails) => Promise<void>;
    exportProduct: (options: ProductDetails, fullPath: string) => Promise<void>;
    importProduct: (fullPath: string) => Promise<void>;
    getInstalledProducts: () => Promise<ProductDetails[]>;
    launchProduct: (options: ProductDetails) => Promise<void>;
  },
  filesystem: {
    openDirectoryDialog: (type: 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent') => Promise<string | null>;
  },
  shell: {
    openUrl: (url: string) => Promise<void>;
  }
}

