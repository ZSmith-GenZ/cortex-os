import { cortexOS } from '@cortex-os/data-provider';
import type { DynamicSettingProps } from '@cortex-os/data-provider';

type CortexOSKeys = keyof typeof cortexOS;

type CortexOSParams = {
  modelOptions: Omit<NonNullable<DynamicSettingProps['conversation']>, CortexOSKeys>;
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
export function extractCortexOSParams(
  options?: DynamicSettingProps['conversation'],
): CortexOSParams {
  if (!options) {
    return {
      modelOptions: {} as Omit<NonNullable<DynamicSettingProps['conversation']>, CortexOSKeys>,
      resendFiles: cortexOS.resendFiles.default as boolean,
    };
  }

  const modelOptions = { ...options };

  const resendFiles =
    (delete modelOptions.resendFiles, options.resendFiles) ??
    (cortexOS.resendFiles.default as boolean);
  const promptPrefix = (delete modelOptions.promptPrefix, options.promptPrefix);
  const maxContextTokens = (delete modelOptions.maxContextTokens, options.maxContextTokens);
  const fileTokenLimit = (delete modelOptions.fileTokenLimit, options.fileTokenLimit);
  const modelLabel = (delete modelOptions.modelLabel, options.modelLabel);

  return {
    modelOptions: modelOptions as Omit<
      NonNullable<DynamicSettingProps['conversation']>,
      CortexOSKeys
    >,
    maxContextTokens,
    fileTokenLimit,
    promptPrefix,
    resendFiles,
    modelLabel,
  };
}
