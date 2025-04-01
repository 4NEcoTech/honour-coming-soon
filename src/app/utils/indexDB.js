import { DB_NAME, DB_VERSION } from '@/lib/constants';

// ✅ Open Database (Only Users Store)
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 🔥 Handle Database Upgrade
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // ✅ Create "users" Store if Not Exist
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', {
          keyPath: 'id', // Primary Key
          // autoIncrement: true, // Auto-increment ID
        });
        userStore.createIndex('email', 'email', { unique: true }); // Unique Email Index
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Add User Data (After Login)
export const addUser = async (userData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(userData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Get User By Email
export const getUserByEmail = async (email) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Get User By ID
export const getUserById = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Update User Data
export const updateUser = async (userData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.put(userData); // `put()` updates existing or adds new if not found

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Delete User Data (By ID)
export const deleteUser = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.delete(id);

    request.onsuccess = () => resolve('User deleted successfully');
    request.onerror = (event) => reject(event.target.error);
  });
};

// ✅ Clear All User Data
export const clearUsers = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.clear();

    request.onsuccess = () => resolve('All users cleared successfully');
    request.onerror = (event) => reject(event.target.error);
  });
};
