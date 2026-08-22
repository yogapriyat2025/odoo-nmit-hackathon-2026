from odoo import models, fields

class DayflowPayroll(models.Model):
    _name = "dayflow.payroll"
    _description = "Dayflow Payroll"
    _order = "year desc, month desc"

    employee_id = fields.Many2one("dayflow.employee", required=True, ondelete="cascade")
    month = fields.Selection([(str(i), str(i)) for i in range(1,13)], required=True)
    year = fields.Integer(required=True, default=lambda self: fields.Date.today().year)
    basic = fields.Float()
    hra = fields.Float()
    allowances = fields.Float()
    deductions = fields.Float()
    gross = fields.Float(compute="_compute_totals", store=True)
    net_salary = fields.Float(compute="_compute_totals", store=True)
    state = fields.Selection([
        ("draft", "Draft"),
        ("processed", "Processed"),
    ], default="draft")

    def _compute_totals(self):
        for rec in self:
            rec.gross = rec.basic + rec.hra + rec.allowances
            rec.net_salary = rec.gross - rec.deductions

    def action_process(self):
        self.write({"state": "processed"})
