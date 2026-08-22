from odoo import models, fields, api
from odoo.exceptions import ValidationError


class DayflowLeave(models.Model):

    _name = 'dayflow.leave'
    _description = 'Dayflow Leave Request'
    _order = 'create_date desc'

    name = fields.Char(
        string='Leave Reference',
        readonly=True,
        copy=False,
        default='New'
    )

    employee_id = fields.Many2one(
        'hr.employee',
        string='Employee',
        required=True,
        ondelete='cascade'
    )

    leave_type = fields.Selection(
        [
            ('paid', 'Paid Leave'),
            ('sick', 'Sick Leave'),
            ('unpaid', 'Unpaid Leave'),
        ],
        string='Leave Type',
        required=True
    )

    start_date = fields.Date(
        string='Start Date',
        required=True
    )

    end_date = fields.Date(
        string='End Date',
        required=True
    )

    days = fields.Integer(
        string='Number of Days',
        compute='_compute_days',
        store=True
    )

    remarks = fields.Text(
        string='Remarks'
    )

    manager_comment = fields.Text(
        string='Manager Comment'
    )

    state = fields.Selection(
        [
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ],
        string='Status',
        default='pending',
        required=True
    )

    @api.depends('start_date', 'end_date')
    def _compute_days(self):

        for record in self:

            if (
                record.start_date
                and record.end_date
            ):

                record.days = (
                    record.end_date
                    - record.start_date
                ).days + 1

            else:

                record.days = 0

    @api.constrains('start_date', 'end_date')
    def _check_dates(self):

        for record in self:

            if (
                record.start_date
                and record.end_date
                and record.end_date < record.start_date
            ):

                raise ValidationError(
                    'End date cannot be before start date.'
                )

    @api.model
    def create(self, vals):

        if not vals.get('name') or vals.get('name') == 'New':

            vals['name'] = (
                self.env['ir.sequence'].next_by_code(
                    'dayflow.leave'
                ) or 'LV/0001'
            )

        return super().create(vals)

    def action_approve(self):

        for record in self:

            record.state = 'approved'

    def action_reject(self):

        for record in self:

            record.state = 'rejected'

    def action_reset(self):

        for record in self:

            record.state = 'pending'