from odoo import models, fields, api


class HrEmployee(models.Model):

    _inherit = 'hr.employee'

    dayflow_employee_id = fields.Char(
        string='Employee ID',
        readonly=True,
        copy=False,
        index=True
    )

    date_of_birth = fields.Date(
        string='Date of Birth'
    )

    gender = fields.Selection(
        [
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
        ],
        string='Gender'
    )

    personal_email = fields.Char(
        string='Personal Email'
    )

    personal_phone = fields.Char(
        string='Personal Phone'
    )

    address_line = fields.Char(
        string='Address'
    )

    city = fields.Char(
        string='City'
    )

    state_name = fields.Char(
        string='State'
    )

    country_name = fields.Char(
        string='Country'
    )

    postal_code = fields.Char(
        string='Postal Code'
    )

    joining_date = fields.Date(
        string='Joining Date'
    )

    employment_type = fields.Selection(
        [
            ('full_time', 'Full Time'),
            ('part_time', 'Part Time'),
            ('contract', 'Contract'),
            ('intern', 'Intern'),
        ],
        string='Employment Type',
        default='full_time'
    )

    employee_status = fields.Selection(
        [
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('on_leave', 'On Leave'),
        ],
        string='Employee Status',
        default='active'
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

    net_salary = fields.Float(
        string='Net Salary',
        compute='_compute_net_salary',
        store=True
    )

    document_name = fields.Char(
        string='Document Name'
    )

    document_number = fields.Char(
        string='Document Number'
    )

    document_file = fields.Binary(
        string='Document',
        attachment=True
    )

    document_filename = fields.Char(
        string='Document Filename'
    )

    profile_picture = fields.Binary(
        string='Profile Picture',
        attachment=True
    )

    profile_picture_filename = fields.Char(
        string='Profile Picture Filename'
    )

    @api.depends(
        'basic_salary',
        'allowance',
        'deduction'
    )
    def _compute_net_salary(self):

        for employee in self:

            employee.net_salary = (
                employee.basic_salary
                + employee.allowance
                - employee.deduction
            )

    @api.model
    def create(self, vals):

        if not vals.get('dayflow_employee_id'):

            vals['dayflow_employee_id'] = (
                self.env['ir.sequence'].next_by_code(
                    'dayflow.employee'
                ) or 'EMP0001'
            )

        return super().create(vals)