"use client";

import { useState } from "react";

/* ─── Static Question Bank ────────────────────────────────── */
const QUESTION_BANK = {
  "Chapter 1 — How, When and Where": {
    MCQ: [
      { q: "Who wrote the book 'The Discovery of India'?", opts: ["Jawaharlal Nehru", "Mahatma Gandhi", "B.R. Ambedkar", "Rabindranath Tagore"], ans: 0 },
      { q: "Which year did the British East India Company establish its first factory in India?", opts: ["1600", "1608", "1612", "1700"], ans: 2 },
      { q: "James Mill divided Indian history into how many periods?", opts: ["Two", "Three", "Four", "Five"], ans: 1 },
      { q: "The term 'medieval' in European history usually refers to which period?", opts: ["500–1500 CE", "1000–1500 CE", "300–900 CE", "1500–1800 CE"], ans: 0 },
      { q: "Which British official wrote the book 'The History of British India' in 1817?", opts: ["Warren Hastings", "James Mill", "Lord Dalhousie", "Lord Cornwallis"], ans: 1 },
      { q: "The National Archives of India is located in which city?", opts: ["Mumbai", "Kolkata", "Chennai", "New Delhi"], ans: 3 },
    ],
    "True/False": [
      { q: "James Mill was a British historian and economist.", ans: true },
      { q: "The British divided Indian history into Hindu, Muslim and British periods.", ans: true },
      { q: "Coins and inscriptions are considered unofficial records by historians.", ans: false },
      { q: "Before colonial rule, Indians had no sense of their own past.", ans: false },
      { q: "The Asiatic Society of Bengal was set up in 1784.", ans: true },
    ],
    "Short Answer": [
      { q: "Why did the British consider the act of survey important for effective administration?" },
      { q: "What were the problems with the periodisation of Indian history by British historians?" },
      { q: "How did the information gathered by colonial administrators help them govern India?" },
      { q: "What do diaries, autobiographies and memoirs tell us about life in colonial times?" },
    ],
  },
  "Chapter 3 — Ruling the Countryside": {
    MCQ: [
      { q: "The Permanent Settlement of Bengal was introduced in which year?", opts: ["1793", "1820", "1857", "1765"], ans: 0 },
      { q: "Under the Permanent Settlement, who was recognised as the owner of the land?", opts: ["Peasants", "Zamindars", "The British Crown", "Village headmen"], ans: 1 },
      { q: "The indigo plant produces which colour of dye?", opts: ["Red", "Blue", "Yellow", "Green"], ans: 1 },
      { q: "Which system gave the cultivator more security of tenure than the Permanent Settlement?", opts: ["Ryotwari system", "Mahalwari system", "Zamindari system", "None of the above"], ans: 0 },
      { q: "The Blue Rebellion (Nil Darpan) was a revolt by which community?", opts: ["Zamindars", "Indigo planters", "Indigo peasants", "Village headmen"], ans: 2 },
      { q: "Where was indigo cultivated extensively in Bengal?", opts: ["Bardhaman", "Nadia and Jessore", "Midnapore", "Howrah"], ans: 1 },
    ],
    "True/False": [
      { q: "The Permanent Settlement fixed the revenue that zamindars had to pay to the British forever.", ans: true },
      { q: "Indigo was used to produce a red dye.", ans: false },
      { q: "Ryots who grew indigo were often forced to sign contracts with European planters.", ans: true },
      { q: "The Mahalwari system was introduced by Thomas Munro in Madras.", ans: false },
      { q: "The Nil Darpan play depicted the miserable condition of indigo farmers.", ans: true },
    ],
    "Short Answer": [
      { q: "What was the Permanent Settlement? Who introduced it and what were its main provisions?" },
      { q: "Why were ryots reluctant to grow indigo? Explain the nij and ryoti cultivation systems." },
      { q: "How did the introduction of the Ryotwari system differ from the Permanent Settlement?" },
      { q: "Describe the Blue Rebellion of 1859. Why did ryots refuse to grow indigo?" },
    ],
  },
  "Chapter 5 — When People Rebel": {
    MCQ: [
      { q: "The Revolt of 1857 began on which date?", opts: ["10 May 1857", "26 January 1857", "15 August 1857", "23 March 1857"], ans: 0 },
      { q: "Where did the Revolt of 1857 begin?", opts: ["Delhi", "Meerut", "Lucknow", "Kanpur"], ans: 1 },
      { q: "Who was the last Mughal Emperor?", opts: ["Aurangzeb", "Shah Jahan", "Bahadur Shah Zafar", "Akbar II"], ans: 2 },
      { q: "The sepoys who refused to use the new cartridges were given how many years of imprisonment?", opts: ["5 years", "10 years", "Life imprisonment", "They were shot"], ans: 1 },
      { q: "Who led the revolt in Lucknow?", opts: ["Nana Sahib", "Begum Hazrat Mahal", "Tantia Tope", "Mangal Pandey"], ans: 1 },
      { q: "After 1857, the British Crown took over power in India from which entity?", opts: ["East India Company", "The Mughal Emperor", "The Indian National Congress", "The Board of Control"], ans: 0 },
    ],
    "True/False": [
      { q: "The cartridges for the new Enfield rifle were greased with the fat of cows and pigs.", ans: true },
      { q: "Mangal Pandey was executed for shooting at his British sergeant.", ans: true },
      { q: "The British decided to respect all existing customs and traditions of India after 1857.", ans: false },
      { q: "After 1857, the Mughal dynasty continued to rule parts of India.", ans: false },
      { q: "The sepoys' primary grievance was about their salaries being cut.", ans: false },
    ],
    "Short Answer": [
      { q: "What were the causes of the Revolt of 1857? Mention both military and civilian grievances." },
      { q: "How did the British respond to the Revolt of 1857 in terms of policy changes?" },
      { q: "Why was Bahadur Shah Zafar an important figure in the Revolt of 1857?" },
      { q: "Describe how the revolt spread from Meerut to other parts of India." },
    ],
  },
};

const CHAPTERS = Object.keys(QUESTION_BANK);
const QTYPES   = ["MCQ", "True/False", "Short Answer"];

/* ─── Steps ───────────────────────────────────────────────── */
// 0 = configure, 1 = generating (fake loading), 2 = preview/save, 3 = saved

/* ─── Configure Step ──────────────────────────────────────── */
function ConfigStep({ onGenerate }) {
  const [chapter, setChapter] = useState(CHAPTERS[0]);
  const [qtype,   setQtype]   = useState("MCQ");
  const [count,   setCount]   = useState(5);

  const maxQ = chapter && qtype ? (QUESTION_BANK[chapter]?.[qtype]?.length ?? 0) : 0;
  const effectiveCount = Math.min(count, maxQ);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xl mx-auto"
      style={{ border: "1px solid rgba(99,102,241,0.1)" }}>

      {/* Decorative header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center pulse-glow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
            Configure Your Test
          </h2>
          <p className="text-xs" style={{ color: "#94A3B8" }}>Select chapter, type, and question count</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Chapter */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            📖 Chapter
          </label>
          <select value={chapter} onChange={e => setChapter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer"
            style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", background: "#F8FAFC" }}
            onFocus={e => { e.target.style.border = "1.5px solid #6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.border = "1.5px solid #E2E8F0"; e.target.style.boxShadow = "none"; }}>
            {CHAPTERS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            🧩 Question Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {QTYPES.map(t => (
              <button key={t} onClick={() => setQtype(t)}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer"
                style={qtype === t
                  ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }
                  : { background: "#F8FAFC", color: "#64748B", border: "1.5px solid #E2E8F0" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count slider */}
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center justify-between" style={{ color: "#374151" }}>
            <span>🔢 Number of Questions</span>
            <span className="text-indigo-600 font-bold">{effectiveCount}</span>
          </label>
          <input type="range" min={1} max={maxQ || 6} value={effectiveCount}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "#6366F1" }} />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: "#94A3B8" }}>
            <span>1</span>
            <span>{maxQ} available</span>
          </div>
        </div>

        {/* Preview info */}
        <div className="p-3.5 rounded-xl flex items-start gap-2.5"
          style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", border: "1px solid #DDD6FE" }}>
          <span className="text-sm mt-0.5">⚡</span>
          <div>
            <p className="text-xs font-bold" style={{ color: "#6366F1" }}>AI will generate:</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              {effectiveCount} {qtype} question{effectiveCount !== 1 ? "s" : ""} from <span className="font-semibold">{chapter.split("—")[0].trim()}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onGenerate({ chapter, qtype, count: effectiveCount })}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer ai-gradient hover:opacity-90 active:scale-[0.98]"
          style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
          ✨ Generate Test
        </button>
      </div>
    </div>
  );
}

/* ─── Generating Step ─────────────────────────────────────── */
function GeneratingStep({ config }) {
  const steps = [
    "Analysing chapter content…",
    "Selecting relevant questions…",
    "Checking difficulty balance…",
    "Preparing answer key…",
    "Finalising test paper…",
  ];

  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm max-w-xl mx-auto text-center"
      style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
      <div className="w-16 h-16 rounded-2xl ai-gradient mx-auto mb-5 flex items-center justify-center pulse-glow">
        <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <h2 className="text-lg font-bold mb-1" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
        AI is generating your test…
      </h2>
      <p className="text-xs mb-8" style={{ color: "#94A3B8" }}>
        {config.count} {config.qtype} questions · {config.chapter.split("—")[0].trim()}
      </p>

      <div className="space-y-2.5 text-left">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className="w-4 h-4 rounded-full ai-gradient flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs" style={{ color: "#64748B" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Preview Step ────────────────────────────────────────── */
function PreviewStep({ config, questions, onSave, onReset }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(onSave, 1800);
  };

  if (saved) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm max-w-xl mx-auto text-center"
        style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
          style={{ background: "#ECFDF5" }}>✅</div>
        <h2 className="text-lg font-bold mb-1" style={{ color: "#059669", fontFamily: "var(--font-space-grotesk)" }}>
          Test Saved!
        </h2>
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          Added to your Assessments dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Preview header */}
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between"
        style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "#EEF2FF", color: "#6366F1" }}>{config.qtype}</span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#64748B" }}>{config.chapter.split("—")[0].trim()}</span>
          </div>
          <h2 className="text-base font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
            Test Preview — {questions.length} Questions
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            style={{ background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#EEF2FF"; e.currentTarget.style.color = "#6366F1"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}>
            ← Reconfigure
          </button>
          <button onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer ai-gradient hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
            💾 Save as Assessment
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 transition-all"
            style={{ border: "1px solid rgba(99,102,241,0.08)" }}>
            <div className="flex gap-3">
              {/* Question number */}
              <div className="w-7 h-7 rounded-lg ai-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2" style={{ color: "#0F172A" }}>{q.q}</p>

                {/* MCQ options */}
                {config.qtype === "MCQ" && q.opts && (
                  <div className="grid grid-cols-2 gap-1.5">
                    {q.opts.map((opt, oi) => (
                      <div key={oi}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                        style={{
                          background: oi === q.ans ? "#ECFDF5" : "#F8FAFC",
                          border: `1px solid ${oi === q.ans ? "#A7F3D0" : "#E2E8F0"}`,
                          color: oi === q.ans ? "#059669" : "#64748B",
                          fontWeight: oi === q.ans ? 600 : 400,
                        }}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: oi === q.ans ? "#059669" : "#E2E8F0", color: oi === q.ans ? "#fff" : "#94A3B8" }}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                        {oi === q.ans && <span className="ml-auto">✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {config.qtype === "True/False" && (
                  <div className="flex gap-2 mt-1">
                    {[true, false].map(v => (
                      <span key={String(v)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={v === q.ans
                          ? { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }
                          : { background: "#F8FAFC", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
                        {v ? "True" : "False"} {v === q.ans && "✓"}
                      </span>
                    ))}
                    <span className="ml-2 text-xs self-center" style={{ color: "#94A3B8" }}>
                      Answer: <strong style={{ color: q.ans ? "#059669" : "#EF4444" }}>{q.ans ? "True" : "False"}</strong>
                    </span>
                  </div>
                )}

                {/* Short Answer */}
                {config.qtype === "Short Answer" && (
                  <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>
                      Answer Space
                    </p>
                    <div className="h-10 rounded" style={{ background: "repeating-linear-gradient(transparent, transparent 19px, #E2E8F0 19px, #E2E8F0 20px)" }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <div className="bg-white rounded-2xl p-4 flex justify-end"
        style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
        <button onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer ai-gradient hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
          💾 Save as Assessment
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function AutoTestPage() {
  const [step,      setStep]      = useState(0);  // 0 config, 1 loading, 2 preview, 3 saved
  const [config,    setConfig]    = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleGenerate = (cfg) => {
    setConfig(cfg);
    setStep(1);

    // Simulate AI generation delay
    const bank = QUESTION_BANK[cfg.chapter]?.[cfg.qtype] ?? [];
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, cfg.count);

    setTimeout(() => {
      setQuestions(shuffled);
      setStep(2);
    }, 2200);
  };

  const handleSave = () => {
    setTimeout(() => {
      setStep(0);
      setConfig(null);
      setQuestions([]);
    }, 1200);
  };

  const handleReset = () => {
    setStep(0);
    setConfig(null);
    setQuestions([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
              Auto Test Generation
            </h1>
          </div>
          <p className="text-sm pl-10" style={{ color: "#94A3B8" }}>
            AI-powered question paper generation · Class 8 Social Studies
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {["Configure", "Generating", "Preview"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px" style={{ background: step > i - 1 ? "#6366F1" : "#E2E8F0" }} />}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={step === i
                    ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff" }
                    : step > i
                    ? { background: "#ECFDF5", color: "#059669" }
                    : { background: "#F1F5F9", color: "#94A3B8" }}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block"
                  style={{ color: step === i ? "#6366F1" : step > i ? "#059669" : "#94A3B8" }}>{s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter quick-pick cards */}
      {step === 0 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[
            { ch: CHAPTERS[0], emoji: "📅", desc: "How historians study the past" },
            { ch: CHAPTERS[1], emoji: "🌾", desc: "Land revenue & indigo farming" },
            { ch: CHAPTERS[2], emoji: "⚔️", desc: "Revolt of 1857" },
          ].map(({ ch, emoji, desc }) => (
            <div key={ch} className="rounded-xl p-3.5 cursor-pointer transition-all"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
              onClick={() => {}}
            >
              <span className="text-xl mb-1.5 block">{emoji}</span>
              <p className="text-xs font-bold" style={{ color: "#0F172A" }}>{ch.split("—")[0].trim()}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{desc}</p>
              <p className="text-[10px] mt-1.5 font-semibold" style={{ color: "#6366F1" }}>
                {QUESTION_BANK[ch] ? Object.values(QUESTION_BANK[ch]).reduce((s, q) => s + q.length, 0) : 0} questions
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Steps */}
      {step === 0 && <ConfigStep onGenerate={handleGenerate} />}
      {step === 1 && <GeneratingStep config={config} />}
      {step === 2 && <PreviewStep config={config} questions={questions} onSave={handleSave} onReset={handleReset} />}
    </div>
  );
}
