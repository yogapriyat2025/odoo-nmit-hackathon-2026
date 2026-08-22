-- Demo data
INSERT INTO employees (employee_id,name,email,phone,department,job_title,manager,joining_date,salary)
VALUES
('EMP001','John Doe','john.doe@dayflow.com','+91 98765 43210','Engineering','Software Developer','Priya S','2024-01-12',42500),
('EMP002','Arun Kumar','arun.kumar@dayflow.com','+91 98765 43211','Engineering','Developer','Priya S','2024-03-05',45000),
('EMP003','Priya S','priya.s@dayflow.com','+91 98765 43212','HR','HR Officer','HR Admin','2023-07-10',52000)
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO attendance (employee_id,attendance_date,check_in,status)
SELECT id,CURRENT_DATE,NOW(),'present' FROM employees WHERE employee_id='EMP001'
ON CONFLICT (employee_id,attendance_date) DO NOTHING;

INSERT INTO payroll (employee_id,month,year,basic,hra,allowances,deductions,state)
SELECT id,EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT,EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,30000,12000,6500,6000,'processed'
FROM employees WHERE employee_id='EMP001'
ON CONFLICT (employee_id,month,year) DO NOTHING;
