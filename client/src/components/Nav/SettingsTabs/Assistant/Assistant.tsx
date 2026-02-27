import React, { useState, useEffect } from 'react';
import { useLocalize } from '~/hooks';
import {
  useGetAssistantProfile,
  useUpdateAssistantProfile,
} from '~/data-provider';

function Assistant() {
  const localize = useLocalize();
  const { data: profile, isLoading } = useGetAssistantProfile();
  const updateProfile = useUpdateAssistantProfile();

  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || 'Cortex');
      setPersonality(profile.personality || '');
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      { name: name.trim() || 'Cortex', personality },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-1 text-sm text-text-primary">
        <div className="animate-pulse">
          <div className="mb-2 h-4 w-32 rounded bg-surface-tertiary" />
          <div className="h-10 w-full rounded bg-surface-tertiary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-1 text-sm text-text-primary">
      <div className="border-b border-border-medium pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{localize('com_assistant_name_label')}</div>
            <div className="text-xs text-text-secondary">
              {localize('com_assistant_name_description')}
            </div>
          </div>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cortex"
          maxLength={64}
          className="mt-2 w-full rounded-lg border border-border-medium bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-heavy focus:outline-none"
        />
      </div>

      <div className="border-b border-border-medium pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{localize('com_assistant_personality_label')}</div>
            <div className="text-xs text-text-secondary">
              {localize('com_assistant_personality_description')}
            </div>
          </div>
        </div>
        <textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder={localize('com_assistant_personality_placeholder')}
          maxLength={2000}
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-border-medium bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-heavy focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-text-tertiary">
          {personality.length}/2000
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {saved && (
          <span className="text-xs text-green-500">
            {localize('com_assistant_saved')}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={updateProfile.isLoading}
          className="rounded-lg bg-surface-contrast px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {updateProfile.isLoading
            ? localize('com_ui_saving')
            : localize('com_ui_save')}
        </button>
      </div>
    </div>
  );
}

export default React.memo(Assistant);
