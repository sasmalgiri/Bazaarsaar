import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * AES-256-GCM encryption/decryption for Zerodha access tokens.
 * Key is stored as ZERODHA_TOKEN_ENCRYPTION_KEY env var (64-char hex = 32 bytes).
 * Server-only — never import this in client components.
 */

function getKeyBuffer(): Buffer {
  const keyHex = process.env.ZERODHA_TOKEN_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('ZERODHA_TOKEN_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
  }
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypt plaintext. Returns "iv_hex:ciphertext_with_tag_hex" string.
 */
export function encrypt(plaintext: string): string {
  const key = getKeyBuffer();
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${Buffer.concat([encrypted, tag]).toString('hex')}`;
}

/**
 * Decrypt "iv_hex:ciphertext_with_tag_hex" string back to plaintext.
 * Auth tag is the last 16 bytes of the data segment.
 */
export function decrypt(encryptedStr: string): string {
  const key = getKeyBuffer();
  const [ivHex, dataHex] = encryptedStr.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const data = Buffer.from(dataHex, 'hex');

  // GCM auth tag is last 16 bytes
  const tagStart = data.length - 16;
  const ciphertext = data.subarray(0, tagStart);
  const tag = data.subarray(tagStart);

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext) + decipher.final('utf8');
}
