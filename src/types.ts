

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