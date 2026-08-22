from odoo import models, fields, api

class DayflowLeave(models.Model):
    _name = "dayflow.leave"
    _description = "Dayflow Leave Request"
    _order = "create_date desc"

    employee_id = fields.Many2one("dayflow.employee", required=True, ondelete="cascade")
    leave_type = fields.Selection([
        ("paid", "Paid Leave"),
        ("sick", "Sick Leave"),
        ("unpaid", "Unpaid Leave"),
    ], required=True, default="paid")
    date_from = fields.Date(required=True)
    date_to = fields.Date(required=True)
    days = fields.Float(compute="_compute_days", store=True)
    remarks = fields.Text()
    state = fields.Selection([
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ], default="pending", required=True)
    admin_comment = fields.Text()

    @api.depends("date_from", "date_to")
    def _compute_days(self):
        for rec in self:
            if rec.date_from and rec.date_to:
                rec.days = (rec.date_to - rec.date_from).days + 1
            else:
                rec.days = 0

    def action_approve(self):
        self.write({"state": "approved"})

    def action_reject(self):
        self.write({"state": "rejected"})
