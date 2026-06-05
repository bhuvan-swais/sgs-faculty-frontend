-- =============================================================================
--  SGS Faculty Module — Migration Script
--  Version      : 1.0.0  |  Date: 2026-05-20
--
--  Database     : PostgreSQL (AWS RDS — existing sgs_prod DB)
--
--  PURPOSE:
--    Adds ONLY the net-new tables required by the faculty module.
--    All duplicate concepts (schools, teachers, students, chapters) already
--    exist in prod as sgs_school_master, sgs_teacher_master,
--    sgs_student_master, sgs_chapter_master — this script references those.
--
--  SAFE TO RUN ON PROD: Yes — only CREATE IF NOT EXISTS / new objects.
-- =============================================================================

-- ---------------------------------------------------------------------------
--  ENUMS  (only the three needed by faculty tables; not already in prod)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE assessment_type AS ENUM ('quiz', 'test', 'exam', 'assignment');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'let_drop',
        'peer_help',
        'good_manners',
        'table_manners',
        'general'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('sms', 'whatsapp', 'email', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
--  TRIGGER FUNCTION — auto-update updated_at
--  (safe: OR REPLACE will not break existing triggers)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
--  TABLE: sgs_assessments
--  One row per assessment (quiz / test / exam / assignment) created by a
--  teacher. References sgs_teacher_master and sgs_chapter_master.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sgs_assessments (
    assessment_id       BIGSERIAL               PRIMARY KEY,
    teacher_id          BIGINT                  NOT NULL
                            REFERENCES public.sgs_teacher_master(teacher_id)
                            ON DELETE CASCADE,
    title               VARCHAR(300)            NOT NULL,
    assessment_type     assessment_type         NOT NULL DEFAULT 'test',
    chapter_id          BIGINT
                            REFERENCES public.sgs_chapter_master(chapter_id)
                            ON DELETE SET NULL,
    chapter             VARCHAR(300),                       -- display label
    assessment_date     DATE,
    max_marks           NUMERIC(6,2)            NOT NULL DEFAULT 100,
    class_name          VARCHAR(10)             NOT NULL,   -- e.g. '8', '9'
    section             VARCHAR(5)              NOT NULL,   -- e.g. 'A', 'B'
    total_students      INT                     NOT NULL DEFAULT 0,
    submitted           INT                     NOT NULL DEFAULT 0,
    class_average       NUMERIC(5,2),
    created_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_status       VARCHAR(20)             NOT NULL DEFAULT 'Active',
    version_no          INT                     NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sgs_assessments_teacher
    ON public.sgs_assessments(teacher_id);

CREATE INDEX IF NOT EXISTS idx_sgs_assessments_chapter
    ON public.sgs_assessments(chapter_id);

CREATE INDEX IF NOT EXISTS idx_sgs_assessments_date
    ON public.sgs_assessments(assessment_date);

CREATE OR REPLACE TRIGGER set_updated_at_sgs_assessments
    BEFORE UPDATE ON public.sgs_assessments
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
--  TABLE: sgs_assessment_results
--  One row per student per assessment.
--  marks_obtained = NULL means the student was absent.
--  References sgs_assessments and sgs_student_master.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sgs_assessment_results (
    result_id           BIGSERIAL               PRIMARY KEY,
    assessment_id       BIGINT                  NOT NULL
                            REFERENCES public.sgs_assessments(assessment_id)
                            ON DELETE CASCADE,
    student_id          BIGINT                  NOT NULL
                            REFERENCES public.sgs_student_master(student_id)
                            ON DELETE CASCADE,
    roll_number         VARCHAR(20)             NOT NULL,
    student_name        VARCHAR(150)            NOT NULL,   -- denormalized for fast display
    marks_obtained      NUMERIC(6,2),                       -- NULL = absent
    percentage          NUMERIC(5,2),                       -- (marks_obtained / max_marks) * 100
    is_absent           BOOLEAN                 NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_status       VARCHAR(20)             NOT NULL DEFAULT 'Active',
    version_no          INT                     NOT NULL DEFAULT 1,

    UNIQUE (assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_sgs_assessment_results_assessment
    ON public.sgs_assessment_results(assessment_id);

CREATE INDEX IF NOT EXISTS idx_sgs_assessment_results_student
    ON public.sgs_assessment_results(student_id);

CREATE OR REPLACE TRIGGER set_updated_at_sgs_assessment_results
    BEFORE UPDATE ON public.sgs_assessment_results
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
--  TABLE: sgs_parent_notifications
--  Log of all notifications sent by teachers to parents.
--  References sgs_teacher_master and sgs_student_master.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sgs_parent_notifications (
    notification_id     BIGSERIAL               PRIMARY KEY,
    teacher_id          BIGINT                  NOT NULL
                            REFERENCES public.sgs_teacher_master(teacher_id)
                            ON DELETE CASCADE,
    student_id          BIGINT                  NOT NULL
                            REFERENCES public.sgs_student_master(student_id)
                            ON DELETE CASCADE,
    notification_type   notification_type       NOT NULL DEFAULT 'general',
    message_text        TEXT                    NOT NULL,
    sent_via            notification_channel    NOT NULL DEFAULT 'manual',
    sent_at             TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_status       VARCHAR(20)             NOT NULL DEFAULT 'Active',
    version_no          INT                     NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sgs_parent_notif_teacher
    ON public.sgs_parent_notifications(teacher_id);

CREATE INDEX IF NOT EXISTS idx_sgs_parent_notif_student
    ON public.sgs_parent_notifications(student_id);

CREATE INDEX IF NOT EXISTS idx_sgs_parent_notif_sent_at
    ON public.sgs_parent_notifications(sent_at);

-- =============================================================================
--  TABLE: sgs_lesson_plans
--  AI-generated lesson plans created by teachers via the Lesson Planner.
--  References sgs_teacher_master and sgs_chapter_master.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sgs_lesson_plans (
    lesson_plan_id      BIGSERIAL               PRIMARY KEY,
    teacher_id          BIGINT                  NOT NULL
                            REFERENCES public.sgs_teacher_master(teacher_id)
                            ON DELETE CASCADE,
    title               VARCHAR(300)            NOT NULL,
    subject             VARCHAR(100),
    class_name          VARCHAR(10),
    section             VARCHAR(5),
    chapter_id          BIGINT
                            REFERENCES public.sgs_chapter_master(chapter_id)
                            ON DELETE SET NULL,
    chapter_text        VARCHAR(300),           -- free-text label used at generation time

    duration_minutes    INT                     NOT NULL DEFAULT 45,

    -- Learning design (stored as JSON arrays)
    objectives          JSONB                   NOT NULL DEFAULT '[]',   -- string[]
    materials           JSONB                   NOT NULL DEFAULT '[]',   -- string[]
    core_concept        TEXT,

    -- Lesson structure: [{time, phase, content, color, icon}]
    plan_sections       JSONB                   NOT NULL DEFAULT '[]',

    -- Wrap-up
    assessment_method   TEXT,
    homework            TEXT,
    differentiation     JSONB,                  -- {support: string, extension: string}

    -- Provenance
    prompt_used         TEXT,                   -- original teacher prompt
    modification_log    JSONB                   NOT NULL DEFAULT '[]',   -- [{prompt, timestamp}]

    created_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_status       VARCHAR(20)             NOT NULL DEFAULT 'Active',
    version_no          INT                     NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sgs_lesson_plans_teacher
    ON public.sgs_lesson_plans(teacher_id);

CREATE INDEX IF NOT EXISTS idx_sgs_lesson_plans_chapter
    ON public.sgs_lesson_plans(chapter_id);

CREATE INDEX IF NOT EXISTS idx_sgs_lesson_plans_created
    ON public.sgs_lesson_plans(created_at DESC);

CREATE OR REPLACE TRIGGER set_updated_at_sgs_lesson_plans
    BEFORE UPDATE ON public.sgs_lesson_plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
--  END OF MIGRATION
-- =============================================================================
