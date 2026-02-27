import React from 'react';
import { Crown, Zap, Building2, Loader2 } from 'lucide-react';
import {
  useGetSubscription,
  useCheckout,
  usePortal,
} from '~/hooks/useSubscription';
import type { SubscriptionResponse } from '~/hooks/useSubscription';

const tierIcons: Record<string, React.ReactNode> = {
  free: <Zap className="h-5 w-5 text-gray-400" />,
  pro: <Crown className="h-5 w-5 text-yellow-500" />,
  enterprise: <Building2 className="h-5 w-5 text-purple-500" />,
};

const tierColors: Record<string, string> = {
  free: 'border-gray-200 dark:border-gray-700',
  pro: 'border-yellow-400 dark:border-yellow-600',
  enterprise: 'border-purple-400 dark:border-purple-600',
};

/**
 * Format token credits for display.
 * 100000 → "100K", 2000000 → "2M"
 */
function formatCredits(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return amount.toString();
}

function formatPrice(cents: number): string {
  if (cents === 0) {
    return 'Free';
  }
  return `$${(cents / 100).toFixed(2)}/mo`;
}

function TierCard({
  tier,
  currentTier,
  onUpgrade,
  isLoading,
}: {
  tier: SubscriptionResponse['availableTiers'][0];
  currentTier: string;
  onUpgrade: (tierId: string) => void;
  isLoading: boolean;
}) {
  const isCurrent = tier.id === currentTier;
  const isUpgrade = !isCurrent && tier.priceMonthly > 0;

  return (
    <div
      className={`flex flex-col rounded-lg border-2 p-4 transition-colors ${
        isCurrent
          ? tierColors[tier.id] + ' bg-surface-secondary'
          : 'border-transparent bg-surface-primary hover:border-border-medium'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {tierIcons[tier.id]}
        <span className="font-semibold text-text-primary">{tier.name}</span>
        {isCurrent && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            Current
          </span>
        )}
      </div>

      <div className="mb-3 text-lg font-bold text-text-primary">
        {formatPrice(tier.priceMonthly)}
      </div>

      <ul className="mb-4 space-y-1 text-xs text-text-secondary">
        <li>{formatCredits(tier.startBalance)} starting credits</li>
        <li>{formatCredits(tier.refillAmount)} credits/month refill</li>
        <li>{tier.messageRateLimit} messages/min</li>
      </ul>

      {isUpgrade && (
        <button
          onClick={() => onUpgrade(tier.id)}
          disabled={isLoading}
          className="mt-auto rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            `Upgrade to ${tier.name}`
          )}
        </button>
      )}

      {isCurrent && tier.priceMonthly > 0 && (
        <ManageButton />
      )}
    </div>
  );
}

function ManageButton() {
  const portal = usePortal();

  return (
    <button
      onClick={() => portal.mutate()}
      disabled={portal.isPending}
      className="mt-auto rounded-lg border border-border-medium px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      {portal.isPending ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
      ) : (
        'Manage Subscription'
      )}
    </button>
  );
}

export default function SubscriptionTier() {
  const { data, isLoading, error } = useGetSubscription();
  const checkout = useCheckout();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-text-secondary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-2 text-sm text-red-500">
        Unable to load subscription info.
      </div>
    );
  }

  const handleUpgrade = (tierId: string) => {
    checkout.mutate(tierId);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary">Subscription Plan</h3>

      {checkout.isError && (
        <div className="rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {checkout.error?.message || 'Failed to start checkout. Stripe may not be configured.'}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {data.availableTiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            currentTier={data.tier}
            onUpgrade={handleUpgrade}
            isLoading={checkout.isPending}
          />
        ))}
      </div>

      {data.status === 'past_due' && (
        <div className="rounded-md bg-yellow-50 p-2 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
          Your payment is past due. Please update your payment method to continue service.
        </div>
      )}
    </div>
  );
}
