// stores/apiStore.ts
import { RetrieveSimulatorWithLicenseDto } from '@/types';
import { defineStore } from 'pinia';
import { RetrieveSimulatorDto } from '../../../agrotech-back/shared';
import { STORE_API } from '../db/constants';
import { useCacheStore } from './cache';

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
export const useApiStore = defineStore('apiStore', {
    state: () => ({
        loading: false,
        error: null as string | null,
        products: [] as RetrieveSimulatorWithLicenseDto[],
    }),

    actions: {
        async fetchProducts() {
            const apiCache = useCacheStore();
            this.loading = true;
            try {
                const data = await apiCache.fetchData<RetrieveSimulatorDto[]>(API_URL + '/simulators', { loadCache: true, cacheName: STORE_API, cacheKey: 'products', expirationTime: 60 * 1000 });
                if (data) {
                    const populated = this.populateProductLicenses(data);
                    this.products = populated;
                    await apiCache.cacheData(populated, { cacheName: STORE_API, cacheKey: 'products' });
                }
                else {
                    this.error = 'Не удалось загрузить продукты.';

                }
            } catch (error) {
                this.error = 'Ошибка при получении продуктов.';
            } finally {
                this.loading = false;
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
