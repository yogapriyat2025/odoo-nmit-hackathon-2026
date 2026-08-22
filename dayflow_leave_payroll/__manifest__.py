{
    'name': 'Dayflow Leave Payroll',
    'version': '1.0',
    'summary': 'Leave and Payroll Management for Dayflow',
    'category': 'Human Resources',
    'author': 'Dayflow Team',

    'depends': [
        'base',
        'hr',
        'dayflow_core',
        'dayflow_employee',
    ],

    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',

        'data/sequences.xml',

        'views/leave_views.xml',
        'views/payroll_views.xml',
        'views/menus.xml',
    ],

    'installable': True,
    'application': True,
}