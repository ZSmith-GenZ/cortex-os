import React, { useState } from 'react';
import { EModelEndpoint } from 'librechat-data-provider';
import { useUserKeyQuery } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';
import SetKeyDialog from '~/components/Input/SetKeyDialog';

type ProviderConfig = {
  endpoint: EModelEndpoint | string;
  label: string;
  description: string;
};

const providers: ProviderConfig[] = [
  {
    endpoint: EModelEndpoint.anthropic,
    label: 'Anthropic (Claude)',
    description: 'Powers Claude models — recommended for best results',
  },
  {
    endpoint: EModelEndpoint.openAI,
    label: 'OpenAI (GPT)',
    description: 'Powers GPT models and DALL-E image generation',
  },
];

function ProviderRow({ provider }: { provider: ProviderConfig }) {
  const localize = useLocalize();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: keyData } = useUserKeyQuery(provider.endpoint);

  const hasKey = keyData?.expiresAt !== undefined && keyData?.expiresAt !== null
    ? new Date(keyData.expiresAt).getTime() > Date.now()
    : keyData?.expiresAt === 'never' || (keyData != null && Object.keys(keyData).length > 0 && keyData.expiresAt !== undefined);

  // Simpler check: if we got data back with expiresAt field, key exists
  const keyExists = keyData != null && 'expiresAt' in keyData;
  const keyExpired = keyExists && keyData.expiresAt != null && keyData.expiresAt !== 'never' && new Date(keyData.expiresAt).getTime() < Date.now();
  const keyActive = keyExists && !keyExpired;

  return (
    <>
      <div className="flex items-center justify-between border-b border-border-medium pb-3">
        <div className="flex-1">
          <div className="font-medium">{provider.label}</div>
          <div className="text-xs text-text-secondary">{provider.description}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                keyActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <span className="text-xs text-text-tertiary">
              {keyActive
                ? localize('com_api_keys_status_active')
                : keyExpired
                  ? localize('com_api_keys_status_expired')
                  : localize('com_api_keys_status_not_set')}
            </span>
          </div>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="rounded-lg border border-border-medium px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
        >
          {keyActive ? localize('com_api_keys_update') : localize('com_api_keys_set')}
        </button>
      </div>
      <SetKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        endpoint={provider.endpoint as EModelEndpoint}
      />
    </>
  );
}

function ApiKeys() {
  const localize = useLocalize();

  return (
    <div className="flex flex-col gap-3 p-1 text-sm text-text-primary">
      <div className="pb-1">
        <div className="text-base font-medium">{localize('com_api_keys_title')}</div>
        <div className="text-xs text-text-secondary">
          {localize('com_api_keys_description')}
        </div>
      </div>
      {providers.map((provider) => (
        <ProviderRow key={provider.endpoint} provider={provider} />
      ))}
      <div className="pt-1 text-xs text-text-tertiary">
        {localize('com_api_keys_privacy_note')}
      </div>
    </div>
  );
}

export default React.memo(ApiKeys);
