import { cortex-os } from '@cortex-os/data-provider';
import type { DynamicSettingProps } from '@cortex-os/data-provider';

type Cortex OSKeys = keyof typeof cortex-os;

type Cortex OSParams = {
  modelOptions: Omit<NonNullable<DynamicSettingProps['conversation']>, Cortex OSKeys>;
  resendFiles: boolean;
  promptPrefix?: string | null;
  maxContextTokens?: number;
  fileTokenLimit?: number;
  modelLabel?: string | null;
};

/**
 * Separates Cortex OS-specific parameters from model options
 * @param options - The combined options object
 */
export function extractCortex OSParams(
  options?: DynamicSettingProps['conversation'],
): Cortex OSParams {
  if (!options) {
    return {
      modelOptions: {} as Omit<NonNullable<DynamicSettingProps['conversation']>, Cortex OSKeys>,
      resendFiles: cortex-os.resendFiles.default as boolean,
    };
  }

  const modelOptions = { ...options };

  const resendFiles =
    (delete modelOptions.resendFiles, options.resendFiles) ??
    (cortex-os.resendFiles.default as boolean);
  const promptPrefix = (delete modelOptions.promptPrefix, options.promptPrefix);
  const maxContextTokens = (delete modelOptions.maxContextTokens, options.maxContextTokens);
  const fileTokenLimit = (delete modelOptions.fileTokenLimit, options.fileTokenLimit);
  const modelLabel = (delete modelOptions.modelLabel, options.modelLabel);

  return {
    modelOptions: modelOptions as Omit<
      NonNullable<DynamicSettingProps['conversation']>,
      Cortex OSKeys
    >,
    maxContextTokens,
    fileTokenLimit,
    promptPrefix,
    resendFiles,
    modelLabel,
  };
}
