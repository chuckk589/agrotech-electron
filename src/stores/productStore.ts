// stores/apiStore.ts
import { ProductDetails, RetrieveSimulatorWithLicenseDto, VersionState } from '@/types';
import { defineStore } from 'pinia';
import { RetrieveSimulatorDto, RetrieveVersionDto } from '../../../agrotech-back/shared';
import { STORE_API } from '../db/constants';
import { useCacheStore } from './cache';
import { useManagerStore } from './managerStore';

//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;
const licenseResponse = {
    "licenseCount": 2,
    "licenses": [
        {
            "isBroken": 0,
            "dongleInfo": {
                "dongleId": 1014069770,
                "dongleModel": 128,
                "typeFlags": 442,
                "netResource": 0,
                "publicCode": -1368487351,
                "driverType": 2,
                "dongleMemorySize": 59392,
                "firmwareState": 0,
                "firmwareVersion": 16778248,
                "firmwareFeatures": 1,
                "hwMcuVersion": 8
            },
            "licenseInfo": {
                "currentUpdate": 3788469671,
                "flags": 1,
                "freeMemory": 55642,
                "licenseId": 1014069770,
                "vendorPublicCode": -1368487351,
                "productsCount": 1,
                "vendorCompanyName": "Guardant",
                "products": [
                    {
                        "number": 1,
                        "modification": 0,
                        "flags": 0,
                        "featuresCount": 4,
                        "name": "Sign local",
                        "features": [
                            {
                                "number": 1,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "GRD Feature local"
                            },
                            {
                                "number": 7,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 6,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 6,
                                "name": "Количество запусков для unlim"
                            },
                            {
                                "number": 10,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 6,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 6,
                                "name": "Количество запусков Encrypt"
                            },
                            {
                                "number": 11,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 6,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 6,
                                "name": "Количество запусков Decrypt"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "isBroken": 0,
            "dongleInfo": {
                "dongleId": 1014069296,
                "dongleModel": 128,
                "typeFlags": 509,
                "netResource": 10,
                "publicCode": -1368487351,
                "driverType": 2,
                "dongleMemorySize": 59392,
                "firmwareState": 0,
                "firmwareVersion": 16778248,
                "firmwareFeatures": 1,
                "hwMcuVersion": 8
            },
            "licenseInfo": {
                "currentUpdate": 2590691852,
                "flags": 1,
                "freeMemory": 53245,
                "licenseId": 1014069296,
                "vendorPublicCode": -1368487351,
                "productsCount": 1,
                "vendorCompanyName": "Guardant",
                "customerFirstName": "Иван",
                "customerLastName": "Иванов",
                "customerEmail": "guardant@guardant.ru",
                "products": [
                    {
                        "number": 2,
                        "modification": 1,
                        "flags": 0,
                        "featuresCount": 9,
                        "name": "Time local net",
                        "features": [
                            {
                                "number": 2,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "GRD Feature local"
                            },
                            {
                                "number": 4,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 1546300800,
                                "validUpToDate": 1893455999,
                                "restOfLifeTime": 307732671,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "Период времени"
                            },
                            {
                                "number": 5,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 1893455999,
                                "restOfLifeTime": 307732671,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "Дата истечения"
                            },
                            {
                                "number": 6,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 252460800,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "Количество дней"
                            },
                            {
                                "number": 7,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 6,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 6,
                                "name": "Количество запусков для unlim"
                            },
                            {
                                "number": 8,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 1546300800,
                                "validUpToDate": 1548979199,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "Период времени закончился"
                            },
                            {
                                "number": 9,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 1861920000,
                                "validUpToDate": 1893455999,
                                "restOfLifeTime": 31535999,
                                "maxRunCounter": 0,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 0,
                                "name": "Период времени не начался"
                            },
                            {
                                "number": 10,
                                "flags": 0,
                                "remoteMode": 1,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 6,
                                "maxConcurrentResource": 0,
                                "currentRunCounterValue": 6,
                                "name": "Количество запусков Encrypt"
                            },
                            {
                                "number": 11,
                                "flags": 0,
                                "remoteMode": 3,
                                "consumptionMode": 0,
                                "validFromDate": 0,
                                "validUpToDate": 0,
                                "restOfLifeTime": 0,
                                "maxRunCounter": 18,
                                "maxConcurrentResource": 6,
                                "currentRunCounterValue": 18,
                                "name": "Количество запусков Decrypt"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
export const useProductStore = defineStore('product', {
    state: () => ({
        loading: false,
        products: [] as RetrieveSimulatorWithLicenseDto[],
        activeProduct: {} as RetrieveSimulatorWithLicenseDto,
        versions: [] as RetrieveVersionDto[],
        activeVersion: {} as RetrieveVersionDto,
        latestVersion: {} as RetrieveVersionDto,
        versionMeta: { state: VersionState.NotInstalled, totalSizeBytes: 0 },
    }),
    getters: {
   
        isInstalled(state) {
            return state.versionMeta.state == VersionState.Installed;
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
                return state.activeProduct.license.isBroken == false;
            }
            return false;
        },
        activeProductImages(state): string[] {
            if (state.activeProduct) {
                return state.activeProduct.images.map((image) => new URL(image, API_URL).href);
            }
            return [];
        }
    },
    actions: {
        setActiveVersion(version_id: number) {
            const version = this.versions.find(v => v.id == version_id);
            if (version) {
                this.activeVersion = version;
            }
        },
        async setActiveProduct(product_id: number) {
            this.activeProduct = this.products.find((product: RetrieveSimulatorWithLicenseDto) => product.id == product_id) || null;
            if (this.activeProduct) {
                this.versions = this.activeProduct.versions;
                //try to find installed among the versions
                const managerStore = useManagerStore();
                const installedProduct = managerStore.installedProducts.find((product) => product.productName == this.activeProduct.label);
                if (installedProduct) {
                    this.activeVersion = this.versions.find(v => v.fullName == installedProduct.fullVersion);
                } else {
                    this.activeVersion = this.versions[0];
                }
                this.latestVersion = this.versions[0];
            }
        },
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
        async startUninstall(productName: string, fullVersion: string) {
            this.loading = true;
            await window.vmanager.startUninstall({ productName, fullVersion });
            await this.refreshInstalledProducts();
            this.loading = false
        },
        async startDownload() {
            this.loading = true;

            const response = await window.vmanager.startDownload({ productName: this.activeProduct.label, fullVersion: this.activeVersion.fullName });
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
                await this.startUninstall(this.activeProduct.label, this.activeVersion.fullName);
            }
        },
        async refreshInstalledProducts() {
            const managerStore = useManagerStore();
            await managerStore.refreshInstalledProducts();
        },
        async fetchProducts() {
            const apiCache = useCacheStore();
            const data = await apiCache.fetchData<RetrieveSimulatorDto[]>(API_URL + '/simulators', { loadCache: true, cacheName: STORE_API, cacheKey: 'products', expirationTime: 60 * 1000 });
            if (data) {
                const populated = this.populateProductLicenses(data);
                this.products = populated;
                await apiCache.cacheData(populated, { cacheName: STORE_API, cacheKey: 'products' });
            }
        },
        populateProductLicenses(data: RetrieveSimulatorDto[]): RetrieveSimulatorWithLicenseDto[] {
            return data.map((item) => {
                const hasLicense = licenseResponse.licenses.some((license) => {
                    const product = license.licenseInfo.products.find((product) => product.number == item.productNumber);
                    if (product) {
                        const feature = product.features.find((feature) => feature.number == item.productKey);

                        if (feature) {
                            return true;
                        }
                    }
                    return false;
                });

                return {
                    ...item,
                    license: {
                        isBroken: hasLicense ? false : true,
                    }
                }
            })

        }
    },
});
