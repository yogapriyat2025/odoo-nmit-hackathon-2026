{
    'name': 'Dayflow Attendance',
    'version': '1.0',
    'summary': 'Attendance Management for Dayflow',
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
        'data/attendance_data.xml',
        'views/attendance_views.xml',
        'views/menus.xml',
    ],

    'installable': True,
    'application': True,
}