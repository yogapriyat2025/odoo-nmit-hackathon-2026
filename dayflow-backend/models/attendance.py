from odoo import models, fields, api

class DayflowAttendance(models.Model):
    _name = "dayflow.attendance"
    _description = "Dayflow Attendance"
    _order = "date desc"

    employee_id = fields.Many2one("dayflow.employee", required=True, ondelete="cascade")
    date = fields.Date(required=True, default=fields.Date.context_today)
    check_in = fields.Datetime()
    check_out = fields.Datetime()
    worked_hours = fields.Float(compute="_compute_hours", store=True)
    status = fields.Selection([
        ("present", "Present"),
        ("absent", "Absent"),
        ("half_day", "Half-day"),
        ("leave", "Leave"),
    ], default="present", required=True)

    @api.depends("check_in", "check_out")
    def _compute_hours(self):
        for rec in self:
            if rec.check_in and rec.check_out:
                rec.worked_hours = (rec.check_out - rec.check_in).total_seconds() / 3600
            else:
                rec.worked_hours = 0.0

    def action_check_in(self):
        for rec in self:
            rec.check_in = fields.Datetime.now()
            rec.status = "present"

    def action_check_out(self):
        for rec in self:
            rec.check_out = fields.Datetime.now()
