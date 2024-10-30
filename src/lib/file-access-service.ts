import { randomBytes } from 'crypto';
import type { FileAccess, FileMetadata } from './types';

export class FileAccessService {
  private fileAccesses: Map<string, FileAccess> = new Map();
  private files: Map<string, FileMetadata> = new Map();

  constructor() {
    // Initialize with your PDF file metadata
    this.files.set('prescriber-guide', {
      id: 'prescriber-guide',
      name: 'Prescriber Guide.pdf',
      path: '/assets/prescriber-guide.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 0 // Set actual size
    });
  }

  async generateAccessToken(email: string, fileId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days access

    const access: FileAccess = {
      token,
      email,
      fileId,
      expiresAt: expiresAt.toISOString(),
      downloads: 0
    };

    this.fileAccesses.set(token, access);
    return token;
  }

  async validateAccess(token: string): Promise<FileMetadata | null> {
    const access = this.fileAccesses.get(token);
    
    if (!access) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(access.expiresAt);

    if (now > expiresAt) {
      this.fileAccesses.delete(token);
      return null;
    }

    const file = this.files.get(access.fileId);
    if (!file) {
      return null;
    }

    access.downloads += 1;
    this.fileAccesses.set(token, access);
    
    return file;
  }

  async getDownloadUrl(token: string): Promise<string> {
    return `/api/download/${token}`;
  }
}