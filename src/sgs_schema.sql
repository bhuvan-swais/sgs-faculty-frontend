-- =============================================================================
--  SGS (Swais Graduate School) — Production Database Schema
--  Version      : 1.0.0  |  Date: 2026-05-19
--
--  Database    : PostgreSQL 15+
--  Naming      : snake_case  |  PK suffix: _id  |  FK: <table>_id
-- =============================================================================

-- ---------------------------------------------------------------------------
--  EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- ---------------------------------------------------------------------------
--  ENUMS
-- ---------------------------------------------------------------------------
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

CREATE TYPE content_type AS ENUM ('typed', 'canvas');

CREATE TYPE assessment_type AS ENUM ('quiz', 'test', 'exam', 'assignment');

CREATE TYPE notification_type AS ENUM (
    'let_drop',
    'peer_help',
    'good_manners',
    'table_manners',
    'general'
);

CREATE TYPE notification_channel AS ENUM ('sms', 'whatsapp', 'email', 'manual');

-- =============================================================================
--  TABLE: schools
--  One row per school managed under the SGS platform.
-- =============================================================================
CREATE TABLE schools (
    school_id       SERIAL          PRIMARY KEY,
    school_name     VARCHAR(200)    NOT NULL,
    address         VARCHAR(400),
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100)    DEFAULT 'India',
    phone           VARCHAR(20),
    email           VARCHAR(150),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
--  TABLE: teachers
--  One row per teacher login account.
--  Each teacher is assigned to one school, one class, and one section.
-- =============================================================================
CREATE TABLE teachers (
    teacher_id      SERIAL          PRIMARY KEY,
    school_id       INT             NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    name            VARCHAR(150)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    subject         VARCHAR(100),
    class_assigned  VARCHAR(10),           -- e.g. '8', '9', '10'
    section         VARCHAR(5),            -- e.g. 'A', 'B'
    avatar_initials VARCHAR(5),            -- e.g. 'PS' (Priya Sharma)
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teachers_school  ON teachers(school_id);
CREATE INDEX idx_teachers_email   ON teachers(email);

-- =============================================================================
--  TABLE: students
--  One row per enrolled student.
-- =============================================================================
CREATE TABLE students (
    student_id      SERIAL          PRIMARY KEY,
    school_id       INT             NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    roll_number     VARCHAR(20)     NOT NULL,
    name            VARCHAR(150)    NOT NULL,
    gender          gender_type     NOT NULL DEFAULT 'other',
    class_name      VARCHAR(10)     NOT NULL,   -- e.g. '8', '9'
    section         VARCHAR(5)      NOT NULL,   -- e.g. 'A', 'B'
    parent_name     VARCHAR(150),
    parent_phone    VARCHAR(20),
    parent_email    VARCHAR(150),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (school_id, roll_number)
);

CREATE INDEX idx_students_school       ON students(school_id);
CREATE INDEX idx_students_class_sec    ON students(school_id, class_name, section);

-- =============================================================================
--  TABLE: chapters
--  Curriculum chapters per class and subject for a given academic year.
-- =============================================================================
CREATE TABLE chapters (
    chapter_id      SERIAL          PRIMARY KEY,
    school_id       INT             NOT NULL REFERENCES schools(school_id) ON DELETE RESTRICT,
    class_name      VARCHAR(10)     NOT NULL,
    subject         VARCHAR(100)    NOT NULL,
    chapter_number  INT             NOT NULL,
    chapter_title   VARCHAR(300)    NOT NULL,
    academic_year   VARCHAR(10)     NOT NULL DEFAULT '2025-26',  -- e.g. '2025-26'
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (school_id, class_name, subject, chapter_number, academic_year)
);

CREATE INDEX idx_chapters_school_class ON chapters(school_id, class_name, subject);

-- =============================================================================
--  TABLE: notes
--  Teacher lesson notes — can be typed text or a canvas drawing image.
-- =============================================================================
CREATE TABLE notes (
    note_id             SERIAL          PRIMARY KEY,
    teacher_id          INT             NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    title               VARCHAR(300)    NOT NULL,
    content             TEXT,
    chapter_id          INT             REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    chapter_text        VARCHAR(300),               -- free-text chapter label (display)
    content_type        content_type    NOT NULL DEFAULT 'typed',
    canvas_image_url    VARCHAR(500),
    tags                TEXT[]          NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_teacher     ON notes(teacher_id);
CREATE INDEX idx_notes_chapter     ON notes(chapter_id);
CREATE INDEX idx_notes_tags        ON notes USING GIN(tags);

-- =============================================================================
--  TABLE: assessments
--  One row per assessment (quiz / test / exam / assignment) created by a teacher.
-- =============================================================================
CREATE TABLE assessments (
    assessment_id       SERIAL              PRIMARY KEY,
    teacher_id          INT                 NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    title               VARCHAR(300)        NOT NULL,
    assessment_type     assessment_type     NOT NULL DEFAULT 'test',
    chapter_id          INT                 REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    chapter             VARCHAR(300),                   -- display label
    assessment_date     DATE,
    max_marks           NUMERIC(6,2)        NOT NULL DEFAULT 100,
    class_name          VARCHAR(10)         NOT NULL,
    section             VARCHAR(5)          NOT NULL,
    total_students      INT                 NOT NULL DEFAULT 0,
    submitted           INT                 NOT NULL DEFAULT 0,
    class_average       NUMERIC(5,2),                   -- updated after results are entered
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_teacher     ON assessments(teacher_id);
CREATE INDEX idx_assessments_chapter     ON assessments(chapter_id);
CREATE INDEX idx_assessments_date        ON assessments(assessment_date);

-- =============================================================================
--  TABLE: assessment_results
--  One row per student per assessment.
--  marks_obtained = NULL means the student was absent.
-- =============================================================================
CREATE TABLE assessment_results (
    result_id           SERIAL          PRIMARY KEY,
    assessment_id       INT             NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    student_id          INT             NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    roll_number         VARCHAR(20)     NOT NULL,
    student_name        VARCHAR(150)    NOT NULL,   -- denormalized for fast display
    marks_obtained      NUMERIC(6,2),               -- NULL = absent
    percentage          NUMERIC(5,2),               -- computed: (marks_obtained / max_marks) * 100
    is_absent           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (assessment_id, student_id)
);

CREATE INDEX idx_results_assessment  ON assessment_results(assessment_id);
CREATE INDEX idx_results_student     ON assessment_results(student_id);

-- =============================================================================
--  TABLE: parent_notifications
--  Log of all notifications sent by teachers to parents.
-- =============================================================================
CREATE TABLE parent_notifications (
    notification_id     SERIAL                  PRIMARY KEY,
    teacher_id          INT                     NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    student_id          INT                     NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    notification_type   notification_type       NOT NULL DEFAULT 'general',
    message_text        TEXT                    NOT NULL,
    sent_via            notification_channel    NOT NULL DEFAULT 'manual',
    sent_at             TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_teacher  ON parent_notifications(teacher_id);
CREATE INDEX idx_notifications_student  ON parent_notifications(student_id);
CREATE INDEX idx_notifications_sent_at  ON parent_notifications(sent_at);

-- =============================================================================
--  TABLE: lesson_plans
--  AI-generated lesson plans created by teachers via the Lesson Planner.
--  Each row is one saved plan; unsaved drafts exist only in the browser.
-- =============================================================================
CREATE TABLE lesson_plans (
    lesson_plan_id      SERIAL          PRIMARY KEY,
    teacher_id          INT             NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    title               VARCHAR(300)    NOT NULL,
    subject             VARCHAR(100),
    class_name          VARCHAR(10),
    section             VARCHAR(5),
    chapter_id          INT             REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    chapter_text        VARCHAR(300),           -- free-text chapter label used at generation time
    duration_minutes    INT             NOT NULL DEFAULT 45,

    -- Learning design
    objectives          JSONB           NOT NULL DEFAULT '[]',   -- string[]
    materials           JSONB           NOT NULL DEFAULT '[]',   -- string[]
    core_concept        TEXT,

    -- Lesson structure: [{time, phase, content, color, icon}]
    plan_sections       JSONB           NOT NULL DEFAULT '[]',

    -- Wrap-up
    assessment_method   TEXT,
    homework            TEXT,
    differentiation     JSONB,          -- {support: string, extension: string}

    -- Provenance
    prompt_used         TEXT,           -- original teacher prompt
    modification_log    JSONB           NOT NULL DEFAULT '[]',   -- [{prompt, timestamp}] refinement history

    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lesson_plans_teacher  ON lesson_plans(teacher_id);
CREATE INDEX idx_lesson_plans_chapter  ON lesson_plans(chapter_id);
CREATE INDEX idx_lesson_plans_created  ON lesson_plans(created_at DESC);

-- =============================================================================
--  TRIGGERS — auto-update updated_at on all tables that carry it
-- =============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_schools
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_teachers
    BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_students
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_notes
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_assessments
    BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_assessment_results
    BEFORE UPDATE ON assessment_results
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_lesson_plans
    BEFORE UPDATE ON lesson_plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
--  SEED — default school (matches frontend demo data)
-- =============================================================================
INSERT INTO schools (school_name, city, country)
VALUES ('SWAIS International Academy', 'Hyderabad', 'India');
