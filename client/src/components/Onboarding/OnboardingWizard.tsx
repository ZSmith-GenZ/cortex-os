import React, { useState } from 'react';

/**
 * Props for the OnboardingWizard component.
 * @property onComplete - Callback fired when the user finishes the wizard.
 *   Receives the customized AI name and personality text.
 */
interface OnboardingWizardProps {
  onComplete: (data: { name: string; personality: string }) => void;
}

const DEFAULT_PERSONALITY = `You are Cortex, a personal AI operating system. You are helpful, direct, and conversational. You remember what the user tells you across conversations and build on that context. You adapt to the user's communication style — concise when they're brief, detailed when they need depth. You proactively offer relevant suggestions when you notice opportunities to help. You are the user's thinking partner, not just a chatbot.`;

const TOTAL_STEPS = 3;

/**
 * OnboardingWizard -- A 3-step post-registration wizard for Cortex OS.
 *
 * Step 1: "Meet Cortex"  -- Welcome screen introducing the platform.
 * Step 2: "Personalize"  -- User customizes the AI name and personality.
 * Step 3: "Ready"        -- Confirmation screen with a "Start Chatting" CTA.
 *
 * All styling is self-contained via Tailwind utility classes.
 * The component is fully responsive (mobile + desktop).
 */
const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Cortex');
  const [personality, setPersonality] = useState(DEFAULT_PERSONALITY);

  /** Advance to the next step, or finish the wizard on the last step. */
  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete({ name, personality });
    }
  };

  /** Go back to the previous step. */
  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
      {/* Subtle radial glow behind the card */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative mx-4 flex w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-[#141420] p-8 shadow-2xl sm:mx-0 sm:p-10">
        {/* Step indicator dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-gradient-to-r from-[#7c3aed] to-[#a855f7]'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step content area with a fixed minimum height to prevent layout shift */}
        <div className="min-h-[320px] sm:min-h-[340px]">
          {/* ---- Step 1: Meet Cortex ---- */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
              {/* Icon / logo placeholder */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-3xl font-bold text-white shadow-lg shadow-purple-500/25">
                C
              </div>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome to Cortex OS
              </h1>

              <p className="mb-3 max-w-md text-base leading-relaxed text-white/60">
                Your personal AI operating system. Cortex remembers you, adapts
                to your style, and gets better with every conversation.
              </p>

              <ul className="mt-4 space-y-3 text-left text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#a855f7]" />
                  <span>
                    <span className="font-medium text-white/70">Remembers you</span> --
                    persistent memory across every conversation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#a855f7]" />
                  <span>
                    <span className="font-medium text-white/70">Adapts to you</span> --
                    learns your communication style over time.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#a855f7]" />
                  <span>
                    <span className="font-medium text-white/70">Your thinking partner</span> --
                    proactive suggestions, not just answers.
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* ---- Step 2: Personalize ---- */}
          {step === 1 && (
            <div className="flex flex-col animate-[fadeIn_0.3s_ease-out]">
              <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Personalize
              </h2>
              <p className="mb-6 text-center text-sm text-white/50">
                Make it yours. You can change these anytime in settings.
              </p>

              {/* AI Name input */}
              <label
                htmlFor="ai-name"
                className="mb-1.5 text-sm font-medium text-white/70"
              >
                AI Name
              </label>
              <input
                id="ai-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cortex"
                className="mb-5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
              />

              {/* Personality textarea */}
              <label
                htmlFor="ai-personality"
                className="mb-1.5 text-sm font-medium text-white/70"
              >
                Personality
              </label>
              <textarea
                id="ai-personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm leading-relaxed text-white placeholder-white/30 outline-none transition-colors focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
              />
            </div>
          )}

          {/* ---- Step 3: Ready ---- */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
              {/* Checkmark circle */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] shadow-lg shadow-purple-500/25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                You're all set!
              </h2>

              <p className="mb-4 max-w-sm text-base leading-relaxed text-white/60">
                Start chatting with{' '}
                <span className="font-semibold text-white/80">{name || 'Cortex'}</span>{' '}
                Free, or bring your own API keys for more models.
              </p>

              <p className="max-w-sm text-sm text-white/40">
                You can always update your preferences from the settings menu.
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {/* Back button -- only visible on steps 2 and 3 */}
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white/80"
            >
              Back
            </button>
          ) : (
            /* Invisible spacer to keep the Continue button right-aligned on step 1 */
            <div />
          )}

          {/* Continue / Start Chatting button */}
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            {step === TOTAL_STEPS - 1 ? 'Start Chatting' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Inline keyframes for the fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingWizard;
