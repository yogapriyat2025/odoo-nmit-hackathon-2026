from odoo import models, fields

class DayflowEmployee(models.Model):
    _name = "dayflow.employee"
    _description = "Dayflow Employee"
    _order = "name"

    name = fields.Char(required=True)
    employee_id = fields.Char(string="Employee ID", required=True, copy=False)
    email = fields.Char()
    phone = fields.Char()
    department = fields.Char()
    job_title = fields.Char()
    manager = fields.Char()
    joining_date = fields.Date()
    address = fields.Text()
    salary = fields.Float()
    active = fields.Boolean(default=True)
    user_id = fields.Many2one("res.users", string="User")

    _sql_constraints = [
        ("employee_id_unique", "unique(employee_id)", "Employee ID must be unique.")
    ]
