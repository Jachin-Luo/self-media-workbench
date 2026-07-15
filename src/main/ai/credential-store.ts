import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface CredentialCipher {
  isEncryptionAvailable(): boolean;
  encryptString(value: string): Buffer;
  decryptString(value: Buffer): string;
}

export class EncryptedCredentialStore {
  constructor(
    private readonly credentialPath: string,
    private readonly cipher: CredentialCipher,
  ) {}

  async saveApiKey(apiKey: string): Promise<void> {
    if (!this.cipher.isEncryptionAvailable()) {
      throw new Error('当前系统无法安全加密 API Key。');
    }

    await mkdir(path.dirname(this.credentialPath), { recursive: true });
    await writeFile(this.credentialPath, this.cipher.encryptString(apiKey));
  }

  async getApiKey(): Promise<string | null> {
    let encrypted: Buffer;

    try {
      encrypted = await readFile(this.credentialPath);
    } catch (error) {
      if (hasErrorCode(error, 'ENOENT')) return null;
      throw error;
    }

    if (!this.cipher.isEncryptionAvailable()) return null;
    return this.cipher.decryptString(encrypted);
  }
}

function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}
