// /db/index.ts
import { IDBPDatabase, openDB } from 'idb';
import { STORE_API, STORE_VERSION } from './constants';

const DB_NAME = 'AgroTechDB';
const LAST_UPDATED_KEY = 'lastUpdated';

const STORE_NAMES = {
    apiStore: STORE_API,
    versionMetaStore: STORE_VERSION,
};

let dbInstance: IDBPDatabase<any> | null = null;

export async function getDB() {
    if (!dbInstance) {
        dbInstance = await openDB(DB_NAME, 1, {
            upgrade(db) {
                Object.values(STORE_NAMES).forEach((storeName) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                });
            },
        });
    }
    return dbInstance;
}

export async function getItem(storeName: string, key: string) {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return await store.get(key);
}

export async function setItem(storeName: string, key: string, value: any): Promise<string> {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.put(value, key);

    const timestamp = new Date().toISOString();
    await store.put(timestamp, LAST_UPDATED_KEY);

    return timestamp;
}

export async function deleteItem(storeName: string, key: string) {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(key);
}
