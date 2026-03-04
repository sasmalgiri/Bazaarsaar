/**
 * AES-256-GCM encryption/decryption for Zerodha access tokens.
 * Key is stored as ZERODHA_TOKEN_ENCRYPTION_KEY env var (64-char hex = 32 bytes).
 */

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getKey(): Promise<CryptoKey> {
  const keyHex = Deno.env.get('ZERODHA_TOKEN_ENCRYPTION_KEY');
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('ZERODHA_TOKEN_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
  }
  return crypto.subtle.importKey(
    'raw',
    hexToBytes(keyHex),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext. Returns "iv_hex:ciphertext_hex" string.
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return `${bytesToHex(iv)}:${bytesToHex(new Uint8Array(ciphertext))}`;
}

/**
 * Decrypt "iv_hex:ciphertext_hex" string back to plaintext.
 */
export async function decrypt(encryptedStr: string): Promise<string> {
  const key = await getKey();
  const [ivHex, ciphertextHex] = encryptedStr.split(':');
  const iv = hexToBytes(ivHex);
  const ciphertext = hexToBytes(ciphertextHex);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
