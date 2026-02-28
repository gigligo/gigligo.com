import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Derives a 32-byte key from the KYC_ENCRYPTION_KEY env variable.
 * Falls back to a development-only placeholder (NEVER use in production).
 */
function getKey(): Buffer {
    const secret = process.env.KYC_ENCRYPTION_KEY;
    if (!secret) {
        console.warn('[CRYPTO] WARNING: KYC_ENCRYPTION_KEY not set. Using insecure default. Set it in production!');
    }
    return scryptSync(secret || 'dev-only-insecure-key', 'gigligo-kyc-salt', 32);
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64 string in format: iv:authTag:ciphertext
 */
export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:ciphertext (all base64)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Expects input in format: iv:authTag:ciphertext (all base64)
 */
export function decrypt(encryptedData: string): string {
    const key = getKey();
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
        // If it doesn't look encrypted (e.g., legacy plaintext URL), return as-is
        return encryptedData;
    }

    const iv = Buffer.from(parts[0], 'base64');
    const authTag = Buffer.from(parts[1], 'base64');
    const ciphertext = parts[2];

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Checks if a value appears to be encrypted (in iv:authTag:ciphertext format).
 */
export function isEncrypted(value: string): boolean {
    const parts = value.split(':');
    return parts.length === 3 && parts.every(p => p.length > 0);
}
