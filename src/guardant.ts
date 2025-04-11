import koffi from 'koffi';
import path from 'path';

export class Guardant {

    public readonly INVALID_LICENSE_ID_VALUE = 0xffffffff;
    public readonly INVALID_FEATURE_NUMBER_VALUE = 0xffffffff;

    private grdlicCore: GuardantCore = null;

    constructor(path = 'C:/Programs/projects/GuardatJSApi/windows/x86_64') {
        this.grdlicCore = new GuardantCore(path);
    }

    public get core(): GuardantCore {
        return this.grdlicCore;
    }
}
export enum GuardantStatus {
    OK = 0,                                          // Successful operation status
    INVALID_HANDLE = 1,                              // Invalid handle
    FEATURE_NOT_FOUND = 2,                          // Feature not found
    FEATURE_RESOURCE_EXHAUST = 3,                    // Feature network resource exhausted
    INVALID_FEATURE = 4,                            // Invalid feature data
    INVALID_SERIAL_NUMBER = 5,                      // Serial number is invalid
    INVALID_LICENSE = 6,                            // Can't read DL license file because of hardware mismatched or part of file header is corrupted
    LICENSE_NOT_ACTIVATED = 7,                      // License with this licenseId has not been activated yet or reactivation required
    LICENSE_ALREADY_ACTIVATED = 8,                  // License already activated
    GET_HARDWARE_ID_ERROR = 9,                      // Can not get hardware id
    NOT_ENOUGH_HARWARE_TO_BIND = 10,                // Insufficient number of computer components to activate
    REQUEST_FAILED = 12,                            // Unable to send request
    GET_RESPONSE_FAILED = 13,                       // Unable to receive response
    SERVER_NOT_FOUND = 14,                          // Unable to find server
    INCORRECT_RESPONSE_DATA = 15,                   // Incorrect response format or data not valid
    FILE_CREATION_ERROR = 16,                       // Error during creation of file (e.g. license file)
    SERIAL_NUMBER_RESOURCE_EXHAUSTED = 17,          // Serial number resource exhausted
    NO_UPDATES_AVAILABLE = 18,                      // No updates available for license
    ACTIVATION_NOT_AVAILABLE = 19,                  // Activation not enabled by software vendor reasons
    NO_CUSTOMER_SPECIFIED = 20,                     // No customer info specified
    CAN_NOT_ACTIVATE_NON_DEMO_LICENSE = 21,         // Can't activate non demo license
    OUTDATED_API_VERSION = 22,                      // API version too low
    INVALID_PARAMETER = 23,                         // Invalid function argument
    BUFFER_TOO_SMALL = 24,                          // Buffer is not enough to perform operation
    INTERNAL_ERROR = 25,                            // Internal error
    LICENSE_IS_BANNED = 26,                         // Software vendor has banned serial number and license
    NO_LICENSE_AVAILABLE = 27,                      // No license available (e.g. order access time is over)
    FEATURE_RUNCOUNTER_EXHAUST = 28,                // Feature execution counter is exhausted
    FEATURE_EXPIRED = 29,                           // Feature life time is expired
    INVALID_PUBLIC_KEY = 30,                        // Invalid public key
    NO_SERVICE = 31,                                // Service is not supported
    UNABLE_SEND_REQUEST_TO_ADMIN_RUNTIME = 32,      // Admin runtime is not installed or outdated
    DONGLE_NOT_FOUND = 33,                          // Guardant dongle not found
    NO_RESULTS_FOUND = 34,                          // No any results found
    INVALID_DIGEST = 35,                            // Invalid message or digest
    FEATURE_INACTIVE = 36,                          // The period of using feature has not yet arrived or the feature is not active
    MEMORY_OUT_OF_RANGE = 37,                       // Access to memory beyond its range
    ACCESS_DENIED = 38,                             // Access denied
    NUMBER_ATTEMPTS_EXHAUSTED = 39,                 // The number of password attempts has been exhausted
    SERIAL_NUMBER_NOT_FOUND = 40,                   // Such serial number not found on server
    GRD_INVALID_MEMORY = 41,                        // Invalid memory ID specified or item does not exist
    VIRTUAL_ENVIRONMENT_DETECTED = 42,              // Running in virtual environment detected
    REMOTE_DESKTOP_DETECTED = 43,                   // Detected running in remote desktop mode
    OUTDATED_GCC_VERSION = 44,                      // Outdated Gurdant Control Center version
    REHOST_IS_NOT_ALLOWED = 45,                     // Rehost is not allowed
    STORAGE_CORRUPTED = 46,                         // DL storage corrupted
    STORAGE_ID_MISMATCH = 47,                       // DL storage ID mismatch (input is not intended for current storage)
    INVALID_UPDATE_OR_ALREADY_INSTALLED = 48,       // Invalid update for DL received or update has been installed before
    INVALID_REHOST_DATA = 49,                       // Invalid rehost date sent to server
    HARDWARE_ID_MISMATCH = 50,                      // Hardware id mismatch
    REACTIVATION_IS_NOT_ALLOWED = 51,              // Reactivation is not allowed because of license contains write memory or features with counter
    RECIPIENT_HAS_THE_SAME_LICENSE = 52,           // Recipient has the same license activated as the license trying to rehost to it
    CAN_NOT_DETACH_SOME_FEATURES = 53,              // Detach failed for some of chosen features
    CANCEL_PREVIOUS_DETACH_REQUIRED = 54,           // Required cancel previous detach before making new one
    DETACHED_LICENSE_EXPIRED = 55,                  // Detached license already exprired
    DETACHED_LICENSE_NOT_FOUND = 56,                // Detached license not found
    DETACH_FORBIDDEN_BY_GCC = 57,                   // Detach forbidden by Gurdant Control Center
    TRIAL_LICENSE_EXPIRED = 58,                     // Trial license expired
    ORERATION_IS_NOT_ALLOWED = 59,                  // Operation is not allowed
    RTC_ERROR = 60,                                 // Timer error
    FUNCTION_NOT_FOUND = 0x70000000,                // Function not found
    DLL_NOT_FOUND = 0x70000001,                     // DLL not found
    MANAGE_ERROR = 0x70000002                       // Unknown error
}
export interface ApiVersionInfo {
    major: number;
    minor: number;
    result: GuardantStatus;
}

export interface LicenseInfoResult {
    status: number;
    licenseJson: string | null;
}

export interface VendorCodes {
    PublicCode: number;
    PrivateReadCode: number;
    PrivateWriteCode: number;
}

class GuardantCore {
    private grdlic: koffi.IKoffiLib = null;

    // Function references
    private GrdGetApiVersion!: koffi.KoffiFunction;
    private GrdGetLicenseInfo!: koffi.KoffiFunction;

    constructor(path: string) {
        this.grdlic = GuardantLoader.load(path);
        this.registerFunctions();
    }

    private registerFunctions(): void {
        const uint32Ptr = koffi.pointer('uint32');
        const voidPtr = koffi.pointer('void');
        const stringPtr = koffi.pointer('string');
        const vendorCodesPtr = koffi.struct('VendorCodes', { PublicCode: 'uint32', PrivateReadCode: 'uint32', PrivateWriteCode: 'uint32' });

        // Register native Guardant functions
        this.GrdGetApiVersion = this.grdlic.func('GrdGetApiVersion', 'uint32', [uint32Ptr, uint32Ptr]);
        this.GrdGetLicenseInfo = this.grdlic.func('GrdGetLicenseInfo', 'uint32', ['string', vendorCodesPtr, stringPtr]);
    }

    /**
     * Get API version information from Guardant library.
     */
    public getApiVersion(): ApiVersionInfo {
        const major = [0];
        const minor = [0];
        const result = this.GrdGetApiVersion(major, minor);
        return {
            major: major[0],
            minor: minor[0],
            result
        };
    }

    /**
     * Get license information as JSON string.
     * TODO: visibility typing? "{\"dongleModel\":  0, \"remoteMode\": 3}"
     */
    public getLicenseInfo(visibilityJson: string, vendorCodes?: VendorCodes): LicenseInfoResult {
        const resultPtr = [''];

        const status = this.GrdGetLicenseInfo(visibilityJson, vendorCodes || {}, resultPtr);

        let licenseJson: string | null = null;

        if (status == GuardantStatus.OK && resultPtr[0]) {
            licenseJson = resultPtr[0];
        }

        return {
            status,
            licenseJson
        };
    }
  
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
