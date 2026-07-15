import { describe, expect, it } from 'vitest';
import { appInfoSchema } from '../../src/shared/ipc/app-info';

describe('appInfoSchema', () => {
  it('accepts supported desktop platforms', () => {
    expect(
      appInfoSchema.parse({
        name: '自媒体工作台',
        version: '0.1.0',
        platform: 'win32',
      }),
    ).toEqual({
      name: '自媒体工作台',
      version: '0.1.0',
      platform: 'win32',
    });
  });

  it('rejects unsupported platform values', () => {
    expect(() =>
      appInfoSchema.parse({
        name: '自媒体工作台',
        version: '0.1.0',
        platform: 'android',
      }),
    ).toThrow();
  });
});

