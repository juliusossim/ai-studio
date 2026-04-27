import type { MediaType } from '@org/types';

export interface VerifiedMediaSignature {
  readonly format: string;
  readonly mimeType: string;
  readonly type: MediaType;
}

export function detectMediaSignature(bytes: Uint8Array): VerifiedMediaSignature | undefined {
  if (isJpeg(bytes)) {
    return {
      format: 'jpeg',
      mimeType: 'image/jpeg',
      type: 'image',
    };
  }

  if (isPng(bytes)) {
    return {
      format: 'png',
      mimeType: 'image/png',
      type: 'image',
    };
  }

  if (isGif(bytes)) {
    return {
      format: 'gif',
      mimeType: 'image/gif',
      type: 'image',
    };
  }

  if (isWebp(bytes)) {
    return {
      format: 'webp',
      mimeType: 'image/webp',
      type: 'image',
    };
  }

  if (isQuickTime(bytes)) {
    return {
      format: 'mov',
      mimeType: 'video/quicktime',
      type: 'video',
    };
  }

  if (isMp4(bytes)) {
    return {
      format: 'mp4',
      mimeType: 'video/mp4',
      type: 'video',
    };
  }

  if (isWebm(bytes)) {
    return {
      format: 'webm',
      mimeType: 'video/webm',
      type: 'video',
    };
  }

  return undefined;
}

function isGif(bytes: Uint8Array): boolean {
  return startsWithAscii(bytes, 'GIF87a') || startsWithAscii(bytes, 'GIF89a');
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isMp4(bytes: Uint8Array): boolean {
  if (!hasFtypBox(bytes)) {
    return false;
  }

  const brand = readAscii(bytes, 8, 4);
  return brand !== 'qt  ';
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function isQuickTime(bytes: Uint8Array): boolean {
  return hasFtypBox(bytes) && readAscii(bytes, 8, 4) === 'qt  ';
}

function isWebm(bytes: Uint8Array): boolean {
  if (
    bytes.length < 4 ||
    bytes[0] !== 0x1a ||
    bytes[1] !== 0x45 ||
    bytes[2] !== 0xdf ||
    bytes[3] !== 0xa3
  ) {
    return false;
  }

  return readAscii(bytes, 0, bytes.length).includes('webm');
}

function isWebp(bytes: Uint8Array): boolean {
  return startsWithAscii(bytes, 'RIFF') && readAscii(bytes, 8, 4) === 'WEBP';
}

function hasFtypBox(bytes: Uint8Array): boolean {
  return bytes.length >= 12 && readAscii(bytes, 4, 4) === 'ftyp';
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  return Array.from(bytes.slice(start, start + length))
    .map((value) => String.fromCharCode(value))
    .join('');
}

function startsWithAscii(bytes: Uint8Array, value: string): boolean {
  return readAscii(bytes, 0, value.length) === value;
}
