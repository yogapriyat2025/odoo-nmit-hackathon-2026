{
    'name': 'Dayflow Core',
    'version': '1.0',
    'summary': 'Core HRMS functionality for Dayflow',
    'category': 'Human Resources',
    'author': 'Dayflow Team',

    'depends': [
        'base',
        'hr',
    ],

    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'data/data.xml',
        'views/dashboard_views.xml',
        'views/menus.xml',
    ],

    'installable': True,
    'application': True,
}