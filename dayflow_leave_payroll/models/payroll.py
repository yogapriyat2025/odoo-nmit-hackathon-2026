from odoo import models, fields, api


class DayflowPayroll(models.Model):

    _name = 'dayflow.payroll'
    _description = 'Dayflow Payroll'
    _order = 'year desc, month desc'

    name = fields.Char(
        string='Payslip Number',
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

    month = fields.Selection(
        [
            ('01', 'January'),
            ('02', 'February'),
            ('03', 'March'),
            ('04', 'April'),
            ('05', 'May'),
            ('06', 'June'),
            ('07', 'July'),
            ('08', 'August'),
            ('09', 'September'),
            ('10', 'October'),
            ('11', 'November'),
            ('12', 'December'),
        ],
        string='Month',
        required=True
    )

    year = fields.Integer(
        string='Year',
        required=True,
        default=lambda self: fields.Date.today().year
    )

    basic_salary = fields.Float(
        string='Basic Salary'
    )

    allowance = fields.Float(
        string='Allowance'
    )

    deduction = fields.Float(
        string='Deduction'
    )

    leave_deduction = fields.Float(
        string='Leave Deduction'
    )

    net_salary = fields.Float(
        string='Net Salary',
        compute='_compute_net_salary',
        store=True
    )

    state = fields.Selection(
        [
            ('draft', 'Draft'),
            ('confirmed', 'Confirmed'),
            ('paid', 'Paid'),
        ],
        string='Status',
        default='draft',
        required=True
    )

    @api.depends(
        'basic_salary',
        'allowance',
        'deduction',
        'leave_deduction'
    )
    def _compute_net_salary(self):

        for record in self:

            record.net_salary = (
                record.basic_salary
                + record.allowance
                - record.deduction
                - record.leave_deduction
            )

    @api.model
    def create(self, vals):

        if not vals.get('name') or vals.get('name') == 'New':

            vals['name'] = (
                self.env['ir.sequence'].next_by_code(
                    'dayflow.payroll'
                ) or 'PAY/0001'
            )

        return super().create(vals)

    def action_confirm(self):

        self.write({
            'state': 'confirmed'
        })

    def action_paid(self):

        self.write({
            'state': 'paid'
        })

    def action_reset(self):

        self.write({
            'state': 'draft'
        })