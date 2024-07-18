import { openDB } from 'idb';

const DB_NAME = 'restaurant-app';
const DB_VERSION = 1;
let database; // Ubah nama variabel db menjadi database

// Inisialisasi basis data IndexedDB
export async function initDB() {
    database = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('favorites')) {
                db.createObjectStore('favorites', { keyPath: 'id' });
            }
        },
    });
}

// Simpan restoran ke favorit
export async function saveFavorite(restaurant) {
    if (!database) {
        throw new Error('Database not initialized');
    }
    const tx = database.transaction('favorites', 'readwrite');
    await tx.store.add(restaurant);
    await tx.done;
}

// Hapus restoran dari favorit
export async function removeFavorite(id) {
    if (!database) {
        throw new Error('Database not initialized');
    }
    const tx = database.transaction('favorites', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
}

// Ambil daftar restoran favorit
export async function getFavorites() {
    if (!database) {
        throw new Error('Database not initialized');
    }
    const tx = database.transaction('favorites', 'readonly');
    const { store } = tx;
    return store.getAll();
}

// Periksa apakah restoran adalah favorit
export async function isFavorite(id) {
    const favorites = await getFavorites();
    if (!Array.isArray(favorites)) {
        console.error('Favorites is not an array:', favorites);
        return false;
    }
    return favorites.some((favorite) => favorite.id === id);
}
