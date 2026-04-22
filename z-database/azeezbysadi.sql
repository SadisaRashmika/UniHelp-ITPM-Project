CREATE SEQUENCE IF NOT EXISTS careers_id_seq;

CREATE TABLE IF NOT EXISTS public.careers
(
    id integer NOT NULL DEFAULT nextval('careers_id_seq'::regclass),
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    type character varying(50),
    location character varying(255),
    salary character varying(100),
    duration character varying(100),
    stipend character varying(100),
    posted date DEFAULT CURRENT_DATE,
    deadline date,
    description text,
    requirements jsonb,
    status character varying(50) DEFAULT 'active',
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT careers_pkey PRIMARY KEY (id)
);

-- Table: public.faculties

-- DROP TABLE IF EXISTS public.faculties;

CREATE SEQUENCE IF NOT EXISTS faculties_id_seq;

CREATE TABLE IF NOT EXISTS public.faculties
(
    id integer NOT NULL DEFAULT nextval('faculties_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT faculties_pkey PRIMARY KEY (id),
    CONSTRAINT faculties_code_key UNIQUE (code)
);

ALTER TABLE IF EXISTS public.faculties
    OWNER to postgres;


-- Table: public.semesters

-- DROP TABLE IF EXISTS public.semesters;

CREATE SEQUENCE IF NOT EXISTS semesters_id_seq;

CREATE TABLE IF NOT EXISTS public.semesters
(
    id integer NOT NULL DEFAULT nextval('semesters_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "number" integer,
    CONSTRAINT semesters_pkey PRIMARY KEY (id),
    CONSTRAINT semesters_name_key UNIQUE (name)
);

ALTER TABLE IF EXISTS public.semesters
    OWNER to postgres;


-- Table: public.modules

-- DROP TABLE IF EXISTS public.modules;

CREATE SEQUENCE IF NOT EXISTS modules_id_seq;

CREATE TABLE IF NOT EXISTS public.modules
(
    id integer NOT NULL DEFAULT nextval('modules_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    faculty_id integer,
    intake_id integer,
    semester_id integer,
    lecturer_id character varying(50) COLLATE pg_catalog."default",
    credits integer,
    description text COLLATE pg_catalog."default",
    CONSTRAINT modules_pkey PRIMARY KEY (id),
    CONSTRAINT modules_code_key UNIQUE (code),
    CONSTRAINT modules_faculty_id_fkey FOREIGN KEY (faculty_id)
        REFERENCES public.faculties (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT modules_intake_id_fkey FOREIGN KEY (intake_id)
        REFERENCES public.intakes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT modules_semester_id_fkey FOREIGN KEY (semester_id)
        REFERENCES public.semesters (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.modules
    OWNER to postgres;


-- Table: public.submissions

-- DROP TABLE IF EXISTS public.submissions;

CREATE SEQUENCE IF NOT EXISTS submissions_id_seq;

CREATE TABLE IF NOT EXISTS public.submissions
(
    id integer NOT NULL DEFAULT nextval('submissions_id_seq'::regclass),
    quiz_id integer,
    student_id character varying(50) COLLATE pg_catalog."default",
    answer text COLLATE pg_catalog."default",
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    grade integer,
    feedback text COLLATE pg_catalog."default",
    quiz_title character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT submissions_pkey PRIMARY KEY (id),
    CONSTRAINT submissions_quiz_id_fkey FOREIGN KEY (quiz_id)
        REFERENCES public.quizzes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.submissions
    OWNER to postgres;

-- Index: idx_submissions_quiz_id

CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id
    ON public.submissions USING btree
    (quiz_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_submissions_student_id

CREATE INDEX IF NOT EXISTS idx_submissions_student_id
    ON public.submissions USING btree
    (student_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


-- Table: public.practicals

-- DROP TABLE IF EXISTS public.practicals;

CREATE SEQUENCE IF NOT EXISTS practicals_id_seq;

CREATE TABLE IF NOT EXISTS public.practicals
(
    id integer NOT NULL DEFAULT nextval('practicals_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    due_date date NOT NULL,
    priority character varying(20) COLLATE pg_catalog."default" DEFAULT 'medium',
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending',
    course_code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    lecturer_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    max_marks integer DEFAULT 100,
    duration integer DEFAULT 60,
    practical_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'lab',
    instructions text COLLATE pg_catalog."default",
    requirements jsonb DEFAULT '[]'::jsonb,
    resources jsonb DEFAULT '[]'::jsonb,
    submission_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'file',
    lab_equipment jsonb DEFAULT '[]'::jsonb,
    software_requirements jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT practicals_pkey PRIMARY KEY (id),
    CONSTRAINT practicals_priority_check CHECK (priority::text = ANY (ARRAY['low', 'medium', 'high']::text[])),
    CONSTRAINT practicals_status_check CHECK (status::text = ANY (ARRAY['pending', 'in-progress', 'completed', 'cancelled']::text[])),
    CONSTRAINT practicals_practical_type_check CHECK (practical_type::text = ANY (ARRAY['lab', 'workshop', 'field_work', 'simulation']::text[])),
    CONSTRAINT practicals_submission_type_check CHECK (submission_type::text = ANY (ARRAY['file', 'text', 'link', 'code', 'report']::text[]))
);

ALTER TABLE IF EXISTS public.practicals
    OWNER to postgres;

-- Index: idx_practicals_course_code

CREATE INDEX IF NOT EXISTS idx_practicals_course_code
    ON public.practicals USING btree
    (course_code COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_created_at

CREATE INDEX IF NOT EXISTS idx_practicals_created_at
    ON public.practicals USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_due_date

CREATE INDEX IF NOT EXISTS idx_practicals_due_date
    ON public.practicals USING btree
    (due_date ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_lecturer_id

CREATE INDEX IF NOT EXISTS idx_practicals_lecturer_id
    ON public.practicals USING btree
    (lecturer_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_practical_type

CREATE INDEX IF NOT EXISTS idx_practicals_practical_type
    ON public.practicals USING btree
    (practical_type COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_status

CREATE INDEX IF NOT EXISTS idx_practicals_status
    ON public.practicals USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Trigger: update_practicals_updated_at

CREATE OR REPLACE TRIGGER update_practicals_updated_at
    BEFORE UPDATE 
    ON public.practicals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger Function: update_updated_at_column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Function: public.update_updated_at_column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Set the 'updated_at' field to current timestamp
    RETURN NEW;  -- Return the modified row
END;
$$ LANGUAGE plpgsql;

-- Table: public.faculties

-- DROP TABLE IF EXISTS public.faculties;

CREATE SEQUENCE IF NOT EXISTS faculties_id_seq;

CREATE TABLE IF NOT EXISTS public.faculties
(
    id integer NOT NULL DEFAULT nextval('faculties_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT faculties_pkey PRIMARY KEY (id),
    CONSTRAINT faculties_code_key UNIQUE (code)
);

ALTER TABLE IF EXISTS public.faculties
    OWNER to postgres;

-- Table: public.intakes

-- DROP TABLE IF EXISTS public.intakes;

CREATE SEQUENCE IF NOT EXISTS intakes_id_seq;

CREATE TABLE IF NOT EXISTS public.intakes
(
    id integer NOT NULL DEFAULT nextval('intakes_id_seq'::regclass),
    year integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT intakes_pkey PRIMARY KEY (id),
    CONSTRAINT intakes_year_key UNIQUE (year)
);

ALTER TABLE IF EXISTS public.intakes
    OWNER to postgres;

-- Table: public.semesters

-- DROP TABLE IF EXISTS public.semesters;

CREATE SEQUENCE IF NOT EXISTS semesters_id_seq;

CREATE TABLE IF NOT EXISTS public.semesters
(
    id integer NOT NULL DEFAULT nextval('semesters_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "number" integer,
    CONSTRAINT semesters_pkey PRIMARY KEY (id),
    CONSTRAINT semesters_name_key UNIQUE (name)
);

ALTER TABLE IF EXISTS public.semesters
    OWNER to postgres;

-- Table: public.modules

-- DROP TABLE IF EXISTS public.modules;

CREATE SEQUENCE IF NOT EXISTS modules_id_seq;

CREATE TABLE IF NOT EXISTS public.modules
(
    id integer NOT NULL DEFAULT nextval('modules_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    faculty_id integer,
    intake_id integer,
    semester_id integer,
    lecturer_id character varying(50) COLLATE pg_catalog."default",
    credits integer,
    description text COLLATE pg_catalog."default",
    CONSTRAINT modules_pkey PRIMARY KEY (id),
    CONSTRAINT modules_code_key UNIQUE (code),
    CONSTRAINT modules_faculty_id_fkey FOREIGN KEY (faculty_id)
        REFERENCES public.faculties (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT modules_intake_id_fkey FOREIGN KEY (intake_id)
        REFERENCES public.intakes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT modules_semester_id_fkey FOREIGN KEY (semester_id)
        REFERENCES public.semesters (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.modules
    OWNER to postgres;

-- Table: public.submissions

-- DROP TABLE IF EXISTS public.submissions;

CREATE SEQUENCE IF NOT EXISTS submissions_id_seq;

CREATE TABLE IF NOT EXISTS public.submissions
(
    id integer NOT NULL DEFAULT nextval('submissions_id_seq'::regclass),
    quiz_id integer,
    student_id character varying(50) COLLATE pg_catalog."default",
    answer text COLLATE pg_catalog."default",
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    grade integer,
    feedback text COLLATE pg_catalog."default",
    quiz_title character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT submissions_pkey PRIMARY KEY (id),
    CONSTRAINT submissions_quiz_id_fkey FOREIGN KEY (quiz_id)
        REFERENCES public.quizzes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.submissions
    OWNER to postgres;

-- Index: idx_submissions_quiz_id

CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id
    ON public.submissions USING btree
    (quiz_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_submissions_student_id

CREATE INDEX IF NOT EXISTS idx_submissions_student_id
    ON public.submissions USING btree
    (student_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Table: public.practicals

-- DROP TABLE IF EXISTS public.practicals;

CREATE SEQUENCE IF NOT EXISTS practicals_id_seq;

CREATE TABLE IF NOT EXISTS public.practicals
(
    id integer NOT NULL DEFAULT nextval('practicals_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    due_date date NOT NULL,
    priority character varying(20) COLLATE pg_catalog."default" DEFAULT 'medium',
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending',
    course_code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    lecturer_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    max_marks integer DEFAULT 100,
    duration integer DEFAULT 60,
    practical_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'lab',
    instructions text COLLATE pg_catalog."default",
    requirements jsonb DEFAULT '[]'::jsonb,
    resources jsonb DEFAULT '[]'::jsonb,
    submission_type character varying(20) COLLATE pg_catalog."default" DEFAULT 'file',
    lab_equipment jsonb DEFAULT '[]'::jsonb,
    software_requirements jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT practicals_pkey PRIMARY KEY (id),
    CONSTRAINT practicals_priority_check CHECK (priority::text = ANY (ARRAY['low', 'medium', 'high']::text[])),
    CONSTRAINT practicals_status_check CHECK (status::text = ANY (ARRAY['pending', 'in-progress', 'completed', 'cancelled']::text[])),
    CONSTRAINT practicals_practical_type_check CHECK (practical_type::text = ANY (ARRAY['lab', 'workshop', 'field_work', 'simulation']::text[])),
    CONSTRAINT practicals_submission_type_check CHECK (submission_type::text = ANY (ARRAY['file', 'text', 'link', 'code', 'report']::text[]))
);

ALTER TABLE IF EXISTS public.practicals
    OWNER to postgres;

-- Index: idx_practicals_course_code

CREATE INDEX IF NOT EXISTS idx_practicals_course_code
    ON public.practicals USING btree
    (course_code COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_created_at

CREATE INDEX IF NOT EXISTS idx_practicals_created_at
    ON public.practicals USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_due_date

CREATE INDEX IF NOT EXISTS idx_practicals_due_date
    ON public.practicals USING btree
    (due_date ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_lecturer_id

CREATE INDEX IF NOT EXISTS idx_practicals_lecturer_id
    ON public.practicals USING btree
    (lecturer_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_practical_type

CREATE INDEX IF NOT EXISTS idx_practicals_practical_type
    ON public.practicals USING btree
    (practical_type COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Index: idx_practicals_status

CREATE INDEX IF NOT EXISTS idx_practicals_status
    ON public.practicals USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;

-- Trigger: update_practicals_updated_at

CREATE OR REPLACE TRIGGER update_practicals_updated_at
    BEFORE UPDATE 
    ON public.practicals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger Function: update_updated_at_column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Table: public.quiz_job

-- DROP TABLE IF EXISTS public.quiz_job;

-- Create sequence for quiz_job
CREATE SEQUENCE IF NOT EXISTS quiz_job_id_seq;

CREATE TABLE IF NOT EXISTS public.quiz_job
(
    id integer NOT NULL DEFAULT nextval('quiz_job_id_seq'::regclass),  -- Use the sequence
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    due_date date,
    priority character varying(50) COLLATE pg_catalog."default" DEFAULT 'medium'::character varying,
    status character varying(50) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    course_code character varying(20) COLLATE pg_catalog."default",
    lecturer_id character varying(50) COLLATE pg_catalog."default",
    max_marks integer DEFAULT 100,
    duration integer DEFAULT 60,
    questions jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(50) COLLATE pg_catalog."default",
    type character varying(20) COLLATE pg_catalog."default" DEFAULT 'quiz'::character varying,
    module_id integer,
    faculty_id integer,
    intake_id integer,
    semester_id integer,
    total_marks integer,
    CONSTRAINT quiz_job_pkey PRIMARY KEY (id),
    CONSTRAINT chk_priority CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying]::text[])),
    CONSTRAINT chk_status CHECK (status::text = ANY (ARRAY['pending'::character varying, 'active'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[]))
);

ALTER TABLE IF EXISTS public.quiz_job
    OWNER to postgres;

-- Index: idx_quiz_job_course_code

-- DROP INDEX IF EXISTS public.idx_quiz_job_course_code;

CREATE INDEX IF NOT EXISTS idx_quiz_job_course_code
    ON public.quiz_job USING btree
    (course_code COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100);

-- Index: idx_quiz_job_created_at

-- DROP INDEX IF EXISTS public.idx_quiz_job_created_at;

CREATE INDEX IF NOT EXISTS idx_quiz_job_created_at
    ON public.quiz_job USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100);

-- Index: idx_quiz_job_created_by

-- DROP INDEX IF EXISTS public.idx_quiz_job_created_by;

CREATE INDEX IF NOT EXISTS idx_quiz_job_created_by
    ON public.quiz_job USING btree
    (created_by COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100);

-- Index: idx_quiz_job_lecturer_id

-- DROP INDEX IF EXISTS public.idx_quiz_job_lecturer_id;

CREATE INDEX IF NOT EXISTS idx_quiz_job_lecturer_id
    ON public.quiz_job USING btree
    (lecturer_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100);

-- Index: idx_quiz_job_status

-- DROP INDEX IF EXISTS public.idx_quiz_job_status;

CREATE INDEX IF NOT EXISTS idx_quiz_job_status
    ON public.quiz_job USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100);

-- Trigger: update_quiz_job_updated_at

-- DROP TRIGGER IF EXISTS update_quiz_job_updated_at ON public.quiz_job;

CREATE OR REPLACE TRIGGER update_quiz_job_updated_at
    BEFORE UPDATE 
    ON public.quiz_job
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
