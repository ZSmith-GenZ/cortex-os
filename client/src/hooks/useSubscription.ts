import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/** Subscription API response type */
export interface SubscriptionResponse {
  tier: 'free' | 'pro' | 'enterprise';
  tierName: string;
  status: string;
  currentPeriodEnd?: string;
  credits: {
    name: string;
    startBalance: number;
    refillAmount: number;
    refillIntervalValue: number;
    refillIntervalUnit: string;
    messageRateLimit: number;
    priceMonthly: number;
  };
  availableTiers: {
    id: string;
    name: string;
    priceMonthly: number;
    startBalance: number;
    refillAmount: number;
    messageRateLimit: number;
  }[];
}

const SUBSCRIPTION_QUERY_KEY = ['subscription'];

async function fetchSubscription(): Promise<SubscriptionResponse> {
  const res = await fetch('/api/subscription', {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch subscription');
  }
  return res.json();
}

async function createCheckout(tier: string): Promise<{ url: string }> {
  const res = await fetch('/api/subscription/checkout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create checkout');
  }
  return res.json();
}

async function createPortal(): Promise<{ url: string }> {
  const res = await fetch('/api/subscription/portal', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create portal');
  }
  return res.json();
}

/**
 * Hook to get the current user's subscription info.
 */
export function useGetSubscription(enabled = true) {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: fetchSubscription,
    enabled,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
}

/**
 * Hook to initiate a Stripe checkout session for upgrading.
 */
export function useCheckout() {
  return useMutation({
    mutationFn: (tier: string) => createCheckout(tier),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

/**
 * Hook to open the Stripe billing portal for managing subscription.
 */
export function usePortal() {
  return useMutation({
    mutationFn: () => createPortal(),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}
