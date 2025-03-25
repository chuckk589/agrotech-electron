// stores/apiStore.ts
import { STORE_VERSION } from '@/db/constants';
import { ProductDetails, VersionManagerState, VersionState } from '@/types';
import { defineStore } from 'pinia';
import { getItem, setItem } from '../db';

export type VersionMetaData = {
    fullName: string;
    sizeBytes: number;
}

export const useVersionStore = defineStore('versionStore', {
    state: () => ({
        loading: false,
        productState: { progress: 0, state: VersionState.NotInstalled },
        managerState: { state: VersionManagerState.Idle, currentHandlingVersion: '' },
        productMeta: { totalSizeBytes: 0, rate: '' },
    }),

    actions: {
        async subscribe() {
            window.vmanager.onDownloadProgress((progressDetails: { bytesLeft: number, rate: number }) => {
                this.productState.progress = Math.round((1 - progressDetails.bytesLeft / this.productMeta.totalSizeBytes) * 100);
                this.productMeta.rate = (progressDetails.rate / 1024 / 1024).toFixed(2);
            });

            window.vmanager.onStatusChange((options: ProductDetails, status: VersionManagerState) => {
                console.log(status, options);
                //   this.managerState.state = status;
                this.refreshVersionState(options);
            });
        },
        async getVersionMetadata(fullName: string) {
            const versions: VersionMetaData[] = await getItem(STORE_VERSION, 'versions') || [];
            const version = versions.find(v => v.fullName == fullName);
            return version || { fullName, sizeBytes: 0 };
        },
        async updateVersionMetadata(fullName: string, sizeBytes: number) {
            const versions: VersionMetaData[] = await getItem(STORE_VERSION, 'versions') || [];
            const version = versions.find(v => v.fullName == fullName);
            if (!version) {
                versions.push({ fullName, sizeBytes });
            }
            else {
                version.sizeBytes = sizeBytes;
            }

            await setItem(STORE_VERSION, 'versions', versions);
        },
        async refreshVersionState(options: ProductDetails) {
            const storedMetaData = await this.getVersionMetadata(options.fullVersion)
            this.productState = await window.vmanager.getVersionState(options, storedMetaData.sizeBytes);
            this.managerState = await window.vmanager.getVersionManagerState();
            this.productMeta.totalSizeBytes = storedMetaData.sizeBytes;
        },
        //actions
        async startDownload(productName: string, fullVersion: string) {
            this.loading = true;
            const response = await window.vmanager.startDownload({ productName, fullVersion });
            await this.updateVersionMetadata(fullVersion, response);
            this.loading = false;
        },
        async startInstall(productName: string, fullVersion: string) {
            this.loading = true;
            await window.vmanager.startInstall({ productName, fullVersion });
            // await this.refreshVersionState(productName, fullVersion);
            this.loading = false;
        },
        async pauseDownload() {
            this.loading = true;
            await window.vmanager.pauseDownload();
            this.loading = false;
        },
        async resumeDownload() {
            this.loading = true;
            await window.vmanager.resumeDownload();
            this.loading = false;
        },
        async cancelDownload(productName: string, fullVersion: string) {
            this.loading = true;
            await window.vmanager.cancelDownload(fullVersion);
            // await this.refreshVersionState(productName, fullVersion);
            this.loading = false;
        },
        async action(productName: string, fullVersion: string) {
            if (this.isVersionNotLoaded) {
                await this.startDownload(productName, fullVersion);
            } else if (this.productState.state == VersionState.Downloaded) {
                await this.startInstall(productName, fullVersion);
            } else if (this.productState.state == VersionState.Installed) {
                await this.startUninstall(productName, fullVersion);
            }
        },
        async startExport(productName: string, fullVersion: string, fullPath: string) {
            this.loading = true;
            await window.vmanager.exportProduct({ productName, fullVersion }, fullPath);
            this.loading = false;
        },
        async startImport(productName: string, fullPath: string) {
            this.loading = true;
            await window.vmanager.importProduct(productName, fullPath);
            this.loading = false
        },
        async startUninstall(productName: string, fullVersion: string) {
            this.loading = true;
            await window.vmanager.startUninstall({ productName, fullVersion });
            // await this.refreshVersionState(productName, fullVersion);
            this.loading = false
        },
        async launch(productName: string, fullVersion: string) {
            this.loading = true;
            await window.vmanager.launchProduct({ productName, fullVersion });
            this.loading = false;
        }
    },
    getters: {
        isManagerBusy(state) {
            return state.productState.state == VersionState.PartlyDownloaded || [VersionManagerState.Downloading, VersionManagerState.Paused].includes(state.managerState.state)
        },
        isDownloading(state) {
            return state.managerState.state == VersionManagerState.Downloading;
        },
        isVersionNotLoaded(state) {
            return state.productState.state == VersionState.PartlyDownloaded || state.productState.state == VersionState.NotInstalled;
        },
        isInstalled(state) {
            return state.productState.state == VersionState.Installed;
        }
    }
});
