from odoo import models, fields


class DayflowDashboard(models.Model):
    _name = 'dayflow.dashboard'
    _description = 'Dayflow Dashboard'

    name = fields.Char(
        string='Dashboard',
        required=True
    )

    description = fields.Text(
        string='Description'
    )