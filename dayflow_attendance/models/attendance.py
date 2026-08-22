from odoo import models, fields, api
from odoo.exceptions import ValidationError


class DayflowAttendance(models.Model):

    _name = 'dayflow.attendance'
    _description = 'Dayflow Attendance'
    _order = 'attendance_date desc'

    name = fields.Char(
        string='Attendance Reference',
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

    attendance_date = fields.Date(
        string='Date',
        required=True,
        default=fields.Date.context_today
    )

    check_in = fields.Datetime(
        string='Check In'
    )

    check_out = fields.Datetime(
        string='Check Out'
    )

    worked_hours = fields.Float(
        string='Worked Hours',
        compute='_compute_worked_hours',
        store=True
    )

    status = fields.Selection(
        [
            ('present', 'Present'),
            ('absent', 'Absent'),
            ('half_day', 'Half-day'),
            ('leave', 'Leave'),
        ],
        string='Status',
        default='present',
        required=True
    )

    remarks = fields.Text(
        string='Remarks'
    )

    @api.depends('check_in', 'check_out')
    def _compute_worked_hours(self):

        for record in self:

            if record.check_in and record.check_out:

                seconds = (
                    record.check_out - record.check_in
                ).total_seconds()

                record.worked_hours = seconds / 3600.0

            else:

                record.worked_hours = 0.0

    @api.constrains('check_in', 'check_out')
    def _check_times(self):

        for record in self:

            if (
                record.check_in
                and record.check_out
                and record.check_out < record.check_in
            ):

                raise ValidationError(
                    'Check-out cannot be before check-in.'
                )

    @api.constrains('employee_id', 'attendance_date')
    def _check_duplicate_attendance(self):

        for record in self:

            duplicate = self.search([
                ('id', '!=', record.id),
                ('employee_id', '=', record.employee_id.id),
                ('attendance_date', '=', record.attendance_date),
            ], limit=1)

            if duplicate:

                raise ValidationError(
                    'Attendance already exists for this employee on this date.'
                )

    @api.model
    def create(self, vals):

        if not vals.get('name') or vals.get('name') == 'New':

            vals['name'] = (
                self.env['ir.sequence'].next_by_code(
                    'dayflow.attendance'
                ) or 'ATT/0001'
            )

        return super().create(vals)

    def action_check_in(self):

        for record in self:

            if record.check_in:

                raise ValidationError(
                    'Employee has already checked in.'
                )

            record.check_in = fields.Datetime.now()
            record.status = 'present'

    def action_check_out(self):

        for record in self:

            if not record.check_in:

                raise ValidationError(
                    'Employee must check in first.'
                )

            if record.check_out:

                raise ValidationError(
                    'Employee has already checked out.'
                )

            record.check_out = fields.Datetime.now()

    def action_present(self):

        self.write({
            'status': 'present'
        })

    def action_absent(self):

        self.write({
            'status': 'absent'
        })

    def action_half_day(self):

        self.write({
            'status': 'half_day'
        })

    def action_leave(self):

        self.write({
            'status': 'leave'
        })