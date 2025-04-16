import { RetrieveSimulatorDto } from "../../agrotech-back/shared";
import { LicenseEntryMinified } from "./guardant.types";


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
    DownloadProgress = 'download-progress',
    UnpackingProgress = 'unpacking-progress',
}

export type VersionManagerEventHandler = {
    [VersionManagerEvent.StatusChange]: (options: ProductDetails, status: VersionManagerState) => void;
    [VersionManagerEvent.DownloadProgress]: (progressDetails: { progress: number, rate: number }) => void;
    [VersionManagerEvent.UnpackingProgress]: (progress: number) => void;
};
export type ProductCachedMetadata = { licenseId: number, lastLaunch?: number, activationDate?: number }
// export type LicenseCachedMetadata = { licenseId: number, timestamp: number }
export type RetrieveSimulatorPopulated = RetrieveSimulatorDto & {
    license: LicenseEntryMinified & ProductCachedMetadata;
} 
export type ProductMetaData = {
    productName: string;
    fullVersion: string;
    sizeBytes: number;
}