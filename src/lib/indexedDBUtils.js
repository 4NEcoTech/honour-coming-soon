// indexedDBUtils.js
import { openDB } from 'idb';

const DATABASE_NAME = 'set-edu-dtls';
const DATABASE_VERSION = 1;

let dbInstance = null;

// Initialize the database
export async function initializeDatabase() {
  if (!dbInstance) {
    dbInstance = await openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade(db) {
        // set-admin-dtls

        // personalDetails",
        // "addressDetails",
        // "socialIcons",
        // "documentDetails",
        if (!db.objectStoreNames.contains('set-admin-dtls-personalDetails')) {
          db.createObjectStore('set-admin-dtls-personalDetails', {
            keyPath: 'id',
            // autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('set-admin-dtls-addressDetails')) {
          db.createObjectStore('set-admin-dtls-addressDetails', {
            keyPath: 'id',
            // autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('set-admin-dtls-socialIcons')) {
          db.createObjectStore('set-admin-dtls-socialIcons', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('set-admin-dtls-documentDetails')) {
          db.createObjectStore('set-admin-dtls-documentDetails', {
            keyPath: 'id',
            // autoIncrement: true,
          });
        }

        // set-edu-dtls
        // educationalDetails
        // addressDetails
        // socialIcons
        // documentDetails
        if (!db.objectStoreNames.contains('educationalDetails')) {
          db.createObjectStore('educationalDetails', {
            keyPath: 'id',
            // autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('addressDetails')) {
          db.createObjectStore('addressDetails', {
            keyPath: 'id',
            // autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('socialIcons')) {
          db.createObjectStore('socialIcons', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('documentDetails')) {
          db.createObjectStore('documentDetails', { keyPath: 'id' });
        }
      },
    });
  }
  return dbInstance;
}

// Add data to an object store
export async function addData(storeName, data) {
  try {
    const db = await initializeDatabase();
    return await db.add(storeName, data);
  } catch (error) {
    console.error(`Failed to add data to ${storeName}:`, error);
    throw error;
  }
}

// Add or update data in an object store
export async function addOrUpdateData(storeName, key, data) {
  try {
    const db = await initializeDatabase();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // Check if the record exists
    const existingData = await store.get(key);

    if (existingData) {
      // Update the existing record
      const updatedData = { ...existingData, ...data };
      await store.put(updatedData);
      console.log(`Updated data in ${storeName}:`, updatedData);
    } else {
      // Create a new record
      await store.put({ id: key, ...data });
      console.log(`Added new data to ${storeName}:`, { id: key, ...data });
    }

    return transaction.done;
  } catch (error) {
    console.error(`Failed to add or update data in ${storeName}:`, error);
    throw error;
  }
}

// Retrieve all data from an object store
export async function getAllData(storeName) {
  try {
    const db = await initializeDatabase();
    return await db.getAll(storeName);
  } catch (error) {
    console.error(`Failed to retrieve data from ${storeName}:`, error);
    throw error;
  }
}

// Update data in an object store
export async function updateData(storeName, key, updatedData) {
  try {
    const db = await initializeDatabase();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const existingData = await store.get(key);

    if (existingData) {
      const mergedData = { ...existingData, ...updatedData };
      await store.put(mergedData);
    } else {
      console.warn(`No existing record found for key ${key} in ${storeName}`);
    }

    return transaction.done;
  } catch (error) {
    console.error(`Failed to update data in ${storeName}:`, error);
    throw error;
  }
}

// Delete data from an object store
export async function deleteData(storeName, key) {
  try {
    const db = await initializeDatabase();
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(key);
    return transaction.done;
  } catch (error) {
    console.error(`Failed to delete data from ${storeName}:`, error);
    throw error;
  }
}
