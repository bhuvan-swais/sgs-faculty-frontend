"use client";

import { useState, useEffect, useMemo } from "react";
import { FALLBACK_ASSESSMENTS, FALLBACK_ASSESSMENT_RESULTS } from "@/lib/staticData";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const TYPE_CONFIG = {
  quiz:       { label: "Quiz",       bg: "#F5F3FF", color: "#8B5CF6", dot: "#8B5CF6" },
  test:       { label: "Test",       bg: "#EEF2FF", color: "#6366F1", dot: "#6366F1" },
  exam:       { label: "Exam",       bg: "#FEF2F2", color: "#EF4444", dot: "#EF4444" },
  assignment: { label: "Assignment", bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B" },
};

const GRADE_STYLE = {
  "A+": { color: "#10B981", bg: "#ECFDF5", band: "#10B981" },
  "A":  { color: "#10B981", bg: "#ECFDF5", band: "#34D399" },
  "B":  { color: "#6366F1", bg: "#EEF2FF", band: "#818CF8" },
  "C":  { color: "#F59E0B", bg: "#FFFBEB", band: "#FBBF24" },
  "D":  { color: "#EF4444", bg: "#FEF2F2", band: "#F87171" },
  "—":  { color: "#94A3B8", bg: "#F8FAFC", band: "#CBD5E1" },
};

function getGrade(pct) {
  if (pct === null || pct === undefined) return "—";
  if (pct >= 90) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 60) return "B";
  if (pct >= 45) return "C";
  return "D";
}

/* ── Distribution Bar ─────────────────────────────────────────── */
function DistBar({ dist, total }) {
  const order = ["A+", "A", "B", "C", "D"];
  const safeTotal = total || 1;
  return (
    <div className="flex h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
      {order.map(g => {
        const count = dist[g] || 0;
        if (!count) return null;
        const pct = (count / safeTotal) * 100;
        return (
          <div key={g} title={`${g}: ${count}`}
            className="h-full transition-all"
            style={{ width: `${pct}%`, background: GRADE_STYLE[g].band }} />
        );
      })}
    </div>
  );
}

/* ── Average Pill ─────────────────────────────────────────────── */
function AvgPill({ avg, max }) {
  if (avg == null) return <span className="text-xs" style={{ color: "#94A3B8" }}>No avg yet</span>;
  const pct = max ? Math.round((avg / max) * 100) : 0;
  const grade = getGrade(pct);
  const gs = GRADE_STYLE[grade];
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: gs.band }} />
      <span className="text-xs font-bold" style={{ color: gs.color }}>{avg} / {max}</span>
      <span className="text-[10px] font-semibold" style={{ color: gs.color, opacity: 0.7 }}>· {pct}%</span>
    </div>
  );
}

/* ── Result Drawer (with star, at-risk, distribution) ─────────── */
function ResultDrawer({ assessment, onClose }) {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("swais_faculty_token");
    if (!token) {
      // No token — use static fallback results directly
      const fallback = FALLBACK_ASSESSMENT_RESULTS[assessment.assessment_id];
      setDetail(fallback ? { ...assessment, ...fallback } : { ...assessment, results: [] });
      setLoading(false);
      return;
    }
    fetch(`${API}/api/v1/assessments/${assessment.assessment_id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) {
          const b = await r.json().catch(() => ({}));
          throw new Error(b.detail || `Error ${r.status}`);
        }
        return r.json();
      })
      .then(setDetail)
      .catch(() => {
        // API unavailable — fall back to static results
        const fallback = FALLBACK_ASSESSMENT_RESULTS[assessment.assessment_id];
        setDetail(fallback ? { ...assessment, ...fallback } : { ...assessment, results: [] });
      })
      .finally(() => setLoading(false));
  }, [assessment.assessment_id]);

  const cfg = TYPE_CONFIG[assessment.assessment_type] || TYPE_CONFIG.test;

  // Compute star performer + at-risk + distribution from results
  const { star, atRisk, dist, presentCount } = useMemo(() => {
    const results = detail?.results || [];
    const present = results.filter(r => r.marks_obtained != null);
    const sorted  = [...present].sort((a, b) => (b.marks_obtained ?? 0) - (a.marks_obtained ?? 0));
    const d = { "A+": 0, "A": 0, "B": 0, "C": 0, "D": 0 };
    present.forEach(r => {
      const g = getGrade(r.percentage);
      if (d[g] !== undefined) d[g]++;
    });
    return {
      star:   sorted[0] || null,
      atRisk: sorted[sorted.length - 1] || null,
      dist:   d,
      presentCount: present.length,
    };
  }, [detail]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
        style={{ animation: "slideInRight 0.25s ease-out" }}>

        <div className="absolute top-0 left-0 right-0 h-1 ai-gradient" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
                style={{ background: cfg.bg, color: cfg.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                {cfg.label}
              </span>
              <h2 className="text-base font-bold leading-snug" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
                {assessment.title}
              </h2>
              {assessment.chapter && (
                <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{assessment.chapter}</p>
              )}
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-lg cursor-pointer transition-all"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: "Max Marks", value: assessment.max_marks },
              { label: "Submitted", value: `${assessment.submitted}/${assessment.total_students}` },
              { label: "Avg Score", value: assessment.class_average ?? "—", highlight: true },
            ].map(m => (
              <div key={m.label} className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: m.highlight ? "#EEF2FF" : "#F8FAFC",
                  border: "1px solid",
                  borderColor: m.highlight ? "#C7D2FE" : "#E2E8F0",
                }}>
                <span style={{ color: "#94A3B8" }}>{m.label}: </span>
                <span className="font-bold" style={{ color: m.highlight ? "#6366F1" : "#0F172A" }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 rounded-full ai-gradient mx-auto mb-3 animate-pulse" />
              <p className="text-sm" style={{ color: "#94A3B8" }}>Loading results…</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm" style={{ color: "#EF4444" }}>{error}</div>
          ) : (
            <>
              {/* Star + At-risk strip */}
              {presentCount > 0 && (
                <div className="px-5 pt-5 pb-3 grid grid-cols-2 gap-3">
                  {star && (
                    <div className="rounded-xl p-3"
                      style={{ background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "1px solid #FCD34D" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#D97706" }}>
                        ⭐ Star Performer
                      </p>
                      <p className="text-sm font-bold leading-tight" style={{ color: "#0F172A" }}>{star.student_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#92400E" }}>
                        {star.marks_obtained}/{assessment.max_marks} · {star.percentage}%
                      </p>
                    </div>
                  )}
                  {atRisk && atRisk.result_id !== star?.result_id && (
                    <div className="rounded-xl p-3"
                      style={{ background: "linear-gradient(135deg,#FEF2F2,#FEE2E2)", border: "1px solid #FCA5A5" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#DC2626" }}>
                        ⚠️ Needs Attention
                      </p>
                      <p className="text-sm font-bold leading-tight" style={{ color: "#0F172A" }}>{atRisk.student_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#991B1B" }}>
                        {atRisk.marks_obtained}/{assessment.max_marks} · {atRisk.percentage}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Distribution */}
              {presentCount > 0 && (
                <div className="px-5 pb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>
                    Grade Distribution
                  </p>
                  <DistBar dist={dist} total={presentCount} />
                  <div className="flex flex-wrap gap-3 mt-2">
                    {["A+", "A", "B", "C", "D"].map(g => (
                      <div key={g} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: GRADE_STYLE[g].band }} />
                        <span className="text-[10px] font-semibold" style={{ color: "#475569" }}>
                          {g} <span style={{ color: "#94A3B8" }}>· {dist[g] || 0}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results table */}
              <table className="w-full text-sm">
                <thead className="sticky top-0" style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                  <tr>
                    {["Roll", "Name", "Marks", "%", "Grade"].map((h, i) => (
                      <th key={h} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest ${i >= 2 ? "text-right" : "text-left"} ${i === 4 ? "text-center" : ""}`}
                        style={{ color: "#6366F1" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail?.results?.map((r) => {
                    const grade = getGrade(r.percentage);
                    const gs = GRADE_STYLE[grade];
                    const isStar    = star?.result_id   === r.result_id;
                    const isAtRisk  = atRisk?.result_id === r.result_id && !isStar;
                    return (
                      <tr key={r.result_id}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          background: isStar ? "#FFFBEB30" : isAtRisk ? "#FEF2F230" : "transparent",
                        }}
                        onMouseEnter={e => { if (!isStar && !isAtRisk) e.currentTarget.style.background = "#EEF2FF40"; }}
                        onMouseLeave={e => { if (!isStar && !isAtRisk) e.currentTarget.style.background = "transparent"; }}>
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "#94A3B8" }}>{r.roll_number}</td>
                        <td className="px-4 py-2.5 font-medium" style={{ color: "#0F172A" }}>
                          <span className="inline-flex items-center gap-1">
                            {isStar   && <span title="Star performer">⭐</span>}
                            {isAtRisk && <span title="Needs attention">⚠️</span>}
                            {r.student_name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {r.marks_obtained !== null
                            ? <span className="font-semibold" style={{ color: "#0F172A" }}>{r.marks_obtained}</span>
                            : <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#FEF2F2", color: "#EF4444" }}>Absent</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs" style={{ color: "#64748B" }}>
                          {r.percentage !== null ? `${r.percentage}%` : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: gs.bg, color: gs.color }}>{grade}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [typeFilter,  setTypeFilter]  = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("swais_faculty_token");
    if (!token) {
      setAssessments(FALLBACK_ASSESSMENTS);
      setIsLoading(false);
      return;
    }
    fetch(`${API}/api/v1/assessments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.detail || `Error ${r.status}`);
        }
        return r.json();
      })
      .then(d => setAssessments(d.assessments || []))
      .catch(() => {
        // API unavailable — fall back to static demo data
        setAssessments(FALLBACK_ASSESSMENTS);
        setError(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Type counts for summary strip + filter chips
  const typeCounts = useMemo(() => {
    const c = { all: assessments.length, quiz: 0, test: 0, exam: 0, assignment: 0 };
    assessments.forEach(a => { c[a.assessment_type] = (c[a.assessment_type] || 0) + 1; });
    return c;
  }, [assessments]);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return assessments;
    return assessments.filter(a => a.assessment_type === typeFilter);
  }, [assessments, typeFilter]);

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
                Assessments
              </h1>
            </div>
            <p className="text-sm pl-10" style={{ color: "#94A3B8" }}>
              <span className="font-semibold" style={{ color: "#6366F1" }}>{assessments.length}</span> assessments · Click any card to view results
            </p>
          </div>
        </div>

        {/* ── Summary Stat Strip ────────────────────────────── */}
        {!isLoading && !error && assessments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: "quiz",       icon: "📝", label: "Quizzes" },
              { type: "test",       icon: "📋", label: "Tests" },
              { type: "exam",       icon: "🎯", label: "Exams" },
              { type: "assignment", icon: "📚", label: "Assignments" },
            ].map(s => {
              const cfg = TYPE_CONFIG[s.type];
              const count = typeCounts[s.type] || 0;
              return (
                <div key={s.type} className="bg-white rounded-2xl p-4"
                  style={{ border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 1px 3px rgba(99,102,241,0.04)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{s.icon}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                  </div>
                  <p className="text-2xl font-bold leading-none" style={{ color: "#0F172A" }}>{count}</p>
                  <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Type Filter Chips ─────────────────────────────── */}
        {!isLoading && !error && assessments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all",        label: "All",         color: "#64748B", bg: "#F1F5F9" },
              { value: "quiz",       label: "Quiz",        color: TYPE_CONFIG.quiz.color,       bg: TYPE_CONFIG.quiz.bg },
              { value: "test",       label: "Test",        color: TYPE_CONFIG.test.color,       bg: TYPE_CONFIG.test.bg },
              { value: "exam",       label: "Exam",        color: TYPE_CONFIG.exam.color,       bg: TYPE_CONFIG.exam.bg },
              { value: "assignment", label: "Assignment",  color: TYPE_CONFIG.assignment.color, bg: TYPE_CONFIG.assignment.bg },
            ].map(c => {
              const isActive = typeFilter === c.value;
              const count = typeCounts[c.value] || 0;
              return (
                <button key={c.value}
                  onClick={() => setTypeFilter(c.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: isActive ? c.color : c.bg,
                    color:      isActive ? "white" : c.color,
                    border:     "1px solid",
                    borderColor: isActive ? c.color : "transparent",
                  }}>
                  {c.label} <span style={{ opacity: 0.7 }}>· {count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Cards ─────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E2E8F0" }}>
                <div className="skeleton h-5 w-16 mb-3 rounded-full" />
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-1/2 mb-4" />
                <div className="skeleton h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm"
            style={{ border: "1px solid #FCA5A5", color: "#EF4444" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center"
            style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
            <p className="text-sm" style={{ color: "#94A3B8" }}>No assessments found for this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => {
              const cfg = TYPE_CONFIG[a.assessment_type] || TYPE_CONFIG.test;
              const submittedPct = a.total_students
                ? Math.round((a.submitted / a.total_students) * 100)
                : 0;
              const avgPct = (a.class_average != null && a.max_marks)
                ? Math.round((a.class_average / a.max_marks) * 100)
                : null;
              const grade = getGrade(avgPct);
              const gs = GRADE_STYLE[grade];

              return (
                <button
                  key={a.assessment_id}
                  onClick={() => setSelected(a)}
                  className="bg-white rounded-2xl p-5 text-left group transition-all duration-200 cursor-pointer"
                  style={{ border: "1px solid rgba(99,102,241,0.1)" }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid #A5B4FC"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(99,102,241,0.1)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                      {cfg.label}
                    </span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{formatDate(a.assessment_date)}</span>
                  </div>

                  <h3 className="text-sm font-bold leading-snug mb-1" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
                    {a.title}
                  </h3>
                  {a.chapter && (
                    <p className="text-xs mb-3 truncate" style={{ color: "#94A3B8" }}>{a.chapter}</p>
                  )}

                  {/* Submission progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: "#94A3B8" }}>
                      <span>Submitted</span>
                      <span>{a.submitted}/{a.total_students} · {submittedPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EEF2FF" }}>
                      <div className="h-full rounded-full ai-gradient transition-all"
                        style={{ width: `${submittedPct}%` }} />
                    </div>
                  </div>

                  {/* Performance band — synthetic distribution from avg */}
                  {avgPct != null && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] mb-1" style={{ color: "#94A3B8" }}>
                        <span>Class Performance</span>
                        <span style={{ color: gs.color, fontWeight: 700 }}>Grade {grade}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${avgPct}%`,
                            background: `linear-gradient(90deg, ${gs.band}, ${gs.color})`,
                          }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2"
                    style={{ borderTop: "1px solid #F1F5F9" }}>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      Max: <strong style={{ color: "#0F172A" }}>{a.max_marks}</strong>
                    </span>
                    <AvgPill avg={a.class_average} max={a.max_marks} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && <ResultDrawer assessment={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
