import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PublicLanding — The unauthenticated landing page for Cortex OS.
 *
 * Rendered at `/` for visitors who are not signed in.
 * Dark, premium, minimal aesthetic inspired by Linear / Vercel.
 * Fully self-contained: all styling via Tailwind utility classes.
 */

/* ------------------------------------------------------------------ */
/*  Inline SVG icons (kept small so we don't need an icon library)    */
/* ------------------------------------------------------------------ */

const IconMemory = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a4 4 0 0 1 4-4Z" />
    <path d="M9 8v1a3 3 0 0 0 6 0V8" />
    <path d="M12 12v2" />
    <path d="M8 22h8" />
    <path d="M12 14a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6Z" />
  </svg>
);

const IconKey = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const IconAgents = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconSwitch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Memory',
    description:
      'Cortex remembers you across every conversation. Context persists so your AI grows with you.',
    icon: <IconMemory />,
  },
  {
    title: 'BYOK',
    description:
      'Bring your own API keys. Connect OpenAI, Anthropic, Google, or any compatible provider.',
    icon: <IconKey />,
  },
  {
    title: 'Specialists',
    description:
      'Purpose-built AI agents for coding, writing, research, and more — each tuned for the job.',
    icon: <IconAgents />,
  },
  {
    title: 'Multi-Model',
    description:
      'Switch between providers and models seamlessly within a single workspace.',
    icon: <IconSwitch />,
  },
];

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const pricing: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Get started with Cortex at no cost.',
    features: ['100K credits / month', 'Cortex Free model', 'Memory system', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/ month',
    description: 'For power users who need more.',
    features: [
      '500K credits / month',
      'All models',
      'Priority support',
      'Advanced memory',
      'Specialist agents',
    ],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: '/ month',
    description: 'Full control and custom deployment.',
    features: [
      '2M credits / month',
      'Custom deployment',
      'API access',
      'Dedicated support',
      'All Pro features',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const PublicLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans antialiased selection:bg-purple-500/30">
      {/* ---- Navbar ---- */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Cortex<span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent"> OS</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        {/* Radial glow behind the heading */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-[#7c3aed]/15 blur-[120px]"
        />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
            Local-first. Privacy-respecting. Yours.
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              AI Operating System
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Cortex OS lives on your machine with full system access. One workspace for every model,
            every conversation, every tool — with memory that never forgets.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-8 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-opacity hover:opacity-90 sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/10 sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need.{' '}
            <span className="text-gray-500">Nothing you don't.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            A unified AI workspace designed around how you actually work.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-[#7c3aed]/30 hover:bg-white/[0.04]"
            >
              <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-[#7c3aed]/20 to-[#a855f7]/10 p-2.5 text-[#a855f7]">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[#7c3aed]/10 blur-[140px]"
        />

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Start free. Scale when you're ready.
          </p>
        </div>

        <div className="relative z-10 mt-16 grid gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border p-8 transition-colors ${
                tier.highlighted
                  ? 'border-[#7c3aed]/50 bg-gradient-to-b from-[#7c3aed]/10 to-transparent shadow-lg shadow-purple-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              {tier.highlighted && (
                <span className="mb-4 inline-block self-start rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-3 py-0.5 text-xs font-medium text-white">
                  Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{tier.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-gray-500">{tier.period}</span>
                )}
              </div>

              <ul className="mt-8 flex flex-col gap-3 text-sm text-gray-400">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="text-[#a855f7]">
                      <IconCheck />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  to="/register"
                  className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-lg shadow-purple-500/20 hover:opacity-90'
                      : 'border border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <span className="text-sm font-semibold tracking-tight">
            Cortex<span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent"> OS</span>
          </span>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GenZee LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
