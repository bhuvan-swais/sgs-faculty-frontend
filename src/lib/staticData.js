/**
 * SWAIS — Offline fallback data
 * Used automatically when the backend API is unreachable.
 * Field names match the exact API response shapes so no page needs
 * any extra mapping — just drop-in replace.
 */

// ─── Students ────────────────────────────────────────────────────────────────
// Matches GET /api/v1/students → { students: [...], total }
// Each student matches StudentOut schema

export const FALLBACK_STUDENTS = [
  { student_id: 27, full_name: "Aarav Sharma",  roll_no: "01", class_id: 18, section: "A", gender: "male",   guardian_name: "Rajesh Sharma",   guardian_phone: "9876500101", guardian_email: null, is_active: true },
  { student_id: 28, full_name: "Priya Patel",   roll_no: "02", class_id: 18, section: "A", gender: "female", guardian_name: "Suresh Patel",    guardian_phone: "9876500102", guardian_email: null, is_active: true },
  { student_id: 29, full_name: "Rohan Mehta",   roll_no: "03", class_id: 18, section: "A", gender: "male",   guardian_name: "Dinesh Mehta",    guardian_phone: "9876500103", guardian_email: null, is_active: true },
  { student_id: 30, full_name: "Sneha Iyer",    roll_no: "04", class_id: 18, section: "A", gender: "female", guardian_name: "Mohan Iyer",      guardian_phone: "9876500104", guardian_email: null, is_active: true },
  { student_id: 31, full_name: "Arjun Nair",    roll_no: "05", class_id: 18, section: "A", gender: "male",   guardian_name: "Vijay Nair",      guardian_phone: "9876500105", guardian_email: null, is_active: true },
  { student_id: 32, full_name: "Kavya Reddy",   roll_no: "06", class_id: 18, section: "A", gender: "female", guardian_name: "Ramesh Reddy",    guardian_phone: "9876500106", guardian_email: null, is_active: true },
  { student_id: 33, full_name: "Vivaan Singh",  roll_no: "07", class_id: 18, section: "A", gender: "male",   guardian_name: "Vikram Singh",    guardian_phone: "9876500107", guardian_email: null, is_active: true },
  { student_id: 34, full_name: "Ananya Gupta",  roll_no: "08", class_id: 18, section: "A", gender: "female", guardian_name: "Anil Gupta",      guardian_phone: "9876500108", guardian_email: null, is_active: true },
  { student_id: 35, full_name: "Dhruv Joshi",   roll_no: "09", class_id: 18, section: "A", gender: "male",   guardian_name: "Prakash Joshi",   guardian_phone: "9876500109", guardian_email: null, is_active: true },
  { student_id: 36, full_name: "Ishita Verma",  roll_no: "10", class_id: 18, section: "A", gender: "female", guardian_name: "Ajay Verma",      guardian_phone: "9876500110", guardian_email: null, is_active: true },
];

// ─── Assessments ─────────────────────────────────────────────────────────────
// Matches GET /api/v1/assessments → { assessments: [...], total }

export const FALLBACK_ASSESSMENTS = [
  {
    assessment_id:   3,
    title:           "Mid-Term Exam: Chapters 1–4",
    chapter:         "Chapters 1–4 (Constitution, Secularism, Parliament, Judiciary)",
    assessment_type: "exam",
    subject:         "Social Studies",
    max_marks:       100,
    assessment_date: "2026-05-19",
    description:     null,
    total_students:  10,
    submitted:       10,
    class_average:   72.8,
  },
  {
    assessment_id:   2,
    title:           "Quiz: Understanding Secularism",
    chapter:         "Chapter 2 - Understanding Secularism",
    assessment_type: "quiz",
    subject:         "Social Studies",
    max_marks:       25,
    assessment_date: "2026-05-12",
    description:     null,
    total_students:  10,
    submitted:       9,
    class_average:   19.2,
  },
  {
    assessment_id:   1,
    title:           "Chapter Test: The Indian Constitution",
    chapter:         "Chapter 1 - The Indian Constitution",
    assessment_type: "test",
    subject:         "Social Studies",
    max_marks:       50,
    assessment_date: "2026-05-05",
    description:     null,
    total_students:  10,
    submitted:       10,
    class_average:   38.5,
  },
  {
    assessment_id:   4,
    title:           "Algebra Unit Test",
    chapter:         "Chapter 3 - Linear Equations",
    assessment_type: "test",
    subject:         "Mathematics",
    max_marks:       50,
    assessment_date: "2026-05-20",
    description:     null,
    total_students:  10,
    submitted:       10,
    class_average:   41.0,
  },
  {
    assessment_id:   5,
    title:           "Science Quiz: Matter & Materials",
    chapter:         "Chapter 2 - Materials",
    assessment_type: "quiz",
    subject:         "Science",
    max_marks:       20,
    assessment_date: "2026-05-22",
    description:     null,
    total_students:  10,
    submitted:       8,
    class_average:   15.5,
  },
  {
    assessment_id:   6,
    title:           "English Grammar Assignment",
    chapter:         "Unit 4 - Tenses",
    assessment_type: "assignment",
    subject:         "English",
    max_marks:       30,
    assessment_date: "2026-06-01",
    description:     null,
    total_students:  10,
    submitted:       7,
    class_average:   22.0,
  },
  {
    assessment_id:   7,
    title:           "Hindi Essay Writing",
    chapter:         "Unit 3 - निबंध लेखन",
    assessment_type: "assignment",
    subject:         "Hindi",
    max_marks:       25,
    assessment_date: "2026-06-05",
    description:     null,
    total_students:  10,
    submitted:       9,
    class_average:   18.5,
  },
];

// Results for drawer — matches GET /api/v1/assessments/:id → { ...assessment, results: [...] }
export const FALLBACK_ASSESSMENT_RESULTS = {
  1: {
    results: [
      { result_id: 1,  student_id: 27, roll_number: "01", student_name: "Aarav Sharma",  marks_obtained: 45, percentage: 90.00, is_absent: false },
      { result_id: 2,  student_id: 28, roll_number: "02", student_name: "Priya Patel",   marks_obtained: 38, percentage: 76.00, is_absent: false },
      { result_id: 3,  student_id: 29, roll_number: "03", student_name: "Rohan Mehta",   marks_obtained: 42, percentage: 84.00, is_absent: false },
      { result_id: 4,  student_id: 30, roll_number: "04", student_name: "Sneha Iyer",    marks_obtained: 35, percentage: 70.00, is_absent: false },
      { result_id: 5,  student_id: 31, roll_number: "05", student_name: "Arjun Nair",    marks_obtained: 40, percentage: 80.00, is_absent: false },
      { result_id: 6,  student_id: 32, roll_number: "06", student_name: "Kavya Reddy",   marks_obtained: 47, percentage: 94.00, is_absent: false },
      { result_id: 7,  student_id: 33, roll_number: "07", student_name: "Vivaan Singh",  marks_obtained: 30, percentage: 60.00, is_absent: false },
      { result_id: 8,  student_id: 34, roll_number: "08", student_name: "Ananya Gupta",  marks_obtained: 44, percentage: 88.00, is_absent: false },
      { result_id: 9,  student_id: 35, roll_number: "09", student_name: "Dhruv Joshi",   marks_obtained: 25, percentage: 50.00, is_absent: false },
      { result_id: 10, student_id: 36, roll_number: "10", student_name: "Ishita Verma",  marks_obtained: 39, percentage: 78.00, is_absent: false },
    ],
  },
  2: {
    results: [
      { result_id: 11, student_id: 27, roll_number: "01", student_name: "Aarav Sharma",  marks_obtained: 23,   percentage: 92.00, is_absent: false },
      { result_id: 12, student_id: 28, roll_number: "02", student_name: "Priya Patel",   marks_obtained: 19,   percentage: 76.00, is_absent: false },
      { result_id: 13, student_id: 29, roll_number: "03", student_name: "Rohan Mehta",   marks_obtained: 21,   percentage: 84.00, is_absent: false },
      { result_id: 14, student_id: 30, roll_number: "04", student_name: "Sneha Iyer",    marks_obtained: 18,   percentage: 72.00, is_absent: false },
      { result_id: 15, student_id: 31, roll_number: "05", student_name: "Arjun Nair",    marks_obtained: null, percentage: null,  is_absent: true  },
      { result_id: 16, student_id: 32, roll_number: "06", student_name: "Kavya Reddy",   marks_obtained: 24,   percentage: 96.00, is_absent: false },
      { result_id: 17, student_id: 33, roll_number: "07", student_name: "Vivaan Singh",  marks_obtained: 15,   percentage: 60.00, is_absent: false },
      { result_id: 18, student_id: 34, roll_number: "08", student_name: "Ananya Gupta",  marks_obtained: 22,   percentage: 88.00, is_absent: false },
      { result_id: 19, student_id: 35, roll_number: "09", student_name: "Dhruv Joshi",   marks_obtained: 13,   percentage: 52.00, is_absent: false },
      { result_id: 20, student_id: 36, roll_number: "10", student_name: "Ishita Verma",  marks_obtained: 18,   percentage: 72.00, is_absent: false },
    ],
  },
  3: {
    results: [
      { result_id: 21, student_id: 27, roll_number: "01", student_name: "Aarav Sharma",  marks_obtained: 88, percentage: 88.00, is_absent: false },
      { result_id: 22, student_id: 28, roll_number: "02", student_name: "Priya Patel",   marks_obtained: 74, percentage: 74.00, is_absent: false },
      { result_id: 23, student_id: 29, roll_number: "03", student_name: "Rohan Mehta",   marks_obtained: 81, percentage: 81.00, is_absent: false },
      { result_id: 24, student_id: 30, roll_number: "04", student_name: "Sneha Iyer",    marks_obtained: 68, percentage: 68.00, is_absent: false },
      { result_id: 25, student_id: 31, roll_number: "05", student_name: "Arjun Nair",    marks_obtained: 77, percentage: 77.00, is_absent: false },
      { result_id: 26, student_id: 32, roll_number: "06", student_name: "Kavya Reddy",   marks_obtained: 92, percentage: 92.00, is_absent: false },
      { result_id: 27, student_id: 33, roll_number: "07", student_name: "Vivaan Singh",  marks_obtained: 55, percentage: 55.00, is_absent: false },
      { result_id: 28, student_id: 34, roll_number: "08", student_name: "Ananya Gupta",  marks_obtained: 85, percentage: 85.00, is_absent: false },
      { result_id: 29, student_id: 35, roll_number: "09", student_name: "Dhruv Joshi",   marks_obtained: 48, percentage: 48.00, is_absent: false },
      { result_id: 30, student_id: 36, roll_number: "10", student_name: "Ishita Verma",  marks_obtained: 60, percentage: 60.00, is_absent: false },
    ],
  },
};

// ─── Reports ─────────────────────────────────────────────────────────────────
// Matches GET /api/v1/reports response shape exactly

export const FALLBACK_REPORT = {
  teacher_id:        16,
  class_name:        "8th Grade",
  section:           "A",
  total_students:    10,
  total_assessments: 3,
  students: [
    { student_id: 32, name: "Kavya Reddy",  roll_number: "06", rank: 1, total_assessed: 3, average_marks: 54.3, average_percent: 94.0,  highest_marks: 92, lowest_marks: 24 },
    { student_id: 27, name: "Aarav Sharma", roll_number: "01", rank: 2, total_assessed: 3, average_marks: 52.0, average_percent: 90.0,  highest_marks: 88, lowest_marks: 23 },
    { student_id: 34, name: "Ananya Gupta", roll_number: "08", rank: 3, total_assessed: 3, average_marks: 50.3, average_percent: 87.0,  highest_marks: 85, lowest_marks: 22 },
    { student_id: 29, name: "Rohan Mehta",  roll_number: "03", rank: 4, total_assessed: 3, average_marks: 48.0, average_percent: 83.0,  highest_marks: 81, lowest_marks: 21 },
    { student_id: 31, name: "Arjun Nair",   roll_number: "05", rank: 5, total_assessed: 2, average_marks: 58.5, average_percent: 78.5,  highest_marks: 77, lowest_marks: 40 },
    { student_id: 28, name: "Priya Patel",  roll_number: "02", rank: 6, total_assessed: 3, average_marks: 43.7, average_percent: 75.3,  highest_marks: 74, lowest_marks: 19 },
    { student_id: 30, name: "Sneha Iyer",   roll_number: "04", rank: 7, total_assessed: 3, average_marks: 40.3, average_percent: 70.0,  highest_marks: 68, lowest_marks: 18 },
    { student_id: 36, name: "Ishita Verma", roll_number: "10", rank: 8, total_assessed: 3, average_marks: 39.0, average_percent: 67.7,  highest_marks: 60, lowest_marks: 18 },
    { student_id: 33, name: "Vivaan Singh", roll_number: "07", rank: 9, total_assessed: 3, average_marks: 33.3, average_percent: 58.3,  highest_marks: 55, lowest_marks: 15 },
    { student_id: 35, name: "Dhruv Joshi",  roll_number: "09", rank: 10,total_assessed: 3, average_marks: 28.7, average_percent: 50.0,  highest_marks: 48, lowest_marks: 13 },
  ],
};

// ─── Notes ───────────────────────────────────────────────────────────────────
// Matches GET /api/v1/notes → { notes: [...] }
// Dashboard uses: note.id, note.title, note.chapter, note.updatedAt

export const FALLBACK_NOTES = [
  {
    id: "N1",
    title: "Fundamental Rights — Key Points",
    content: "Article 12–35 deals with Fundamental Rights. Six categories: Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, Right to Constitutional Remedies.",
    chapter: "Chapter 1 - The Indian Constitution",
    content_type: "typed",
    tags: ["rights", "constitution"],
    updated_at: "2026-05-20T09:00:00",
    updatedAt:  "2026-05-20T09:00:00",
    created_at: "2026-05-20T09:00:00",
  },
  {
    id: "N2",
    title: "Secularism — Definition & Examples",
    content: "Secularism means the state does not support any particular religion. India follows a unique form — state can intervene in religious matters to end social evils. Examples: ban on untouchability, allowing entry to all in temples.",
    chapter: "Chapter 2 - Understanding Secularism",
    content_type: "typed",
    tags: ["secularism", "religion"],
    updated_at: "2026-05-18T11:00:00",
    updatedAt:  "2026-05-18T11:00:00",
    created_at: "2026-05-18T11:00:00",
  },
  {
    id: "N3",
    title: "Parliament — Lok Sabha vs Rajya Sabha",
    content: "Lok Sabha: 543 elected members, max term 5 years, money bills originate here. Rajya Sabha: 245 members, permanent house, 1/3 retire every 2 years. Both required to pass ordinary bills.",
    chapter: "Chapter 3 - Parliament and Laws",
    content_type: "typed",
    tags: ["parliament", "legislature"],
    updated_at: "2026-05-15T14:00:00",
    updatedAt:  "2026-05-15T14:00:00",
    created_at: "2026-05-15T14:00:00",
  },
];

// ─── Chapters ─────────────────────────────────────────────────────────────────
// Matches GET /api/v1/chapters → { chapters: [...] }

export const FALLBACK_CHAPTERS = [
  "Chapter 1 - The Indian Constitution",
  "Chapter 2 - Understanding Secularism",
  "Chapter 3 - Parliament and Laws",
  "Chapter 4 - Judiciary",
  "Chapter 5 - Understanding Marginalisation",
  "Chapter 6 - Confronting Marginalisation",
  "Chapter 7 - Public Facilities",
  "Chapter 8 - Law and Social Justice",
];

// ─── Lesson Plan (generated fallback) ────────────────────────────────────────
// Matches the LessonPlanOut schema returned by POST /api/v1/lesson-plans/generate

export function buildFallbackPlan(chapter, topic, duration = 45) {
  const label = topic || chapter;
  const intro    = Math.max(5,  Math.round(duration * 0.11));
  const main     = Math.round(duration * 0.44);
  const activity = Math.round(duration * 0.28);
  const wrap     = Math.max(5, duration - intro - main - activity);

  return {
    lesson_plan_id:    null,
    title:             `Lesson Plan: ${label}`,
    chapter_text:      chapter,
    subject:           "Social Studies",
    class_name:        "8th Grade",
    section:           "A",
    duration_minutes:  duration,
    objectives: [
      `Recall and explain the key concepts of ${label}`,
      `Analyse how ${label} affects everyday life in India`,
      `Evaluate different perspectives related to ${label} with evidence`,
      `Create a short written or visual response applying what they learned`,
    ],
    materials: [
      "NCERT Social Studies Textbook (Class 8)",
      "Blackboard / Whiteboard & chalk/markers",
      `Key-terms handout for ${chapter}`,
      "Chart paper and coloured markers",
      "Discussion prompt cards",
    ],
    core_concept: `This lesson centres on '${label}'. Students will build a conceptual understanding by moving from definitions and facts toward analysis and application. The teacher will use the Socratic method during the main teaching phase, asking guiding questions rather than delivering a monologue, so that learners construct meaning themselves.`,
    plan_sections: [
      {
        title:          "Warm-Up & Prior Knowledge",
        duration:       intro,
        activity:       `Quick Think-Pair-Share: 'What do you already know about ${label}?'`,
        teacher_action: `Pose an open question about ${label}. Write key words on the board as students respond.`,
        student_action: "Discuss with a partner for 1 minute, then share one idea with the class.",
      },
      {
        title:          "Direct Teaching — Core Concept",
        duration:       main,
        activity:       `Structured explanation of ${label} with diagrams/examples on the board.`,
        teacher_action: `Introduce the topic using the textbook and board. Ask guiding questions every 5 minutes to check understanding. Highlight key vocabulary.`,
        student_action: "Take notes, underline key terms in the textbook, ask clarifying questions.",
      },
      {
        title:          "Collaborative Activity",
        duration:       activity,
        activity:       `Group task: Create a mind-map or short skit illustrating one aspect of ${label}.`,
        teacher_action: "Circulate among groups, prompt deeper thinking, ensure all students contribute.",
        student_action: "Work in groups of 3–4. Present findings to the class in 1 minute.",
      },
      {
        title:          "Wrap-Up & Reflection",
        duration:       wrap,
        activity:       "Exit ticket: Each student writes one new thing they learned and one question they still have.",
        teacher_action: `Summarise the lesson. Preview the next topic. Collect exit tickets.`,
        student_action: "Write exit ticket. Share homework details.",
      },
    ],
    assessment_method: "Continuous observation during group activity (formative). Exit ticket to gauge understanding. Summative: Written paragraph response — students explain the concept in their own words and give one real-life example.",
    homework:          `Read the textbook section on ${label} once more and underline three facts you found most interesting. Write a 4–5 sentence paragraph explaining how ${label} is relevant to modern Indian society.`,
    differentiation: {
      advanced:   "Research one additional real-world case study and present a 2-minute verbal report next class.",
      struggling: "Provide a printed graphic organiser with sentence starters. Allow partner support during activity.",
      ell_support:"Key vocabulary list with simple definitions provided in advance.",
    },
    created_at: null,
  };
}

// ─── Legacy exports (kept for backward compatibility with auto-test page) ────
export { FALLBACK_CHAPTERS as CHAPTERS };

const makeStudent = (id, roll, name, gender, parent, phone, cls, sec) => ({
  student_id: id, roll_no: roll, full_name: name, gender,
  guardian_name: parent, guardian_phone: phone, class_id: cls, section: sec,
});

export const STATIC_STUDENTS = { "8A": FALLBACK_STUDENTS };

export const STATIC_TESTS = {};
export const GRADE_DISTRIBUTION   = [];
export const GENDER_PERFORMANCE    = [];
export const ASSESSMENT_COMPLETION = [];
export const CLASS_PERFORMANCE     = [];
