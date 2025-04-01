import { ProductDetails, VersionManagerEvent, VersionManagerState } from '@/types';
import { defineStore } from 'pinia';
import { useProductStore } from './productStore';

export const useManagerStore = defineStore('manager', {
    state: () => ({
        installedProducts: [] as ProductDetails[],
        managerState: {
            downloadProgress: 0,
            installationProgress: 0,
            state: VersionManagerState.Idle,
            downloadRate: 0,
            currentHandlingVersion: ''
        },
    }),
    actions: {
        async refreshInstalledProducts() {
            this.installedProducts = await window.vmanager.getInstalledProducts();
        },
        async initializeStore() {
            // const productStore = useProductStore();

            window.vmanager.on(VersionManagerEvent.DownloadProgress, (progressDetails: { bytesLeft: number, rate: number }) => {
                // this.managerState.downloadProgress = Math.round((1 - progressDetails.bytesLeft / productStore.totalSizeBytes) * 100);
                // this.productMeta.rate = (progressDetails.rate / 1024 / 1024).toFixed(2);
                console.log(progressDetails)
            });
            window.vmanager.on(VersionManagerEvent.StatusChange, (options: ProductDetails, status: VersionManagerState) => {
                console.log(status, options);
                // if (options.fullVersion && options.productName) {
                //     this.refreshVersionState(options);
                // }

            })
            // window.vmanager.on(VersionManagerEvent.UnpackingProgress, (progress: number) => {
            //     this.fileManagerState.progress = progress;
            // })

            // await this.refreshInstalledProducts()
        },
    },
    getters: {
        isManagerIdle(state) {
            return [VersionManagerState.Idle, VersionManagerState.Errored].includes(state.managerState.state);
        },
        isHandlingDownload(state) {
            return [VersionManagerState.Downloading, VersionManagerState.Paused].includes(state.managerState.state)
        },
        isDownloading(state) {
            return state.managerState.state == VersionManagerState.Downloading;
        },
        isManagerHandlingFile(state) {
            return [VersionManagerState.Installing, VersionManagerState.Packing].includes(state.managerState.state);
        },
        isHandlingVersionMatchesActive(state) {
            const productStore = useProductStore();
            return !state.managerState.currentHandlingVersion || state.managerState.currentHandlingVersion == productStore.activeVersion.fullName;
        }
    }
})