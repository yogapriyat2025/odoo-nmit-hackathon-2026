from odoo import http
from odoo.http import request

class DayflowAPI(http.Controller):

    @http.route("/dayflow/api/employees", type="http", auth="user", methods=["GET"], csrf=False)
    def employees(self):
        records = request.env["dayflow.employee"].search([])
        data = [{
            "id": r.id,
            "employee_id": r.employee_id,
            "name": r.name,
            "email": r.email,
            "phone": r.phone,
            "department": r.department,
            "job_title": r.job_title,
            "salary": r.salary,
            "active": r.active,
        } for r in records]
        return request.make_json_response(data)

    @http.route("/dayflow/api/attendance", type="http", auth="user", methods=["GET"], csrf=False)
    def attendance(self):
        records = request.env["dayflow.attendance"].search([])
        data = [{
            "id": r.id,
            "employee_id": r.employee_id.id,
            "employee": r.employee_id.name,
            "date": str(r.date) if r.date else None,
            "check_in": str(r.check_in) if r.check_in else None,
            "check_out": str(r.check_out) if r.check_out else None,
            "worked_hours": r.worked_hours,
            "status": r.status,
        } for r in records]
        return request.make_json_response(data)

    @http.route("/dayflow/api/leaves", type="http", auth="user", methods=["GET"], csrf=False)
    def leaves(self):
        records = request.env["dayflow.leave"].search([])
        data = [{
            "id": r.id,
            "employee_id": r.employee_id.id,
            "employee": r.employee_id.name,
            "leave_type": r.leave_type,
            "date_from": str(r.date_from) if r.date_from else None,
            "date_to": str(r.date_to) if r.date_to else None,
            "days": r.days,
            "remarks": r.remarks,
            "state": r.state,
        } for r in records]
        return request.make_json_response(data)

    @http.route("/dayflow/api/payroll", type="http", auth="user", methods=["GET"], csrf=False)
    def payroll(self):
        records = request.env["dayflow.payroll"].search([])
        data = [{
            "id": r.id,
            "employee_id": r.employee_id.id,
            "employee": r.employee_id.name,
            "month": r.month,
            "year": r.year,
            "basic": r.basic,
            "hra": r.hra,
            "allowances": r.allowances,
            "deductions": r.deductions,
            "gross": r.gross,
            "net_salary": r.net_salary,
            "state": r.state,
        } for r in records]
        return request.make_json_response(data)
