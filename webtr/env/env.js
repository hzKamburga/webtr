/**
 * WebTR Library Compiled
 * Source: env.weblib
 * Date: 2026-02-07T10:06:49.852Z
 * 
 * ⚠️ Generated Content - Do not edit directly
 */
/**
 * WebTR Environment Loader
 * Loads .env file into process.env
 * 
 * Usage:
 * import { config } from 'webtr:@webtr/env';
 * config();
 */

import fs from 'fs';
import path from 'path';

export function config(options = {}) {
    try {
        const rootDir = process.cwd();
        const envPath = options.path || path.resolve(rootDir, '.env');
        
        if (!fs.existsSync(envPath)) {
            console.warn(`[WebTR:Env] .env file not found at ${envPath}`);
            return;
        }

        const content = fs.readFileSync(envPath, 'utf-8');
        const lines = content.split('\n');
        
        let count = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip comments and empty lines
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;

            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();

            // Remove quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || 
                (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }

            // Don't overwrite existing env vars
            if (!process.env[key]) {
                process.env[key] = val;
                count++;
            }
        }
        
        // console.log(`[WebTR:Env] Loaded ${count} variables from .env`);
    } catch (e) {
        console.error('[WebTR:Env] Error loading .env file:', e);
    }
}

// Helper to get with default
export function get(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}

// Helper to get required
export function requireEnv(key) {
    const val = process.env[key];
    if (val === undefined || val === null) {
        throw new Error(`[WebTR:Env] Missing required environment variable: ${key}`);
    }
    return val;
}
