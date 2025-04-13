// stores/apiStore.ts
import { defineStore } from 'pinia';
import { RetrieveSimulatorDto, RetrieveVersionDto } from '../../../agrotech-back/shared';
import { STORE_API, STORE_VERSION } from '../db/constants';
import { ProductCachedMetadata, ProductDetails, RetrieveSimulatorPopulated, VersionManagerEvent, VersionState, VersionStats } from '../types';
import { useCacheStore } from './cacheStore';
import { useManagerStore } from './managerStore';

//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const useProductStore = defineStore('product', {
    state: () => ({
        loading: false,
        products: [] as RetrieveSimulatorPopulated[],
        activeProduct: {} as RetrieveSimulatorPopulated,
        versions: [] as RetrieveVersionDto[],
        activeVersion: {} as RetrieveVersionDto,
        latestVersion: {} as RetrieveVersionDto,
        versionMeta: { state: VersionState.NotInstalled, progress: 0, downloadRate: 0 },
    }),
    getters: {
        isInstalled(state) {
            return state.versionMeta.state == VersionState.Installed;
        },
        isPartlyDownloaded(state) {
            return state.versionMeta.state == VersionState.PartlyDownloaded;
        },
        isLastVersionInstalled(state) {
            const managerStore = useManagerStore();
            const installedProduct = managerStore.installedProducts.find((installedP) => installedP.productName == state.activeProduct.label);
            if (!installedProduct) {
                return true;
            }
            return installedProduct.fullVersion == state.latestVersion.fullName;
        },
        isVersionNotLoaded(state) {
            return state.versionMeta.state == VersionState.PartlyDownloaded || state.versionMeta.state == VersionState.NotInstalled;
        },
        hasActiveLicense(state): boolean {
            if (state.activeProduct) {
                return state.activeProduct.license?.isBroken == false;
            }
            return false;
        },
        activeProductImages(state): string[] {
            if (state.activeProduct) {
                return state.activeProduct.images.map((image) => new URL(image, API_URL).href);
            }
            return [];
        },

    },
    actions: {
        async initializeStore() {
            window.vmanager.on(VersionManagerEvent.DownloadProgress, (progressDetails: { progress: number, rate: number }) => {
                this.versionMeta.progress = progressDetails.progress;
                this.versionMeta.downloadRate = progressDetails.rate
            });
            window.vmanager.on(VersionManagerEvent.UnpackingProgress, (progress: number) => {
                this.versionMeta.progress = progress;
            })
        },
        async setActiveVersion(version_id: number) {
            const version = this.versions.find(v => v.id == version_id);
            if (version) {
                this.activeVersion = version;
                await this.updateVersionMetadata()
            }
        },
        async setActiveProduct(product_id: number) {
            this.activeProduct = this.products.find((product: RetrieveSimulatorPopulated) => product.id == product_id) || null;
            if (this.activeProduct) {
                const managerStore = useManagerStore();

                this.versions = this.activeProduct.versions;
                //try to find installed among the versions
                const installedProduct = managerStore.installedProducts.find((product) => product.productName == this.activeProduct.label);
                if (installedProduct) {
                    this.activeVersion = this.versions.find(v => v.fullName == installedProduct.fullVersion);
                } else {
                    this.activeVersion = this.versions[0];
                }
                this.latestVersion = this.versions[0];
            }

            await this.updateVersionMetadata()

        },
        //STATES
        async updateVersionMetadata() {
            const metaData: VersionStats = await window.vmanager.getVersionState({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName })
            this.versionMeta.progress = metaData.progress;
            this.versionMeta.state = metaData.state;
        },
        //STATES
        async startExport(selectedPath: string) {
            this.loading = true;
            await window.vmanager.exportProduct({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName }, selectedPath);
            this.loading = false;
        },
        async startImport(fullPath: string) {
            this.loading = true;
            await window.vmanager.importProduct(fullPath);
            await this.refreshInstalledProducts();
            this.loading = false
        },
        async startUninstall(productName?: string, fullVersion?: string) {
            this.loading = true;
            await window.vmanager.startUninstall({ productName: productName || this.activeProduct.label, fullVersion: fullVersion || this.activeVersion.fullName });
            await this.refreshInstalledProducts();
            this.loading = false
        },
        async startDownload() {
            this.loading = true;
            await window.vmanager.startDownload({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName });
            // await this.updateVersionMetadata(fullVersion, response);
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
        async cancelDownload() {
            this.loading = true;
            await window.vmanager.cancelDownload({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName });
            this.loading = false;
        },
        async startInstall() {
            this.loading = true;
            await window.vmanager.startInstall({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName });
            await this.refreshInstalledProducts();
            this.loading = false;
        },
        async launchVersion() {
            this.loading = true;
            //save last launch
            const cacheStore = useCacheStore();
            await cacheStore.updateProductMetaData(this.activeProduct.label, new Date().toLocaleString());
            await window.vmanager.launchProduct({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName });
            this.loading = false;
        },
        async startUpdate() {
            const managerStore = useManagerStore();

            const installedProduct = managerStore.installedProducts.find((p: ProductDetails) => p.productName == this.activeProduct.label);

            if (installedProduct) {
                await this.startUninstall(this.activeProduct.label, installedProduct.fullVersion);
            }

            await this.startDownload();
        },
        async versionAction() {
            if (this.isVersionNotLoaded) {
                await this.startUpdate();
            } else if (this.versionMeta.state == VersionState.Downloaded) {
                await this.startInstall();
            } else if (this.versionMeta.state == VersionState.Installed) {
                await this.launchVersion();
                // await this.startUninstall(this.activeProduct.label, this.activeVersion.fullName);
            }
        },
        async refreshInstalledProducts() {
            const managerStore = useManagerStore();
            await managerStore.refreshInstalledProducts();
        },
        async fetchProducts() {
            try {
                this.loading = true;

                const os = window.navigator.platform;
                const url = new URL('/simulators', API_URL);
                url.searchParams.append('os', os);

                const apiCache = useCacheStore();

                const data = await apiCache.fetchData<RetrieveSimulatorDto[]>(url.toString(), { loadCache: true, saveCache: true, cacheName: STORE_API, cacheKey: 'products', expirationTime: 60 * 1000 });

                if (data) {
                    const populated = await this.populateProducts(data);
                    this.products = populated;
                    // await apiCache.cacheData(populated, { cacheName: STORE_API, cacheKey: 'products' });
                }
            } finally {
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            }
        },
        async populateProducts(data: RetrieveSimulatorDto[]): Promise<RetrieveSimulatorPopulated[]> {
            const managerStore = useManagerStore();
            const cacheStore = useCacheStore();

            const launchedProducts: ProductCachedMetadata[] = await cacheStore.getCachedData(STORE_VERSION, 'products');

            return data.map((item) => {
                return {
                    ...item,
                    lastLaunch: launchedProducts?.find((p) => p.label == item.label)?.lastLaunch || 'Никогда',
                    mainImage: new URL(item.mainImage, API_URL).href,
                    license: managerStore.installedLicenses.find((license) => (license.productNumber == item.productNumber && license.featureNumber == item.featureNumber)) || { isBroken: true } as any,
                }
            })
        },
    },
});
