import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class CommonService {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Converts base64 image data into a Buffer and uploads directly to Cloudflare R2
   */
  public async saveBase64Image(
    base64Str: string,
    path: string,
  ): Promise<string> {
    const matches = base64Str.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let extension = '.jpg';
    if (mimeType === 'image/png') extension = '.png';
    else if (mimeType === 'image/webp') extension = '.webp';
    else if (mimeType === 'image/gif') extension = '.gif';
    else if (mimeType === 'image/svg+xml') extension = '.svg';

    const filename = `cus_${Date.now()}_${Math.round(Math.random() * 1e6)}${extension}`;

    const result = await this.storageService.uploadBuffer(
      buffer,
      mimeType,
      path,
      filename,
    );

    return result.key;
  }

  /**
   * Helper to extract R2 object key from stored URL or key
   */
  public getStorageKeyFromUrl(urlOrKey: string, path: string): string | null {
    if (!urlOrKey) return null;
    const clean = urlOrKey.startsWith('/') ? urlOrKey.slice(1) : urlOrKey;
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      const parts = clean.split('/');
      const folderIndex = parts.findIndex((p) => p === 'customers');
      if (folderIndex !== -1) {
        return parts.slice(folderIndex).join('/');
      }
    }
    if (clean.startsWith(path + '/')) {
      return clean;
    }
    return null;
  }

  /**
   * Get UserId by Access Token
   */
  public getUserIdFromToken(token: string, secret?: string): string | null {
    if (!token) return null;
    try {
      const cleanToken = token.startsWith('Bearer ')
        ? token.slice(7).trim()
        : token.trim();

      const jwtService = new JwtService();
      let decoded: any;
      if (secret) {
        decoded = jwtService.verify(cleanToken, { secret });
      } else {
        decoded = jwtService.decode(cleanToken);
      }

      return decoded?.sub || decoded?.id || null;
    } catch (error) {
      console.error('Error extracting userId from token:', error);
      return null;
    }
  }
}
