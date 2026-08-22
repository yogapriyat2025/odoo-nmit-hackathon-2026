-- Today's attendance
SELECT e.employee_id,e.name,a.attendance_date,a.check_in,a.check_out,a.worked_hours,a.status
FROM attendance a JOIN employees e ON e.id=a.employee_id
WHERE a.attendance_date=CURRENT_DATE ORDER BY e.name;

-- Pending leaves
SELECT l.id,e.employee_id,e.name,l.leave_type,l.date_from,l.date_to,l.days,l.remarks
FROM leave_requests l JOIN employees e ON e.id=l.employee_id
WHERE l.state='pending' ORDER BY l.created_at DESC;

-- Payroll
SELECT e.employee_id,e.name,p.month,p.year,p.gross,p.deductions,p.net_salary,p.state
FROM payroll p JOIN employees e ON e.id=p.employee_id
ORDER BY p.year DESC,p.month DESC,e.name;
