// import { ProductDetails, VersionState } from '@/types';
// import { defineStore } from 'pinia';
// import { useRouter } from 'vue-router';
// import { RetrieveVersionDto } from '../../../agrotech-back/shared';
// import { useManagerStore } from './managerStore';
// import { useProductStore } from './productStore';


// export const useVersionStore = defineStore('versionStore', {
//     state: () => ({
//         loading: false,
//         versions: [] as RetrieveVersionDto[],
//         activeVersion: {} as RetrieveVersionDto,
//         latestVersion: {} as RetrieveVersionDto,
//         versionMeta: { progress: 0, state: VersionState.NotInstalled, totalSizeBytes: 0 },
//     }),
//     actions: {
//         setActiveVersion(version_id: number) {
//             const version = this.versions.find(v => v.id == version_id);
//             if (version) {
//                 this.activeVersion = version;
//             }
//         },
//         setVersions(versions: RetrieveVersionDto[]) {
//             this.versions = versions;

//             //try to find installed among the versions
//             const managerStore = useManagerStore();
//             const productStore = useProductStore();
//             const installedProduct = managerStore.installedProducts.find((product) => product.productName == productStore.activeProduct.label);
//             if (installedProduct) {
//                 const version = this.versions.find(v => v.fullName == installedProduct.fullVersion);
//                 if (version) {
//                     this.activeVersion = version;
//                 } else {
//                     this.activeVersion = this.versions[0];
//                 }
//             }
//         },
//         async startExport(selectedPath: string) {
//             this.loading = true;
//             const productStore = useProductStore();
//             await window.vmanager.exportProduct({ productName: productStore.activeProduct.label, fullVersion: this.activeVersion.fullName }, selectedPath);
//             this.loading = false;
//         },
//         async startImport(fullPath: string) {
//             this.loading = true;
//             await window.vmanager.importProduct(fullPath);
//             // await this.refreshInstalledProducts();
//             this.loading = false
//         },
//         async startUninstall(productName: string, fullVersion: string) {
//             this.loading = true;
//             await window.vmanager.startUninstall({ productName, fullVersion });
//             // await this.refreshInstalledProducts();
//             this.loading = false
//         },
//         async startDownload() {
//             this.loading = true;
//             const productStore = useProductStore();

//             const response = await window.vmanager.startDownload({ productName: productStore.activeProduct.label, fullVersion: this.activeVersion.fullName });
//             // await this.updateVersionMetadata(fullVersion, response);
//             this.loading = false;
//         },
//         async pauseDownload() {
//             this.loading = true;
//             await window.vmanager.pauseDownload();
//             this.loading = false;
//         },
//         async resumeDownload() {
//             this.loading = true;
//             await window.vmanager.resumeDownload();
//             this.loading = false;
//         },
//         async cancelDownload() {
//             this.loading = true;
//             const productStore = useProductStore();
//             await window.vmanager.cancelDownload({ productName: productStore.activeProduct.label, fullVersion: this.activeVersion.fullName });
//             this.loading = false;
//         },
//         async startInstall() {
//             this.loading = true;
//             const productStore = useProductStore();

//             await window.vmanager.startInstall({ productName: productStore.activeProduct.label, fullVersion: this.activeVersion.fullName });
//             // await this.refreshInstalledProducts();
//             this.loading = false;
//         },
//         async launchVersion() {
//             this.loading = true;
//             const productStore = useProductStore();

//             await window.vmanager.launchProduct({ productName: productStore.activeProduct.label, fullVersion: this.activeVersion.fullName });
//             this.loading = false;
//         },
//         async startUpdate() {
//             const managerStore = useManagerStore();
//             const productStore = useProductStore();

//             const installedProduct = managerStore.installedProducts.find((p: ProductDetails) => p.productName == productStore.activeProduct.label);

//             if (installedProduct) {
//                 await this.startUninstall(productStore.activeProduct.label, installedProduct.fullVersion);
//             }

//             await this.startDownload();
//         },
//         async versionAction() {
//             const productStore = useProductStore();
//             if (productStore.hasActiveLicense) {
//                 if (this.isVersionNotLoaded) {
//                     await this.startUpdate();
//                 } else if (this.versionMeta.state == VersionState.Downloaded) {
//                     await this.startInstall();
//                 } else if (this.versionMeta.state == VersionState.Installed) {
//                     const productStore = useProductStore();
//                     await this.startUninstall(productStore.activeProduct.label, this.activeVersion.fullName);
//                 }
//             } else {
//                 const router = useRouter();
//                 router.push({ name: 'codes' });
//             }

//         }
//     },
//     getters: {
//         isInstalled(state) {
//             return state.versionMeta.state == VersionState.Installed;
//         },
//         isLastVersionInstalled(state) {
//             const managerStore = useManagerStore();
//             return managerStore.installedProducts.some((p) => p.fullVersion == state.latestVersion.fullName);
//         },
//         isVersionNotLoaded(state) {
//             return state.versionMeta.state == VersionState.PartlyDownloaded || state.versionMeta.state == VersionState.NotInstalled;
//         },
//     }
// })