-- Dayflow HRMS PostgreSQL schema

CREATE TABLE IF NOT EXISTS employees (
 id BIGSERIAL PRIMARY KEY,
 employee_id VARCHAR(50) NOT NULL UNIQUE,
 name VARCHAR(150) NOT NULL,
 email VARCHAR(255) UNIQUE,
 phone VARCHAR(30),
 department VARCHAR(100),
 job_title VARCHAR(120),
 manager VARCHAR(150),
 joining_date DATE,
 address TEXT,
 salary NUMERIC(12,2) DEFAULT 0 CHECK (salary >= 0),
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
 id BIGSERIAL PRIMARY KEY,
 employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
 attendance_date DATE NOT NULL,
 check_in TIMESTAMPTZ,
 check_out TIMESTAMPTZ,
 worked_hours NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (worked_hours >= 0),
 status VARCHAR(20) NOT NULL DEFAULT 'present'
   CHECK (status IN ('present','absent','half_day','leave')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(employee_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS leave_requests (
 id BIGSERIAL PRIMARY KEY,
 employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
 leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('paid','sick','unpaid')),
 date_from DATE NOT NULL,
 date_to DATE NOT NULL,
 days NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (days >= 0),
 remarks TEXT,
 state VARCHAR(20) NOT NULL DEFAULT 'pending'
   CHECK (state IN ('pending','approved','rejected')),
 admin_comment TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CHECK (date_to >= date_from)
);

CREATE TABLE IF NOT EXISTS payroll (
 id BIGSERIAL PRIMARY KEY,
 employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
 month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
 year INTEGER NOT NULL CHECK (year >= 2000),
 basic NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (basic >= 0),
 hra NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (hra >= 0),
 allowances NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (allowances >= 0),
 deductions NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (deductions >= 0),
 gross NUMERIC(12,2) GENERATED ALWAYS AS (basic + hra + allowances) STORED,
 net_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic + hra + allowances - deductions) STORED,
 state VARCHAR(20) NOT NULL DEFAULT 'draft'
   CHECK (state IN ('draft','processed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(employee_id, month, year)
);

CREATE TABLE IF NOT EXISTS documents (
 id BIGSERIAL PRIMARY KEY,
 employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
 document_type VARCHAR(50) NOT NULL,
 document_name VARCHAR(255) NOT NULL,
 file_url TEXT,
 mime_type VARCHAR(100),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
 id BIGSERIAL PRIMARY KEY,
 employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
 title VARCHAR(200) NOT NULL,
 message TEXT NOT NULL,
 notification_type VARCHAR(50),
 is_read BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_leave_employee_state ON leave_requests(employee_id, state);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_period ON payroll(employee_id, year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_employee_read ON notifications(employee_id, is_read);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
