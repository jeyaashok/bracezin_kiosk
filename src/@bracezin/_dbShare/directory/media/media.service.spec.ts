import { buildChunkUploadPayload } from './media.service';

describe('Media chunk upload helpers', () => {
  it('creates chunk metadata for files larger than 5MB', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'sample.png', { type: 'image/png' });

    const payload = buildChunkUploadPayload(file, 1, 2, { folder: 'contact' });

    expect(payload.get('file')).toBeTruthy();
    expect(payload.get('file_name')).toBe('sample.png');
    expect(payload.get('mime')).toBe('image/png');
    expect(payload.get('chunk_index')).toBe('1');
    expect(payload.get('total_chunks')).toBe('2');
    expect(payload.get('is_last_chunk')).toBe('false');
    expect(payload.get('folder')).toBe('contact');
  });
});
