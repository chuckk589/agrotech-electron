import archiver from 'archiver';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import child from 'child_process';
import { app } from 'electron';
import Store from 'electron-store';
import { default as fs } from 'fs';
import { throttle } from 'lodash';
import path from 'path';
import unzipper from 'unzipper';
import { ProductDetails, ProductMetaData, VersionManagerEvent, VersionManagerEventHandler, VersionManagerState, VersionManagerStats, VersionState, VersionStats } from '../types';
import { VersionManagerErrorCode } from './errorHandler';
const PRODUCT_STORE = 'products';
class VersionManager {

    /**
     * @param basePath The base path where the versions are stored
     * @param tempPath The path where the temporary files are stored
     * @param state The current state of the version manager
     */
    private readonly basePath: string;
    private readonly tempPath: string;
    private state: VersionManagerState = VersionManagerState.Idle;

    private store = new Store<ProductMetaData>();

    private currentHandlingVersion: {
        fullVersion: string;
        productName: string;
        url: string;
        controller: AbortController | null;
    }
    emit<T extends VersionManagerEvent>(event: T, ...args: Parameters<VersionManagerEventHandler[T]>) { }

    constructor() {

        this.basePath = path.join(app.getPath('userData'), 'products');
        this.tempPath = path.join(app.getPath('userData'), 'temp');
        this.currentHandlingVersion = {} as any;

        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }

        if (!fs.existsSync(this.tempPath)) {
            fs.mkdirSync(this.tempPath, { recursive: true });
        }

    }
    //STORE
    private getStoreProductData(productName: string, fullVersion: string): ProductMetaData {
        const products: ProductMetaData[] = this.store.get(PRODUCT_STORE) || [];
        const product = products.find((product) => product.productName == productName && product.fullVersion == fullVersion);
        return product
    }
    private setStoreProductData(data: ProductMetaData): void {
        const products: ProductMetaData[] = this.store.get(PRODUCT_STORE) || [];

        const index = products.findIndex((product) => product.productName == data.productName && product.fullVersion == data.fullVersion);

        if (index > -1) {
            products[index] = data;
        } else {
            products.push(data);
        }

        this.store.set(PRODUCT_STORE, products);
    }

    /**
     * used to get info about the any product version
     * @param productName e.g. 'agrotechsim228'
     * @param fullVersion e.g. 'LINUX_agrotechsim228_v1.0.0'
     * @returns 
     */
    getProductVersionState(options: ProductDetails): VersionStats {
        const finalPath = path.join(this.basePath, options.productName, options.fullVersion);
        //FIXME: check if downloaded and installed
        if (fs.existsSync(finalPath)) {
            return { progress: 100, state: VersionState.Installed };
        }

        const loadedSize = this.getVersionLoadedSize(options.fullVersion);

        const productData = this.getStoreProductData(options.productName, options.fullVersion);

        if (productData) {
            if (productData.sizeBytes > 0) {
                if (loadedSize == productData.sizeBytes) {
                    return { progress: 100, state: VersionState.Downloaded };
                } else if (loadedSize > 0) {
                    return { progress: Math.round((loadedSize / productData.sizeBytes) * 100), state: VersionState.PartlyDownloaded };
                }
            }
        }
        return { progress: 0, state: VersionState.NotInstalled };
    }

    public getVersionManagerState(): VersionManagerStats {
        return { state: this.state, currentHandlingVersion: this.currentHandlingVersion.fullVersion };
    }

    private getCurrentHandlingVersionLoadedSize(): number {
        return this.getVersionLoadedSize(this.currentHandlingVersion.fullVersion);
    }
    private getVersionLoadedSize(fullVersion: string): number {
        const tempFilePath = this.getVersionTempPath(fullVersion);

        if (fs.existsSync(tempFilePath)) {
            const stats = fs.statSync(tempFilePath);
            return stats.size;
        }
        return 0;
    }
    private async getActualFileSize(url: string): Promise<number> {
        const _url = new URL(url);
        const size = _url.searchParams.get('fsize');
        if (size) {
            return parseInt(size, 10);
        }
        return 0;
    }

    private changeStatus(status: VersionManagerState, force = false) {
        if (force || this.state != status) {
            this.state = status;
            this.emit(VersionManagerEvent.StatusChange, { productName: this.currentHandlingVersion.productName, fullVersion: this.currentHandlingVersion.fullVersion }, status);
        }
    }
    private async getDownloadLink(fullVersion: string) {
        //@ts-ignore
        const url = new URL('config/download-link', import.meta.env.VITE_API_URL)

        url.searchParams.append('fullVersion', fullVersion);

        const response = await axios.get(url.toString());
        return response.data;
    }
    private handleProgress(event: AxiosProgressEvent, sizeBytes: number): void {
        if (event.lengthComputable) {
            // const rate = Math.round((event.loaded / 1024 / 1024) * 100) / 100;
            // const progress = Math.round((event.loaded / sizeBytes) * 1000) / 10;
            const progress = Math.floor((event.loaded / sizeBytes) * 100);
            this.emit(VersionManagerEvent.DownloadProgress, { progress, rate: 0 });
        }
    }
    private isBusy(): boolean {
        return [VersionManagerState.Installing, VersionManagerState.Packing, VersionManagerState.Uninstalling, VersionManagerState.Downloading].includes(this.state);
    }
    private switchHandlingVersion(options: ProductDetails) {
        this.currentHandlingVersion.productName = options.productName;
        this.currentHandlingVersion.fullVersion = options.fullVersion;

        if (this.currentHandlingVersion.controller) {
            this.currentHandlingVersion.controller.abort();
        }
    }
    async startProductVersionDownload(options: ProductDetails): Promise<void> {
        try {
            if (this.isBusy()) return;

            this.switchHandlingVersion(options);

            this.currentHandlingVersion.url = await this.getDownloadLink(options.fullVersion);
            this.currentHandlingVersion.controller = new AbortController();

            //save file size to store
            const sizeBytes = await this.getActualFileSize(this.currentHandlingVersion.url);

            this.setStoreProductData({ productName: options.productName, fullVersion: options.fullVersion, sizeBytes });

            const existingFileSize = this.getCurrentHandlingVersionLoadedSize();
            console.log(existingFileSize)
            const headers: any = existingFileSize
                ? { Range: `bytes=${existingFileSize}-` }
                : {};

            const throttledHandleProgress = throttle((evt: AxiosProgressEvent) => this.handleProgress(evt, sizeBytes), 1000);

            const config: AxiosRequestConfig = {
                headers,
                signal: this.currentHandlingVersion.controller.signal,
                onDownloadProgress: throttledHandleProgress,
            };

            const response = await axios.get(this.currentHandlingVersion.url, {
                ...config,
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(this.getCurrentVersionTempPath(), { flags: existingFileSize ? 'a' : 'w' });

            response.data.pipe(writer);

            writer.on('finish', () => {
                this.changeStatus(VersionManagerState.Idle);
            });

            this.changeStatus(VersionManagerState.Downloading);

        } catch (error) {
            if (this.state != VersionManagerState.Paused) {
                this.throwError(VersionManagerErrorCode.DownloadFailed)
            }
        }
    }
    async startProductVersionInstall(options: ProductDetails): Promise<void> {
        try {
            if (this.isBusy()) return;

            this.switchHandlingVersion(options);

            this.changeStatus(VersionManagerState.Installing);

            const fullPath = this.getCurrentVersionTempPath();

            const directory = await unzipper.Open.file(fullPath);

            await this.extractZip(directory, this.getCurrentVersionPath());

            this.changeStatus(VersionManagerState.Idle);

        } catch (error) {
            this.throwError(VersionManagerErrorCode.InstallFailed);
        }
    }
    //FIXME: same as startProductVersionInstall
    async startProductVersionImport(fullPath: string): Promise<void> {
        try {
            if (this.isBusy()) return;

            const directory = await unzipper.Open.file(fullPath);

            const metaOptions = await this.readExportMetaDataFile(directory);

            this.switchHandlingVersion(metaOptions);

            const finalPath = this.getCurrentVersionPath();

            this.changeStatus(VersionManagerState.Installing);

            await this.extractZip(directory, finalPath);

            this.changeStatus(VersionManagerState.Idle);

        } catch (error) {
            this.throwError(VersionManagerErrorCode.ImportFailed);
        }
    }
    private async extractZip(directory: unzipper.CentralDirectory, destination: string, interval = 1000): Promise<void> {
        let totalBytes = 0;

        directory.files.forEach((file) => {
            totalBytes += file.uncompressedSize || 0;
        });

        let extractedBytes = 0;

        let lastUpdate = Date.now();

        this.pruneDestinationFolder(destination);

        for (const file of directory.files) {
            const outputPath = `${destination}/${file.path}`;
            if (file.type == 'File') {
                await new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(outputPath);
                    const readStream = file.stream();

                    readStream.on('data', (chunk) => {
                        const now = Date.now();

                        extractedBytes += chunk.length;

                        if (now - lastUpdate >= interval) {
                            const progress = Math.round((extractedBytes / totalBytes) * 1000) / 10;
                            lastUpdate = now;
                            this.emit(VersionManagerEvent.UnpackingProgress, progress);
                        }
                    });

                    writeStream.on('finish', () => resolve(true));
                    writeStream.on('error', reject);

                    readStream.pipe(writeStream);
                });
            } else {
                fs.mkdirSync(outputPath, { recursive: true });
            }
        }
        this.emit(VersionManagerEvent.UnpackingProgress, 100);
    }
    async startProductVersionUninstall(options: ProductDetails): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                if (this.isBusy()) return;

                this.switchHandlingVersion(options);

                this.changeStatus(VersionManagerState.Uninstalling);

                this.removeTempFile(options.fullVersion);

                const finalPath = this.getCurrentVersionPath();
                //FIXME:
                if (fs.existsSync(finalPath)) {
                    fs.rm(finalPath, { recursive: true }, (err) => {
                        if (err) {
                            reject(err);
                            return
                        }
                        this.changeStatus(VersionManagerState.Idle);
                        resolve();
                    });
                } else {
                    this.throwError(VersionManagerErrorCode.UninstallFailed);
                }
            })
        } catch (error) {
            this.throwError(VersionManagerErrorCode.UninstallFailed);
        }
    }
    async startProductVersionExport(options: ProductDetails, fullPath: string): Promise<void> {
        try {
            if (this.isBusy()) return;

            this.switchHandlingVersion(options);

            this.changeStatus(VersionManagerState.Packing);

            const folderPath = this.getCurrentVersionPath();

            const fileFullPath = path.join(fullPath, `${options.fullVersion}.zip`);

            return new Promise((resolve, reject) => {
                const output = fs.createWriteStream(fileFullPath);
                const archive = archiver('zip', { zlib: { level: 9 } });

                const totalSize = this.getFolderSize(folderPath);

                output.on('close', () => {
                    this.changeStatus(VersionManagerState.Idle);
                    resolve();
                });

                archive.on('error', reject);
                archive.pipe(output);

                archive.on('progress', (progress) => {
                    const percent = Math.round((progress.fs.processedBytes / totalSize) * 1000) / 10;
                    this.emit(VersionManagerEvent.UnpackingProgress, percent);
                });

                archive.directory(folderPath, false);

                const metaFile = this.createExportMetaDataFile(options);

                archive.append(metaFile.fileStream, { name: metaFile.fileName });

                archive.finalize();
            });

        } catch (error) {
            this.throwError(VersionManagerErrorCode.ExportFailed);
        }
    }

    private async removeTempFile(fullVersion: string): Promise<void> {
        const tempFilePath = this.getVersionTempPath(fullVersion);

        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
    private pruneDestinationFolder(destination: string): void {
        if (fs.existsSync(destination)) {
            fs.rmSync(destination, { recursive: true, force: true });
        }
        fs.mkdirSync(destination, { recursive: true });
    }
    pauseDownload(): void {
        if (this.currentHandlingVersion.controller) {
            this.currentHandlingVersion.controller.abort();
            this.changeStatus(VersionManagerState.Paused);
        }
    }

    async resumeDownload(options: ProductDetails): Promise<void> {
        await this.startProductVersionDownload(options);
    }
    //TODO: consider using a readExportMetaDataFile
    async getInstalledProducts(): Promise<ProductDetails[]> {
        const productNames = fs.readdirSync(this.basePath)

        return productNames.map((productName) => {
            const versions = fs.readdirSync(path.join(this.basePath, productName));

            if (versions.length > 0) {
                return { productName, fullVersion: versions[0] } // Return the first version found, should be one
            }
        })
            .filter(Boolean)
    }
    resetDownload(options: ProductDetails): void {
        if (this.currentHandlingVersion.controller) {
            this.currentHandlingVersion.controller.abort();
        }
        this.switchHandlingVersion(options);

        this.removeTempFile(options.fullVersion);

        this.changeStatus(VersionManagerState.Idle, true);

        this.currentHandlingVersion = {} as any
    }
    async launchProductVersion(options: ProductDetails): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                if (this.isBusy()) return;

                this.switchHandlingVersion(options);

                const executablePath = this.getExecutablePath(options);

                child.execFile(executablePath, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            })
        } catch (error) {
            this.throwError(VersionManagerErrorCode.LaunchFailed);
        }
    }
    //FIXME:
    private getExecutablePath(options: ProductDetails): string {
        let productPath = path.join(this.basePath, options.productName, options.fullVersion);

        const mainDirectoryFiles = fs.readdirSync(productPath);

        if (mainDirectoryFiles.length !== 1) {
            this.throwError(VersionManagerErrorCode.LaunchFailed);
        }

        productPath = path.join(productPath, mainDirectoryFiles[0]);

        const files = fs.readdirSync(productPath);

        const os = process.platform;

        const executableName = mainDirectoryFiles[0] + (os == 'win32' ? '.exe' : '.sh');


        if (!files.includes(executableName)) {
            this.throwError(VersionManagerErrorCode.LaunchFailed);
        }

        return path.join(productPath, executableName);
    }
    private getFolderSize(folderPath: string) {
        let totalSize = 0;

        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                totalSize += this.getFolderSize(filePath);
            } else {
                totalSize += stats.size;
            }
        }

        return totalSize;
    }
    // VERSIONING
    private readonly metaFileName = 'meta.json';

    private createExportMetaDataFile(options: ProductDetails) {
        const content = JSON.stringify(options, null, 2);
        const fileName = this.metaFileName;

        const fileStream = Buffer.from(content);

        return {
            fileName,
            fileStream
        }
    }
    private async readExportMetaDataFile(directory: unzipper.CentralDirectory): Promise<ProductDetails> {
        const fileName = this.metaFileName;
        const fileEntry = directory.files.find((file) => file.path == fileName);

        if (!fileEntry) {
            throw new Error(`'Incorrect export archive. Missing meta file.'`);
        }

        const content = await fileEntry.buffer();

        const decodedContent = content.toString('utf-8');

        return JSON.parse(decodedContent) as ProductDetails;
    }
    // PATHING
    private getCurrentVersionTempPath() {
        return this.getVersionTempPath(this.currentHandlingVersion.fullVersion);
    }
    private getVersionTempPath(fullVersion: string) {
        return path.join(this.tempPath, fullVersion + '.temp')
    }
    private getCurrentVersionPath() {
        return path.join(this.basePath, this.currentHandlingVersion.productName, this.currentHandlingVersion.fullVersion);
    }

    // ERRORS 
    private throwError(error: VersionManagerErrorCode) {
        this.changeStatus(VersionManagerState.Errored);
        throw error;
    }
}

export default VersionManager;