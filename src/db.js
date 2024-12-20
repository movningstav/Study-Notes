// src/db.js

import { openDB } from 'idb';

const DB_NAME = 'AppDB';
const STORE_NAME = 'CategoriesStore';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const getCategories = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const saveCategories = async (categories) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear(); // Clear existing data
  for (const category of categories) {
    await store.put(category);
  }
  await tx.done;
  console.log('Data saved to IndexedDB:', categories);
};