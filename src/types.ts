import { RetrieveSimulatorDto } from "../../agrotech-back/shared";


export type News = {
    title: string;
    date: string;
    content: string;
}

export enum VersionState {
    Installed = 'installed',
    Downloaded = 'downloaded',
    PartlyDownloaded = 'partly-downloaded',
    NotInstalled = 'not-installed',
}
export enum VersionManagerState {
    Installing = 'installing',
    Uninstalling = 'uninstalling',
    Packing = 'packing',
    Idle = 'idle',
    Downloading = 'downloading',
    Paused = 'paused',
    Errored = 'errored',
}

export type VersionManagerStats = {
    // progress: number;
    state: VersionManagerState;
    currentHandlingVersion: string;
}
export type VersionStats = {
    progress: number;
    state: VersionState;
}

export type ProductDetails = {
    productName: string;
    fullVersion: string;
}

export enum VersionManagerEvent {
    StatusChange = 'status-change',
    DownloadProgress = 'on-download-progress',
    UnpackingProgress = 'on-unpacking-progress',
}

export type VersionManagerEventHandler = {
    [VersionManagerEvent.StatusChange]: (options: ProductDetails, status: VersionManagerState) => void;
    [VersionManagerEvent.DownloadProgress]: (progressDetails: { bytesLeft: number, rate: number }) => void;
    [VersionManagerEvent.UnpackingProgress]: (progress: number) => void;
};

export type ProductLicense = {
    isBroken: boolean;
    // validFromDate: number;
    // validUpToDate: number;
    // restOfLifeTime: number;
    // maxConcurrentResource: number;
    // currentRunCounterValue: number;
}

export type RetrieveSimulatorWithLicenseDto = RetrieveSimulatorDto & {
    license: ProductLicense;
}