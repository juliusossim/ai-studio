import { detectMediaSignature } from './media-signature';

describe('detectMediaSignature', () => {
  it('detects jpeg files from their leading bytes', () => {
    expect(detectMediaSignature(Uint8Array.from([0xff, 0xd8, 0xff, 0xdb]))).toEqual({
      format: 'jpeg',
      mimeType: 'image/jpeg',
      type: 'image',
    });
  });

  it('detects mp4 files from their ftyp box', () => {
    const bytes = Uint8Array.from([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    ]);

    expect(detectMediaSignature(bytes)).toEqual({
      format: 'mp4',
      mimeType: 'video/mp4',
      type: 'video',
    });
  });

  it('returns undefined for unsupported content', () => {
    expect(detectMediaSignature(Uint8Array.from([0x01, 0x02, 0x03, 0x04]))).toBeUndefined();
  });
});
