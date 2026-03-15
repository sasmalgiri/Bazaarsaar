'use client';

import { useRouter } from 'next/navigation';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';

const NEXT_STEPS = [
  {
    num: '1',
    title: 'Import your trades',
    titleHi: 'अपने trades लाएं',
    desc: 'Go to Settings → connect your Zerodha account, or upload an Excel/CSV file of your past trades. A CSV is just a spreadsheet file — Zerodha lets you download one.',
    descHi: 'Settings में जाएं → Zerodha जोड़ें, या अपनी trades की Excel/CSV फ़ाइल upload करें।',
  },
  {
    num: '2',
    title: 'Write a note on your first trade',
    titleHi: 'पहले trade पर नोट लिखें',
    desc: 'Click any trade and write: Why did I buy this? How was I feeling? This is called "journaling" — it helps you spot patterns in your decisions.',
    descHi: 'किसी trade पर click करें और लिखें: मैंने ये क्यों खरीदा? मेरा मूड कैसा था? इसे "journaling" कहते हैं।',
  },
  {
    num: '3',
    title: 'Pick a checklist (Playbook)',
    titleHi: 'एक checklist चुनें (Playbook)',
    desc: 'A "playbook" is just a checklist of rules you follow before buying or selling. Like: "Is the price above average? Is there enough volume?" Pick one to start.',
    descHi: '"Playbook" = खरीदने/बेचने से पहले check करने वाले rules की list। एक चुनें।',
  },
  {
    num: '4',
    title: 'Check your Weekly Report Card',
    titleHi: 'अपनी Weekly Report Card देखें',
    desc: 'Every Monday, we show you a simple report: How many trades did you win? Were you calm or stressed? Which approach worked best? Like a school report card for trading.',
    descHi: 'हर सोमवार एक report: कितने trades जीते? शांत थे या तनाव में? कौन सा तरीका सबसे अच्छा रहा?',
  },
];

export function OnboardingComplete() {
  const router = useRouter();
  const { persona, watchlist, setOnboardingCompleted } = usePersonaStore();

  if (!persona) return null;

  const config = PERSONA_CONFIGS[persona];

  const handleEnter = () => {
    setOnboardingCompleted(true);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-[520px] mx-auto text-center animate-fade-in">
      <div className="text-6xl mb-4">{config.icon}</div>
      <h2 className="text-4xl font-bold text-[#fafaff] mb-2">You&apos;re all set!</h2>
      <p className="text-sm text-amber-500/70 mb-1" lang="hi">आप तैयार हैं!</p>
      <p className="text-[#6b6b8a] mb-2">
        Your <span className="text-[#d4d4e8] font-medium">{config.label}</span> dashboard is ready
        {watchlist.length > 0 && <> with <span className="font-mono text-[#d4d4e8]">{watchlist.length}</span> stocks to watch</>}.
      </p>
      <p className="text-[11px] text-amber-500/50 mb-8" lang="hi">
        आपका dashboard तैयार है{watchlist.length > 0 ? ` — ${watchlist.length} stocks देखने के लिए` : ''}।
      </p>

      {/* What happens next — explained like a guide */}
      <div className="p-6 rounded-2xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] text-left mb-4">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
          What to do next (4 simple steps)
        </h3>
        <p className="text-[10px] text-amber-500/40 mb-5" lang="hi">आगे क्या करें (4 आसान steps)</p>
        <div className="flex flex-col gap-5">
          {NEXT_STEPS.map((step) => (
            <div key={step.title} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step.num}
              </span>
              <div>
                <div className="text-sm font-medium text-[#d4d4e8] mb-0.5">{step.title}</div>
                <div className="text-[10px] text-amber-500/50 mb-1" lang="hi">{step.titleHi}</div>
                <div className="text-xs text-[#6b6b8a] leading-relaxed">{step.desc}</div>
                <div className="text-[10px] text-amber-500/40 mt-0.5 leading-relaxed" lang="hi">{step.descHi}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#4a4a6a] mb-6">
        Don&apos;t worry about doing everything today. Just explore at your own pace.
        <span className="text-amber-500/50 ml-1" lang="hi">सब कुछ आज करने की ज़रूरत नहीं। अपनी रफ़्तार से चलें।</span>
      </p>

      <button
        onClick={handleEnter}
        className="px-8 py-3.5 rounded-xl text-sm font-semibold border-none cursor-pointer text-white transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.35)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.25)'; }}
      >
        Enter BazaarSaar &rarr;
      </button>

      <p className="text-[10px] text-[#4a4a6a] mt-4">
        You can always change your preferences in Settings.
        <span className="text-amber-500/40 ml-1" lang="hi">Settings में कभी भी बदल सकते हैं।</span>
      </p>
    </div>
  );
}
