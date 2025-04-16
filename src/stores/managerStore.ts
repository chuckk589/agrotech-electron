import { defineStore } from 'pinia';
import { LicenseEntryMinified } from '../guardant.types';
import { ProductDetails, VersionManagerEvent, VersionManagerState } from '../types';
import { useProductStore } from './productStore';
export const useManagerStore = defineStore('manager', {
    state: () => ({
        installedProducts: [] as ProductDetails[],
        installedLicenses: [] as LicenseEntryMinified[],
        managerState: {
            state: VersionManagerState.Idle,
            currentHandlingVersion: ''
        },
    }),
    actions: {
        async refreshInstalledProducts() {
            this.installedProducts = await window.vmanager.getInstalledProducts();
            this.installedLicenses = await window.guardant.method('getExistingLicenses');
            console.log(this.installedLicenses)
            // this.installedLicenses = [{
            //     isBroken: false,
            //     productNumber: 7,
            //     featureNumber: 4,
            //     currentRunCounterValue: 22,
            //     validFromDate: 11111111,
            //     validUpToDate: 1111111,
            // }]
        },
        async initializeStore() {
            const productStore = useProductStore();

            window.vmanager.on(VersionManagerEvent.StatusChange, (options: ProductDetails, status: VersionManagerState) => {
                this.updateManagerState();
                productStore.updateVersionMetadata()
            })

            await this.refreshInstalledProducts()
        },
        //STATES
        async updateManagerState() {
            this.managerState = await window.vmanager.getVersionManagerState();
        }
        //STATES
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
        isHandlingFile(state) {
            return [VersionManagerState.Installing, VersionManagerState.Packing].includes(state.managerState.state);
        },
        isHandlingVersionMatchesActive(state) {
            const productStore = useProductStore();
            return !state.managerState.currentHandlingVersion || state.managerState.currentHandlingVersion == productStore.activeVersion.fullName;
        }
    }
})