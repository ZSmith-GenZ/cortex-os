import type { AuthType } from '@cortex-os/data-provider';

export type ApiKeyFormData = {
  apiKey: string;
  authType?: string | AuthType;
};
