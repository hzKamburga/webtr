/**
 * WebTR Library Compiled
 * Source: index.js
 * Date: 2026-02-07T09:47:43.996Z
 * 
 * ⚠️ Generated Content - Do not edit directly
 */
/**
 * WebTR MongoDB Helper
 * Simple wrapper for native MongoDB driver
 */

import { MongoClient } from 'mongodb';

let client = null;
let db = null;

/**
 * MongoDB'ye bağlanır
 * @param {string} uri - Connection string (örn: mongodb://localhost:27017)
 * @param {string} dbName - Veritabanı adı
 */
export async function connect(uri, dbName) {
    // Eğer zaten bağlıysa mevcut instance'ı dön
    if (client) return db;

    if (!uri) throw new Error('MongoDB URI gerekli');

    try {
        client = new MongoClient(uri);
        await client.connect();

        // dbName verilmezse URI'den otomatik alır
        db = client.db(dbName);
        console.log(`[WebTR] MongoDB Bağlandı: ${db.databaseName}`);
        return db;
    } catch (error) {
        console.error('[WebTR] MongoDB Bağlantı Hatası:', error);
        throw error;
    }
}

/**
 * Aktif veritabanı instance'ını döner
 */
export function getDB() {
    if (!db) throw new Error('Veritabanı bağlantısı yok. Önce connect() fonksiyonunu çağırın.');
    return db;
}

/**
 * Koleksiyon helper'ı
 * @param {string} name - Koleksiyon adı
 */
export function collection(name) {
    return getDB().collection(name);
}

/**
 * Bağlantıyı kapatır
 */
export async function close() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('[WebTR] MongoDB Bağlantısı Kapatıldı');
    }
}
