export interface VisibilityOptions {
  /**
   * Perform feature search only inside of specified license.
   * By default, the feature search is performed in all licenses.
   */
  licenseId?: number;

  /**
   * Restriction for feature search area specified by GrdRemoteMode.
   * By default, the mixed mode is set (usually 3).
   */
  remoteMode?: number;

  /**
   * The mask for specifying the dongle models to which feature can be bound.
   * 0 means all models. See GrdDongleModel enumeration.
   * By default, the search is performed in all dongle models.
   */
  dongleModel?: number;

  /**
   * The number of the product to which feature is bound (0 means all products).
   * By default, the feature search is performed in all products.
   */
  productNumber?: number;

  /**
   * Number of network resources to consume.
   * By default, 1.
   */
  networkResourceToConsume?: number;

  /**
   * Name of the user currently logged into the computer that opened the session.
   * By default, the name of the logged-in user is used.
   */
  userName?: string;

  /**
   * Configuration for Guardant Control Center.
   */
  controlCenter?: {
    /**
     * Hostname or IP address of the computer on which Guardant Control Center is running.
     */
    hostName?: string[];

    /**
     * Broadcast search for remote licenses.
     * Enabled by default.
     */
    broadcastSearch?: boolean;

    /**
     * Timeout value (in seconds) for a connection attempt before the function terminates and generates an error.
     */
    connectionTimeout?: number;
  };
}

export interface LicenseFlags {
  bindHardware: boolean;
  bindOs: boolean;
  isDemoLicense: boolean;
  isRehostAllowed: boolean;
  isDetachable: boolean;
  isDetachAllowed: boolean;
  isDetached: boolean;
  isTrial: boolean;
  isTrialLicenseExpired: boolean;
  timerError: boolean;
  lowBattery: boolean;
  isVtcSupported: boolean;
  externalMicroSd: boolean;
  driverless: boolean;
  expired: boolean;
  inaccessible: boolean;
  remote: boolean;
  isVtcEnabled: boolean;
}

export interface FeatureFlags {
  expired: boolean;
  vmForbidden: boolean;
  vtcForbidden: boolean;
  rdpForbidden: boolean;
  isDetachable: boolean;
  isDetachAllowed: boolean;
}

export interface Feature {
  number: number;
  flags: number;
  remoteMode: number;
  consumptionMode: number;
  validFromDate: number;
  validUpToDate: number;
  restOfLifeTime: number;
  maxRunCounter: number;
  maxConcurrentResource: number;
  floatingResource: number;
  reservedResource: number;
  detachedResource: number;
  sessionsCount: number;
  currentRunCounterValue: number;
  name: string;
  licenseType: number;
  flagsAsFields: FeatureFlags;
}

export interface Product {
  number: number;
  modification: number;
  flags: number;
  featuresCount: number;
  name: string;
  features: Feature[];
}

export interface LicenseInfo {
  currentUpdate: number;
  flags: number;
  freeMemory: number;
  licenseId: number;
  vendorPublicCode: number;
  productsCount: number;
  vendorCompanyName: string;
  customerFirstName: string;
  customerLastName: string;
  products: Product[];
}

export interface DongleInfo {
  dongleId: number;
  netResource: number;
  detachedFromDongleId: number;
  containerVersion: number;
  containerActivationTime: number;
  containerDeathTime: number;
  detachDeathTime: number;
  dongleModel: number;
  typeFlags: number;
  publicCode: number;
  driverType: number;
  dongleMemorySize: number;
  firmwareState: number;
  firmwareVersion: number;
  firmwareFeatures: number;
  hwMcuVersion: number;
}

export interface StorageInfo {
  detachedIds: number[];
}

export interface LicenseEntry {
  isBroken: number;
  storageInfo: StorageInfo;
  dongleInfo: DongleInfo;
  flagsAsFields: LicenseFlags;
  sessionsCount: number;
  licenseInfo: LicenseInfo;
  productsCount: number;
}
export interface LicenseEntryMinified {
  isBroken: boolean;
  productNumber: number;
  licenseId: number;
  featureNumber: number;
  currentRunCounterValue: number;
  validFromDate: number;
  validUpToDate: number;
  restOfLifeTime: number;

}
export interface LicenseResponse {
  licenseCount: number;
  licenses: LicenseEntry[];
  lmsCount: number;
  lms: any[];
}


// Status enum
export enum GuardantStatus {
  OK = 0,
  INVALID_HANDLE = 1,
  FEATURE_NOT_FOUND = 2,
  FEATURE_RESOURCE_EXHAUST = 3,
  INVALID_FEATURE = 4,
  INVALID_SERIAL_NUMBER = 5,
  INVALID_LICENSE = 6,
  LICENSE_NOT_ACTIVATED = 7,
  LICENSE_ALREADY_ACTIVATED = 8,
  GET_HARDWARE_ID_ERROR = 9,
  NOT_ENOUGH_HARWARE_TO_BIND = 10,
  REQUEST_FAILED = 12,
  GET_RESPONSE_FAILED = 13,
  SERVER_NOT_FOUND = 14,
  INCORRECT_RESPONSE_DATA = 15,
  FILE_CREATION_ERROR = 16,
  SERIAL_NUMBER_RESOURCE_EXHAUSTED = 17,
  NO_UPDATES_AVAILABLE = 18,
  ACTIVATION_NOT_AVAILABLE = 19,
  NO_CUSTOMER_SPECIFIED = 20,
  CAN_NOT_ACTIVATE_NON_DEMO_LICENSE = 21,
  OUTDATED_API_VERSION = 22,
  INVALID_PARAMETER = 23,
  BUFFER_TOO_SMALL = 24,
  INTERNAL_ERROR = 25,
  LICENSE_IS_BANNED = 26,
  NO_LICENSE_AVAILABLE = 27,
  FEATURE_RUNCOUNTER_EXHAUST = 28,
  FEATURE_EXPIRED = 29,
  INVALID_PUBLIC_KEY = 30,
  NO_SERVICE = 31,
  UNABLE_SEND_REQUEST_TO_ADMIN_RUNTIME = 32,
  DONGLE_NOT_FOUND = 33,
  NO_RESULTS_FOUND = 34,
  INVALID_DIGEST = 35,
  FEATURE_INACTIVE = 36,
  MEMORY_OUT_OF_RANGE = 37,
  ACCESS_DENIED = 38,
  NUMBER_ATTEMPTS_EXHAUSTED = 39,
  SERIAL_NUMBER_NOT_FOUND = 40,
  GRD_INVALID_MEMORY = 41,
  VIRTUAL_ENVIRONMENT_DETECTED = 42,
  REMOTE_DESKTOP_DETECTED = 43,
  OUTDATED_GCC_VERSION = 44,
  REHOST_IS_NOT_ALLOWED = 45,
  STORAGE_CORRUPTED = 46,
  STORAGE_ID_MISMATCH = 47,
  INVALID_UPDATE_OR_ALREADY_INSTALLED = 48,
  INVALID_REHOST_DATA = 49,
  HARDWARE_ID_MISMATCH = 50,
  REACTIVATION_IS_NOT_ALLOWED = 51,
  RECIPIENT_HAS_THE_SAME_LICENSE = 52,
  CAN_NOT_DETACH_SOME_FEATURES = 53,
  CANCEL_PREVIOUS_DETACH_REQUIRED = 54,
  DETACHED_LICENSE_EXPIRED = 55,
  DETACHED_LICENSE_NOT_FOUND = 56,
  DETACH_FORBIDDEN_BY_GCC = 57,
  TRIAL_LICENSE_EXPIRED = 58,
  ORERATION_IS_NOT_ALLOWED = 59,
  RTC_ERROR = 60,
  FUNCTION_NOT_FOUND = 0x70000000,
  DLL_NOT_FOUND = 0x70000001,
  MANAGE_ERROR = 0x70000002
}

// Remote mode
export enum RemoteMode {
  LOCAL = 0x01,
  REMOTE = 0x02
}

// Dongle model
export enum DongleModel {
  SIGN = 0x80,
  CODE = 0x100,
  DL = 0x400
}

// Feature encryption mode
export enum FeatureEncryptMode {
  GRD_EM_ECB = 0x00,
  GRD_EM_CBC = 0x01,
  GRD_EM_CFB = 0x02,
  GRD_EM_OFB = 0x04,
  GRD_NO_COUNTER_DECREMENT = 0x100,
  GRD_SOFTWARE_ACCELERATION = 0x200
}

// Language
export enum GrdLanguageId {
  EN = 0,
  RU = 1
}

// ECC160 parameters
export enum GrdECC160 {
  PUBLIC_KEY_SIZE = 40,
  PRIVATE_KEY_SIZE = 20,
  DIGEST_SIZE = 40,
  MESSAGE_SIZE = 20
}

// Vendor codes structure
export interface VendorCodes {
  PublicCode: number;
  PrivateReadCode: number;
  PrivateWriteCode: number;
}

// NetServer structure
export interface NetServer {
  HostName: Buffer;
  HostPort: number;
  BroadcastAddress: Buffer;
  Reserved: Buffer;
}

// GrdAESContext structure
export interface GrdAesContext {
  iv: Buffer;
  inf: Buffer;
}

// Customer info structure
export interface CustomerInfo {
  FirstName: Buffer;
  LastName: Buffer;
  Email: Buffer;
  CompanyName: Buffer;
  Phone: Buffer;
}
export interface ApiVersionInfo {
  major: number;
  minor: number;
  coded: number;
}

export interface LicenseInfoResult {
  status: number;
  licenseJson: LicenseResponse;
}

