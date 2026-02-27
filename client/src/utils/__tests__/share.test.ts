jest.mock('@cortex-os/data-provider', () => ({
  apiBaseUrl: jest.fn(),
}));

import { apiBaseUrl } from '@cortex-os/data-provider';
import { buildShareLinkUrl } from '../share';

describe('buildShareLinkUrl', () => {
  it('includes the base path for subdirectory deployments', () => {
    (apiBaseUrl as jest.Mock).mockReturnValue('/cortex-os');
    expect(buildShareLinkUrl('reW8SsFGQEH1b1uzSHe4I')).toBe(
      'http://localhost:3080/cortex-os/share/reW8SsFGQEH1b1uzSHe4I',
    );
  });

  it('works when base path is root', () => {
    (apiBaseUrl as jest.Mock).mockReturnValue('');
    expect(buildShareLinkUrl('reW8SsFGQEH1b1uzSHe4I')).toBe(
      'http://localhost:3080/share/reW8SsFGQEH1b1uzSHe4I',
    );
  });
});
