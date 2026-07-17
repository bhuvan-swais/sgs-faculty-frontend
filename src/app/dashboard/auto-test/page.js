"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("swais_faculty_token") : null;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QTYPES = ["MCQ", "True/False", "Short Answer"];

/* ─── Configure Step ──────────────────────────────────────── */
function ConfigStep({ chapters, onGenerate }) {
  const [chapterId,  setChapterId]  = useState(chapters[0]?.chapter_id ?? "");
  const [difficulty, setDifficulty] = useState("Medium");
  const [qtype,      setQtype]      = useState("");        // empty = not selected
  const [totalMarks, setTotalMarks] = useState(50);

  const selectedChapter = chapters.find(c => c.chapter_id === chapterId);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xl mx-auto"
      style={{ border: "1px solid rgba(99,102,241,0.1)" }}>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center pulse-glow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
            Configure Your Test
          </h2>
          <p className="text-xs" style={{ color: "#94A3B8" }}>Select chapter, difficulty, and total marks</p>
        </div>
      </div>

      <div className="space-y-5">

        {/* Chapter */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>📖 Chapter</label>
          <select value={chapterId} onChange={e => setChapterId(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer"
            style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", background: "#F8FAFC" }}
            onFocus={e => { e.target.style.border = "1.5px solid #6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e  => { e.target.style.border = "1.5px solid #E2E8F0"; e.target.style.boxShadow = "none"; }}>
            {chapters.map(c => (
              <option key={c.chapter_id} value={c.chapter_id}>{c.content_title}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>🎯 Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map(d => {
              const colors = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };
              const bgs    = { Easy: "#ECFDF5", Medium: "#FFFBEB", Hard: "#FEF2F2" };
              const active = difficulty === d;
              return (
                <button key={d} onClick={() => setDifficulty(d)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer"
                  style={active
                    ? { background: bgs[d], color: colors[d], border: `1.5px solid ${colors[d]}`, boxShadow: `0 4px 12px ${colors[d]}33` }
                    : { background: "#F8FAFC", color: "#64748B", border: "1.5px solid #E2E8F0" }}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Type (optional) */}
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "#374151" }}>
            🧩 Question Type
            <span className="ml-2 text-xs font-normal" style={{ color: "#94A3B8" }}>(optional)</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {QTYPES.map(t => (
              <button key={t} onClick={() => setQtype(prev => prev === t ? "" : t)}
                className="py-2.5 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer"
                style={qtype === t
                  ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }
                  : { background: "#F8FAFC", color: "#64748B", border: "1.5px solid #E2E8F0" }}
                  >
                {t}
              </button>
            ))}
            <button onClick={() => setQtype("")}
              className="py-2.5 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer"
              style={qtype === ""
                ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }
                : { background: "#F8FAFC", color: "#64748B", border: "1.5px solid #E2E8F0" }}>
              All
            </button>
          </div>
        </div>

        {/* Total Marks slider */}
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center justify-between" style={{ color: "#374151" }}>
            <span>🔢 Total Marks</span>
            <span className="font-bold" style={{ color: "#6366F1" }}>{totalMarks}</span>
          </label>
          <input type="range" min={10} max={100} step={10} value={totalMarks}
            onChange={e => setTotalMarks(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "#6366F1" }} />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: "#94A3B8" }}>
            <span>10</span><span>100</span>
          </div>
        </div>

        {/* Preview info */}
        <div className="p-3.5 rounded-xl flex items-start gap-2.5"
          style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", border: "1px solid #DDD6FE" }}>
          <span className="text-sm mt-0.5">⚡</span>
          <div>
            <p className="text-xs font-bold" style={{ color: "#6366F1" }}>AI will generate:</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              <span className="font-semibold">{difficulty}</span> · {totalMarks} marks ·{" "}
              <span className="font-semibold">{qtype || "All question types"}</span> ·{" "}
              {selectedChapter?.chapter_name || "Selected chapter"}
            </p>
          </div>
        </div>

        <button
          onClick={() => onGenerate({ chapterId, chapterName: selectedChapter?.content_title || "", difficulty, totalMarks, qtype })}
          disabled={!chapterId}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer ai-gradient hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
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
    "Applying difficulty settings…",
    "Generating questions with AI…",
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
        {config.difficulty} · {config.totalMarks} marks · {config.chapterName}
      </p>
      <div className="space-y-2.5 text-left">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 0.3}s` }}>
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

/* ─── Question Card ───────────────────────────────────────── */
function QuestionCard({ question, index }) {
  // Normalise whatever shape Node.js returns
  const text    = question.question ?? question.q ?? question.questionText ?? `Question ${index + 1}`;
  const options = question.options ?? question.opts ?? question.choices ?? [];
  const answer  = question.answer ?? question.ans ?? question.correctAnswer ?? question.correct_answer ?? null;
  const marks   = question.marks ?? question.maxMarks ?? question.max_marks ?? null;
  const type    = question.type ?? question.questionType ?? "";

  return (
    <div className="bg-white rounded-xl p-5 transition-all"
      style={{ border: "1px solid rgba(99,102,241,0.08)" }}>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-lg ai-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{text}</p>
            {marks && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "#EEF2FF", color: "#6366F1" }}>{marks}m</span>
            )}
          </div>

          {/* MCQ options */}
          {options.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {options.map((opt, oi) => {
                const optText = typeof opt === "object" ? (opt.text ?? opt.label ?? JSON.stringify(opt)) : opt;
                const isCorrect = answer !== null && (
                  oi === answer || optText === answer ||
                  String(oi) === String(answer) ||
                  optText?.toLowerCase() === String(answer)?.toLowerCase()
                );
                return (
                  <div key={oi} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{
                      background: isCorrect ? "#ECFDF5" : "#F8FAFC",
                      border: `1px solid ${isCorrect ? "#A7F3D0" : "#E2E8F0"}`,
                      color: isCorrect ? "#059669" : "#64748B",
                      fontWeight: isCorrect ? 600 : 400,
                    }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: isCorrect ? "#059669" : "#E2E8F0", color: isCorrect ? "#fff" : "#94A3B8" }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {optText}
                    {isCorrect && <span className="ml-auto">✓</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* True/False */}
          {options.length === 0 && (answer === true || answer === false || answer === "true" || answer === "false" || answer === "True" || answer === "False") && (
            <div className="flex gap-2 mt-1">
              {[true, false].map(v => {
                const isAns = String(v) === String(answer)?.toLowerCase() || v === answer;
                return (
                  <span key={String(v)} className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={isAns
                      ? { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }
                      : { background: "#F8FAFC", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
                    {v ? "True" : "False"} {isAns && "✓"}
                  </span>
                );
              })}
            </div>
          )}

          {/* Short answer / answer text */}
          {answer && options.length === 0 && answer !== true && answer !== false && answer !== "true" && answer !== "false" && (
            <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#059669" }}>Answer</p>
              <p className="text-xs" style={{ color: "#065F46" }}>{String(answer)}</p>
            </div>
          )}

          {/* No answer provided — write space */}
          {!answer && options.length === 0 && (
            <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Answer Space</p>
              <div className="h-10 rounded" style={{ background: "repeating-linear-gradient(transparent, transparent 19px, #E2E8F0 19px, #E2E8F0 20px)" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Step ────────────────────────────────────────── */
function PreviewStep({ config, questions, rawResponse, onReset }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        <p className="text-sm" style={{ color: "#94A3B8" }}>Added to your Assessments dashboard.</p>
      </div>
    );
  }

  // If no structured questions, show raw AI response
  if (questions.length === 0 && rawResponse) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between"
          style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
          <h2 className="text-base font-bold" style={{ color: "#0F172A" }}>AI Generated Test</h2>
          <button onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            style={{ background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}>
            ← Reconfigure
          </button>
        </div>
        <div className="bg-white rounded-2xl p-6 whitespace-pre-wrap text-sm"
          style={{ border: "1px solid rgba(99,102,241,0.1)", color: "#1E293B", lineHeight: 1.7 }}>
          {typeof rawResponse === "string" ? rawResponse : JSON.stringify(rawResponse, null, 2)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between"
        style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "#EEF2FF", color: "#6366F1" }}>{config.difficulty}</span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#64748B" }}>{config.totalMarks} marks</span>
            {config.qtype && (
              <><span className="text-xs" style={{ color: "#94A3B8" }}>·</span>
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>{config.qtype}</span></>
            )}
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
            💾 Save
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => <QuestionCard key={idx} question={q} index={idx} />)}
      </div>

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
  const [step,        setStep]        = useState(0);
  const [config,      setConfig]      = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [rawResponse, setRawResponse] = useState(null);
  const [error,       setError]       = useState("");
  const [chapters,    setChapters]    = useState([]);

  useEffect(() => {
    const token = getToken();
    fetch(`${API}/api/v1/chapters`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => { if (d?.chapters?.length) setChapters(d.chapters); })
      .catch(() => {});
  }, []);

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    setError("");
    setStep(1);

    try {
      const token = getToken();
      const body = {
        chapterId:  cfg.chapterId,
        difficulty: cfg.difficulty,
        totalMarks: cfg.totalMarks,
        questionType: cfg.qtype || null,   // null / omitted = all question types
      };

      const res = await fetch(`${API}/api/v1/question-papers/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || `Error ${res.status}`);
      }

      // Normalise response — Node.js might return questions in various shapes
      const qs =
        Array.isArray(data)                          ? data :
        Array.isArray(data?.questions)               ? data.questions :
        Array.isArray(data?.data)                    ? data.data :
        Array.isArray(data?.questionPaper)           ? data.questionPaper :
        Array.isArray(data?.question_paper)          ? data.question_paper :
        null;

      setRawResponse(qs ? null : data);
      setQuestions(qs ?? []);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to generate test. Please try again.");
      setStep(0);
    }
  };

  const handleReset = () => {
    setStep(0);
    setConfig(null);
    setQuestions([]);
    setRawResponse(null);
    setError("");
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
            AI-powered question paper generation
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

      {/* Error banner */}
      {error && (
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <svg className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm" style={{ color: "#991B1B" }}>{error}</p>
        </div>
      )}

      {step === 0 && <ConfigStep chapters={chapters} onGenerate={handleGenerate} />}
      {step === 1 && <GeneratingStep config={config} />}
      {step === 2 && (
        <PreviewStep
          config={config}
          questions={questions}
          rawResponse={rawResponse}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
