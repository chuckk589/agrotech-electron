import archiver from 'archiver';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import child from 'child_process';
import { default as fs } from 'fs';
import { throttle } from 'lodash';
import path from 'path';
import unzipper from 'unzipper';
import { ProductDetails, VersionManagerState, VersionManagerStats, VersionState, VersionStats } from '../types';

class VersionManager {
    /**
     * @param basePath The base path where the versions are stored
     * @param tempPath The path where the temporary files are stored
     * @param state The current state of the version manager
     */
    private readonly basePath: string;
    private readonly tempPath: string;
    private state: VersionManagerState = VersionManagerState.Idle;

    private currentHandlingVersion: {
        fullVersion: string;
        productName: string;
        url: string;
        controller: AbortController | null;
    }
    onStatusChange: (options: ProductDetails, status: VersionManagerState) => void;
    onDownloadProgress: (progressDetails: { bytesLeft: number, rate: number }) => void;

    constructor() {
        this.basePath = path.join(__dirname, 'products');
        this.tempPath = path.join(__dirname, 'temp');
        this.currentHandlingVersion = {} as any;

        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }

        if (!fs.existsSync(this.tempPath)) {
            fs.mkdirSync(this.tempPath, { recursive: true });
        }
    }

    /**
     * used to get info about the any product version
     * @param productName e.g. 'agrotechsim228'
     * @param fullVersion e.g. 'LINUX_agrotechsim228_v1.0.0'
     * @param expectedSizeBytes e.g. 1000000
     * @returns 
     */
    getProductVersionState(options: ProductDetails, expectedSizeBytes: number): VersionStats {
        const finalPath = path.join(this.basePath, options.productName, options.fullVersion);

        //FIXME: check if downloaded and installed
        if (fs.existsSync(finalPath)) {
            return { progress: 100, state: VersionState.Installed };
        }

        const loadedSize = this.getVersionLoadedSize(options.fullVersion);

        if (expectedSizeBytes > 0) {
            if (loadedSize == expectedSizeBytes) {
                return { progress: 100, state: VersionState.Downloaded };
            } else if (loadedSize > 0) {
                return { progress: Math.round((loadedSize / expectedSizeBytes) * 100), state: VersionState.PartlyDownloaded };
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
        // const tempFilePath = path.join(this.tempPath, fullVersion + '.temp');
        const tempFilePath = this.getVersionTempPath(fullVersion);

        if (fs.existsSync(tempFilePath)) {
            const stats = fs.statSync(tempFilePath);
            return stats.size;
        }
        return 0;
    }
    private async getActualFileSize(url: string): Promise<number> {
        const response = await axios.head(url);
        return parseInt(response.headers['content-length'], 10);
    }

    private changeStatus(status: VersionManagerState) {
        if (this.state != status) {
            this.state = status;
            this.onStatusChange({ productName: this.currentHandlingVersion.productName, fullVersion: this.currentHandlingVersion.fullVersion, }, status);
        }
    }
    //FIXME:
    private async TEMP_GET_YA_LINK() {
        const response = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/download?path=disk%3A%2FAgroTechSimDesktop051.zip', {
            headers: {
                Authorization: 'OAuth y0__xCdjY0KGKqcNiDw6-fLEsfmTnKF0K5Ovb0pdp0sE2GMNXqw'
            },
        });
        return response.data.href;
    }
    private handleProgress(event: AxiosProgressEvent): void {
        if (event.lengthComputable) {
            const bytesLeft = event.total - event.loaded;
            const rate = event.rate;
            this.onDownloadProgress({ bytesLeft, rate });
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
    async startProductVersionDownload(options: ProductDetails): Promise<number> {
        try {
            if (this.isBusy()) return;

            // this.currentHandlingVersion.fullVersion = options.fullVersion || this.currentHandlingVersion.fullVersion;
            this.switchHandlingVersion(options);

            //FIXME:
            this.currentHandlingVersion.url = await this.TEMP_GET_YA_LINK();
            this.currentHandlingVersion.controller = new AbortController();

            const totalBytes = await this.getActualFileSize(this.currentHandlingVersion.url);
            const existingFileSize = this.getCurrentHandlingVersionLoadedSize();

            const headers: any = existingFileSize
                ? { Range: `bytes=${existingFileSize}-` }
                : {};

            //FIXME:
            headers['Authorization'] = 'OAuth y0__xCdjY0KGKqcNiCh8-HLErRK123PKNuEKrNPKk5A3jvj_czs';

            const throttledHandleProgress = throttle((evt: AxiosProgressEvent) => this.handleProgress(evt), 1000);

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

            return totalBytes;
        } catch (error) {
            if (this.state != VersionManagerState.Paused) {
                this.throwError(error)
            }
        }
    }
    async startProductVersionInstall(options: ProductDetails): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                if (this.isBusy()) return;

                this.switchHandlingVersion(options);

                this.changeStatus(VersionManagerState.Installing);
                // this.currentHandlingVersion.fullVersion = options.fullVersion;
                // const finalPath = path.join(this.basePath, options.productName, this.currentHandlingVersion.fullVersion);

                const zipPath = this.getCurrentVersionTempPath();

                if (!fs.existsSync(zipPath)) {
                    throw new Error(`Файл ${zipPath} не найден`);
                }

                fs
                    .createReadStream(zipPath)
                    .pipe(unzipper.Extract({ path: this.getCurrentVersionPath() }))
                    .promise()
                    .then(() => {
                        this.changeStatus(VersionManagerState.Idle);
                        resolve()
                    });
            })
        } catch (error) {
            this.throwError(error);
        }
    }
    async startProductVersionUninstall(options: ProductDetails): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                if (this.isBusy()) return;

                this.switchHandlingVersion(options);

                this.changeStatus(VersionManagerState.Uninstalling);

                this.removeTempFile(options.fullVersion);

                // const finalPath = path.join(this.basePath, productName, fullVersion);
                const finalPath = this.getCurrentVersionPath();

                if (fs.existsSync(finalPath)) {
                    fs.rm(finalPath, { recursive: true }, (err) => {
                        if (err) {
                            reject(err);
                        }
                        this.changeStatus(VersionManagerState.Idle);
                        resolve();
                    });
                }
            })
        } catch (error) {
            this.throwError(error);
        }
    }
    async startProductVersionExport(options: ProductDetails, fullPath: string): Promise<void> {
        try {
            if (this.isBusy()) return;
            // const folderPath = path.join(this.basePath, productName, fullVersion);
            this.switchHandlingVersion(options);

            this.changeStatus(VersionManagerState.Packing);

            const folderPath = this.getCurrentVersionPath();

            const fileFullPath = path.join(fullPath, `${options.fullVersion}.zip`);

            return new Promise((resolve, reject) => {
                const output = fs.createWriteStream(fileFullPath);
                const archive = archiver('zip', { zlib: { level: 9 } });

                output.on('close', () => {
                    this.changeStatus(VersionManagerState.Idle);
                    resolve();
                });

                archive.on('error', reject);
                // archive.on('progress')
                archive.pipe(output);
                archive.directory(folderPath, false);
                archive.finalize();
            });

        } catch (error) {
            this.throwError(error);
        }
    }
    async startProductVersionImport(productName: string, fullPath: string): Promise<void> {
        try {
            if (this.isBusy()) return;

            const fullVersion = path.basename(fullPath, '.zip');

            this.switchHandlingVersion({ productName, fullVersion });

            this.changeStatus(VersionManagerState.Installing);

            // const finalPath = path.join(this.basePath, productName, fillVersion);
            const finalPath = this.getCurrentVersionPath();

            await fs
                .createReadStream(fullPath)
                .pipe(unzipper.Extract({ path: finalPath }))
                .promise()
                .then(() => this.changeStatus(VersionManagerState.Idle));

        } catch (error) {
            this.throwError(error);
        }
    }
    private async removeTempFile(fullVersion: string): Promise<void> {
        const tempFilePath = this.getVersionTempPath(fullVersion);

        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
    pauseDownload(): void {
        if (this.currentHandlingVersion.controller) {
            this.currentHandlingVersion.controller.abort();
            this.changeStatus(VersionManagerState.Paused);
        }
    }

    async resumeDownload(): Promise<void> {
        await this.startProductVersionDownload({ productName: this.currentHandlingVersion.productName, fullVersion: this.currentHandlingVersion.fullVersion });
    }
    async getInstalledProducts(): Promise<string[]> {
        return fs.readdirSync(this.basePath);
    }
    resetDownload(fullVersion: string): void {
        if (this.currentHandlingVersion.controller) {
            this.currentHandlingVersion.controller.abort();
        }

        this.removeTempFile(fullVersion);

        this.changeStatus(VersionManagerState.Idle);

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
                    }
                    resolve();
                });
            })
        } catch (error) {
            this.throwError(error);
        }
    }
    //FIXME:
    private getExecutablePath(options: ProductDetails): string {
        const productPath = path.join(this.basePath, options.productName, options.fullVersion, 'AgroTechSimDesktop');

        const files = fs.readdirSync(productPath);

        const executable = files.find((file) => file.endsWith('.exe'));

        if (!executable) {
            throw new Error(`Не найден исполняемый файл в папке ${productPath}`);
        }

        return path.join(productPath, executable);
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
    private throwError(error: any) {
        this.changeStatus(VersionManagerState.Errored);
        throw new Error(error);
    }
}

export default VersionManager;