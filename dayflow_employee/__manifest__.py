{
    'name': 'Dayflow Employee',
    'version': '1.0',
    'summary': 'Employee Management for Dayflow',
    'category': 'Human Resources',
    'author': 'Dayflow Team',

    'depends': [
        'base',
        'hr',
        'dayflow_core',
    ],

    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/employee_views.xml',
        'views/menus.xml',
    ],

    'installable': True,
    'application': True,
}