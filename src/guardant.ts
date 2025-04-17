import koffi from 'koffi';
import path from 'path';
import { ApiVersionInfo, Feature, GuardantStatus, LicenseEntry, LicenseEntryMinified, LicenseInfoResult, Product, VendorCodes } from './guardant.types';
declare global {
    interface GuardantExposedMethods {
        getExistingLicenses(): LicenseEntryMinified[];
        checkSerialNumberFormat(serial: string): { status: GuardantStatus };
        activateLicense(serial: string): { status: GuardantStatus, licenseId: number | null };
    }
}

export class Guardant implements GuardantExposedMethods {

    private grdlicCore: GuardantCore = null;

    constructor(path: string) {
        this.grdlicCore = new GuardantCore(path);
    }


    public get core(): GuardantCore {
        return this.grdlicCore;
    }


    getExistingLicenses(): LicenseEntryMinified[] {
        const licenseInfo = this.grdlicCore.getLicenseInfo('{"dongleModel":  0, "remoteMode": 3}');
        
        return licenseInfo.licenseJson?.licenses.reduce((acc: LicenseEntryMinified[], license: LicenseEntry) => {
            license.licenseInfo.products.forEach((product: Product) => {
                product.features.forEach((feature: Feature) => {
                    acc.push({
                        isBroken: license.isBroken === 1,
                        productNumber: product.number,
                        featureNumber: feature.number,
                        currentRunCounterValue: feature.currentRunCounterValue,
                        validFromDate: feature.validFromDate,
                        validUpToDate: feature.validUpToDate,
                        licenseId: license.licenseInfo.licenseId,
                        restOfLifeTime: feature.restOfLifeTime,
                    });
                });
            })
            return acc;
        }, []) || []
    }
    checkSerialNumberFormat(serial: string): { status: GuardantStatus } {
        const result = this.grdlicCore.checkSerialNumberFormat(serial);
        return result;
    }
    activateLicense(serial: string): { status: GuardantStatus; licenseId: number | null; } {
        const response = this.grdlicCore.licenseActivate(serial);
        return response;
    }
}



class GuardantCore {
    private grdlic: koffi.IKoffiLib = null;

    // Function references
    private GrdGetApiVersion!: koffi.KoffiFunc<(major: [number], minor: [number]) => number>;
    private GrdGetLicenseInfo!: koffi.KoffiFunc<(visibility: string, vendorCodes: VendorCodes, result: [string]) => number>;
    // private GrdGetSessionInfo!: koffi.KoffiFunction;
    // private GrdGetHostInfo!: koffi.KoffiFunction;
    // private GrdVerifyDigest!: koffi.KoffiFunction;
    private GrdLicenseCheckSerialNumberFormat!: koffi.KoffiFunction;
    // private GrdLedBlink!: koffi.KoffiFunction;
    private GrdGetErrorMessage!: koffi.KoffiFunction;
    // private GrdFree!: koffi.KoffiFunction;

    // License activation
    private GrdLicenseActivate!: koffi.KoffiFunction;
    // private GrdLicenseUpdate!: koffi.KoffiFunction;
    // private GrdLicenseCheckUpdateIsAvailable!: koffi.KoffiFunction;
    // private GrdLicenseCheckIsNotBanned!: koffi.KoffiFunction;
    private GrdLicenseRemove!: koffi.KoffiFunction;
    // private GrdLicenseCreateActivationRequest!: koffi.KoffiFunction;
    // private GrdLicenseSendActivationRequest!: koffi.KoffiFunction;
    // private GrdLicenseCreateUpdateRequest!: koffi.KoffiFunction;
    // private GrdLicenseSendUpdateRequest!: koffi.KoffiFunction;
    // private GrdLicenseInstall!: koffi.KoffiFunction;

    // Feature functions
    // private GrdFeatureLogin!: koffi.KoffiFunction;
    // private GrdFeatureLogout!: koffi.KoffiFunction;
    // private GrdFeatureGetInfo!: koffi.KoffiFunction;
    // private GrdFeatureCheck!: koffi.KoffiFunction;
    // private GrdFeatureEncrypt!: koffi.KoffiFunction;
    // private GrdFeatureDecrypt!: koffi.KoffiFunction;
    // private GrdFeatureSign!: koffi.KoffiFunction;
    // private GrdFeatureGetTimeLimit!: koffi.KoffiFunction;
    // private GrdFeatureGetRunCounter!: koffi.KoffiFunction;
    // private GrdGetRealTime!: koffi.KoffiFunction;
    // private GrdFeatureGetMaxConcurrentResource!: koffi.KoffiFunction;

    constructor(path: string) {
        this.grdlic = GuardantLoader.load(path);
        this.registerFunctions();
    }

    private registerFunctions(): void {
        // const uint32Ptr = koffi.pointer('uint32');
        // const voidPtr = koffi.pointer('void');
        // const stringPtr = koffi.pointer('string');
        const customerInfo = koffi.struct('CustomerInfo', { FirstName: 'string', LastName: 'string', Email: 'string', CompanyName: 'string', Phone: 'string' })
        const _outUint32Ptr = koffi.out(koffi.pointer('uint32'))
        const _outStringPtr = koffi.out(koffi.pointer('string'));
        const vendorCodesPtr = koffi.struct('VendorCodes', { PublicCode: 'uint32', PrivateReadCode: 'uint32', PrivateWriteCode: 'uint32' });

        // Register native Guardant functions
        this.GrdGetApiVersion = this.grdlic.func('GrdGetApiVersion', 'uint32', [_outUint32Ptr, _outUint32Ptr]);
        this.GrdGetLicenseInfo = this.grdlic.func('GrdGetLicenseInfo', 'uint32', ['string', vendorCodesPtr, _outStringPtr]);
        //FIXME:  does not exist in grdlic.dll! 
        // this.GrdGetSessionInfo = this.grdlic.func('GrdGetSessionInfo','uint32', ['string', vendorCodesPtr, stringPtr]);
        //FIXME:  does not exist in grdlic.dll! 
        // this.GrdGetHostInfo = this.grdlic.func('GrdGetHostInfo','uint32', ['string', stringPtr]);
        // this.GrdVerifyDigest = this.grdlic.func('GrdVerifyDigest', 'uint32', ['uint32', 'string', 'uint32', 'string', 'uint32', 'string']);
        this.GrdLicenseCheckSerialNumberFormat = this.grdlic.func('GrdLicenseCheckSerialNumberFormat', 'uint32', ['string']);
        // this.GrdLedBlink = this.grdlic.func('GrdLedBlink', 'uint32', ['uint32']);
        // this.GrdGetErrorMessage = this.grdlic.func('GrdGetErrorMessage', 'uint32', ['uint32', 'uint32', stringPtr, 'uint32']);
        // this.GrdFree = this.grdlic.func('GrdFree', 'void', [voidPtr]);

        // License activation
        // serialNumberBytes = c_char_p(serialNumber.encode('utf-8'))
        // hostBytes = c_char_p(self.host.encode('utf-8'))
        // licenseId = grd_uint32()
        // status = Status(grd_uint32(grdlic.GrdLicenseActivate(serialNumberBytes, hostBytes, grd_uint32(self.port), c_char_p(bytes(customerInfo)), byref(licenseId))).value)
        // return [status, licenseId.value]
        this.GrdLicenseActivate = this.grdlic.func('GrdLicenseActivate', 'uint32', ['string', 'string', 'uint32', customerInfo, _outUint32Ptr]);
        // this.GrdLicenseUpdate = this.grdlic.func('GrdLicenseUpdate', 'uint32', ['uint32', 'string', 'uint32']);
        // this.GrdLicenseCheckUpdateIsAvailable = this.grdlic.func('GrdLicenseCheckUpdateIsAvailable', 'uint32', ['uint32', 'string', 'uint32']);
        // this.GrdLicenseCheckIsNotBanned = this.grdlic.func('GrdLicenseCheckIsNotBanned', 'uint32', ['uint32', 'string', 'uint32']);
        this.GrdLicenseRemove = this.grdlic.func('GrdLicenseRemove', 'uint32', ['uint32']);
        // this.GrdLicenseCreateActivationRequest = this.grdlic.func('GrdLicenseCreateActivationRequest', 'uint32', [stringPtr, stringPtr]);
        // this.GrdLicenseSendActivationRequest = this.grdlic.func('GrdLicenseSendActivationRequest', 'uint32', ['string', 'string', stringPtr, 'uint32', 'string', 'uint32', stringPtr, stringPtr]);
        // this.GrdLicenseCreateUpdateRequest = this.grdlic.func('GrdLicenseCreateUpdateRequest', 'uint32', ['uint32', stringPtr, stringPtr]);
        // this.GrdLicenseSendUpdateRequest = this.grdlic.func('GrdLicenseSendUpdateRequest', 'uint32', [stringPtr, 'uint32', 'string', 'uint32', stringPtr, stringPtr]);
        // this.GrdLicenseInstall = this.grdlic.func('GrdLicenseInstall', 'uint32', [stringPtr, 'uint32']);

        // // Feature functions
        // this.GrdFeatureLogin = this.grdlic.func('GrdFeatureLogin', 'uint32', ['uint32', stringPtr, 'string', stringPtr]);
        // this.GrdFeatureLogout = this.grdlic.func('GrdFeatureLogout', 'uint32', ['uint32']);
        // this.GrdFeatureGetInfo = this.grdlic.func('GrdFeatureGetInfo', 'uint32', ['uint32', stringPtr]);
        // this.GrdFeatureCheck = this.grdlic.func('GrdFeatureCheck', 'uint32', ['uint32', 'uint32', stringPtr]);
        // this.GrdFeatureEncrypt = this.grdlic.func('GrdFeatureEncrypt', 'uint32', ['uint32', 'uint32', stringPtr, 'uint32', stringPtr, 'uint32']);
        // this.GrdFeatureDecrypt = this.grdlic.func('GrdFeatureDecrypt', 'uint32', ['uint32', 'uint32', stringPtr, 'uint32', stringPtr, 'uint32']);
        // this.GrdFeatureSign = this.grdlic.func('GrdFeatureSign', 'uint32', ['uint32', 'uint32', stringPtr, 'uint32', stringPtr]);
        // this.GrdFeatureGetTimeLimit = this.grdlic.func('GrdFeatureGetTimeLimit', 'uint32', ['uint32', stringPtr]);
        // this.GrdFeatureGetRunCounter = this.grdlic.func('GrdFeatureGetRunCounter', 'uint32', ['uint32', stringPtr]);
        // this.GrdGetRealTime = this.grdlic.func('GrdGetRealTime', 'uint32', ['uint32', stringPtr]);
        // this.GrdFeatureGetMaxConcurrentResource = this.grdlic.func('GrdFeatureGetMaxConcurrentResource', 'uint32', ['uint32', stringPtr]);

    }


    /**
     * Get API version information from Guardant library.
     * example: version 2.3 -> major == 2, minor == 3, coded == 0x00020003
     */
    public getApiVersion(): ApiVersionInfo {
        const major: [number] = [0];
        const minor: [number] = [0];

        const coded = this.GrdGetApiVersion(major, minor);

        return {
            major: major[0],
            minor: minor[0],
            coded
        };
    }
    /**
     * Get license information as JSON string.
     * TODO: visibility typing? "{\"dongleModel\":  0, \"remoteMode\": 3}"
     * TODO: koffi vendorCodes struct not tested, prob not working
     */
    public getLicenseInfo(visibility: string, vendorCodes?: VendorCodes): LicenseInfoResult {
        const resultPtr: [string] = [''];
        const codes = vendorCodes || {} as VendorCodes
        const status = this.GrdGetLicenseInfo(visibility, codes, resultPtr);

        return {
            status,
            licenseJson: JSON.parse(resultPtr[0])
        };
    }

    /**
     * Verifies ECC160 digital signature.
     * @param publicKey - Raw 40-byte public key (ECC160).
     * @param message - Message buffer.
     * @param digest - Digest/signature buffer (20 bytes).
     * @returns Status code from GuardantStatus.
     */
    // public verifyDigest(publicKey: Uint8Array, message: Uint8Array, digest: Uint8Array): GuardantStatus {
    //     if (publicKey.length !== 40) {
    //         throw new Error('Invalid public key size: must be 40 bytes');
    //     }
    //     if (digest.length !== 20) {
    //         throw new Error('Invalid digest size: must be 20 bytes');
    //     }

    //     const status = this.GrdVerifyDigest(
    //         publicKey.length, publicKey,
    //         message.length, message,
    //         digest.length, digest
    //     );

    //     return status;
    // }
    /**
     * Check serial number format.
     * @param serialNumber - Serial number string.
     * @returns Status code from GuardantStatus.
     */
    public checkSerialNumberFormat(serialNumber: string): { status: GuardantStatus } {
        const status = this.GrdLicenseCheckSerialNumberFormat(serialNumber);
        return { status };
    }
    /**
     * Check if the dongle is blinking.
     * @param dongleId - Dongle ID.
     * @returns Status code from GuardantStatus.
     */
    // public ledBlink(dongleId: number): GuardantStatus {
    //     return this.GrdLedBlink(dongleId);
    // }
    /**
     * Get error message from Guardant library.
     * @param status - Status code from GuardantStatus.
     * @param lang - Language ID (0 for English, 1 for Russian).
     * @returns Error message string or null if the status is not OK.
     */
    // public getErrorMessage(status: number, lang = 0): string | null {
    //     const buffer = Buffer.alloc(512);
    //     const result = this.GrdGetErrorMessage(status, lang, buffer, buffer.length);
    //     return result === GuardantStatus.OK ? buffer.toString('utf8').replace(/\0.*$/, '') : null;
    // }
    /**
     * Free allocated memory for a buffer.
     * @param ptr - Pointer to the buffer to be freed.
     */
    // public free(ptr: Buffer): void {
    //     this.GrdFree(ptr);
    // }
    /**
     * Activate a license with the given serial number and customer information.
     * @param serial - Serial number string.
     * @returns Status code from GuardantStatus and the license ID if successful.
     */
    public licenseActivate(serial: string): { status: GuardantStatus, licenseId: number | null } {
        const resultPtr = [0];
        const customerInfo = {
            FirstName: 'John',
            LastName: 'Doe',
            Email: 'ba@go.ru',
            CompanyName: 'Example Corp',
            Phone: '123'
        }

        const status = this.GrdLicenseActivate(serial, "getlicense.guardant.ru", 443, customerInfo, resultPtr);
        
        return { status, licenseId: resultPtr[0] >> 0 };
    }

    public licenseRemove(licenseId: number): GuardantStatus {
        return this.GrdLicenseRemove(licenseId);
    }

    // public licenseCheckUpdateAvailable(licenseId: number, visibility: string): GuardantStatus {
    //     return this.GrdLicenseCheckUpdateIsAvailable(licenseId, visibility, visibility.length);
    // }

    // public licenseCheckIsNotBanned(licenseId: number, visibility: string): GuardantStatus {
    //     return this.GrdLicenseCheckIsNotBanned(licenseId, visibility, visibility.length);
    // }
    // public licenseCreateActivationRequest(): { status: GuardantStatus, outRequest: string | null } {
    //     const outRequestPtr = [''];
    //     const outErrorPtr = [''];
    //     const status = this.GrdLicenseCreateActivationRequest(outRequestPtr, outErrorPtr);
    //     return {
    //         status,
    //         outRequest: status === GuardantStatus.OK ? outRequestPtr[0] : null
    //     };
    // }

    // public licenseSendActivationRequest(
    //     host: string,
    //     port: string,
    //     request: Uint8Array,
    //     visibility: string
    // ): { status: GuardantStatus, response: string | null, error: string | null } {
    //     const responsePtr = [''];
    //     const errorPtr = [''];
    //     const status = this.GrdLicenseSendActivationRequest(
    //         host, port,
    //         request, request.length,
    //         visibility, visibility.length,
    //         responsePtr, errorPtr
    //     );
    //     return {
    //         status,
    //         response: responsePtr[0] || null,
    //         error: errorPtr[0] || null
    //     };
    // }

    // public licenseCreateUpdateRequest(licenseId: number): { status: GuardantStatus, outRequest: string | null } {
    //     const requestPtr = [''];
    //     const errorPtr = [''];
    //     const status = this.GrdLicenseCreateUpdateRequest(licenseId, requestPtr, errorPtr);
    //     return {
    //         status,
    //         outRequest: status === GuardantStatus.OK ? requestPtr[0] : null
    //     };
    // }

    // public licenseSendUpdateRequest(request: Uint8Array, visibility: string): { status: GuardantStatus, response: string | null, error: string | null } {
    //     const responsePtr = [''];
    //     const errorPtr = [''];
    //     const status = this.GrdLicenseSendUpdateRequest(
    //         request, request.length,
    //         visibility, visibility.length,
    //         responsePtr, errorPtr
    //     );
    //     return {
    //         status,
    //         response: responsePtr[0] || null,
    //         error: errorPtr[0] || null
    //     };
    // }

    // public licenseInstall(licenseData: Uint8Array): GuardantStatus {
    //     return this.GrdLicenseInstall(licenseData, licenseData.length);
    // }

    // public featureLogin(licenseId: number, featureInfo: string): { status: GuardantStatus, sessionToken: string | null } {
    //     const sessionPtr = [''];
    //     const status = this.GrdFeatureLogin(licenseId, sessionPtr, featureInfo, sessionPtr);
    //     return {
    //         status,
    //         sessionToken: sessionPtr[0] || null
    //     };
    // }

    // public featureLogout(sessionHandle: number): GuardantStatus {
    //     return this.GrdFeatureLogout(sessionHandle);
    // }

    // public featureGetInfo(sessionHandle: number): { status: GuardantStatus, info: string | null } {
    //     const infoPtr = [''];
    //     const status = this.GrdFeatureGetInfo(sessionHandle, infoPtr);
    //     return {
    //         status,
    //         info: infoPtr[0] || null
    //     };
    // }

    // public featureCheck(sessionHandle: number, featureNumber: number): { status: GuardantStatus, info: string | null } {
    //     const infoPtr = [''];
    //     const status = this.GrdFeatureCheck(sessionHandle, featureNumber, infoPtr);
    //     return {
    //         status,
    //         info: infoPtr[0] || null
    //     };
    // }

    // public featureEncrypt(sessionHandle: number, mode: number, input: Uint8Array, output: Uint8Array): GuardantStatus {
    //     return this.GrdFeatureEncrypt(sessionHandle, mode, input, input.length, output, output.length);
    // }

    // public featureDecrypt(sessionHandle: number, mode: number, input: Uint8Array, output: Uint8Array): GuardantStatus {
    //     return this.GrdFeatureDecrypt(sessionHandle, mode, input, input.length, output, output.length);
    // }

    // public featureSign(sessionHandle: number, mode: number, data: Uint8Array, out: Uint8Array): GuardantStatus {
    //     return this.GrdFeatureSign(sessionHandle, mode, data, data.length, out);
    // }

    // public featureGetTimeLimit(sessionHandle: number): { status: GuardantStatus, info: string | null } {
    //     const ptr = [''];
    //     const status = this.GrdFeatureGetTimeLimit(sessionHandle, ptr);
    //     return {
    //         status,
    //         info: ptr[0] || null
    //     };
    // }

    // public featureGetRunCounter(sessionHandle: number): { status: GuardantStatus, info: string | null } {
    //     const ptr = [''];
    //     const status = this.GrdFeatureGetRunCounter(sessionHandle, ptr);
    //     return {
    //         status,
    //         info: ptr[0] || null
    //     };
    // }

    // public featureGetMaxConcurrentResource(sessionHandle: number): { status: GuardantStatus, value: string | null } {
    //     const ptr = [''];
    //     const status = this.GrdFeatureGetMaxConcurrentResource(sessionHandle, ptr);
    //     return {
    //         status,
    //         value: ptr[0] || null
    //     };
    // }

}

class GuardantLoader {

    private static getLibraryName(): string {
        switch (process.platform) {
            case 'win32': return 'grdlic.dll';
            case 'linux': return 'libgrdlic.so';
            case 'darwin': return 'grdlic.dylib';
            default: throw new Error('Unsupported platform');
        }
    }

    static load(folderPath: string): koffi.IKoffiLib {
        try {
            const libraryPath = path.join(folderPath, this.getLibraryName());
            return koffi.load(libraryPath);
        } catch (error) {
            console.debug('Failed to load library from specified path:', error);
            throw error;
        }
    }
}
