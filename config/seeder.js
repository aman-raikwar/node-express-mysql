var bcrypt = require('bcrypt-nodejs');

module.exports = {
    'tables': [{
            'name': 'roles',
            'data': [
                { name: 'Administrator' },
                { name: 'Teachers' },
                { name: 'Student' }
            ]
        },
        {
            'name': 'users',
            'data': [{
                    username: 'admin',
                    email: 'admin@mailinator.com',
                    password: bcrypt.hashSync('123456', null, null),
                    role_id: 1,
                    is_email_verified: 1
                },
                {
                    username: 'teacher',
                    email: 'teacher@mailinator.com',
                    password: bcrypt.hashSync('123456', null, null),
                    role_id: 2,
                    is_email_verified: 1
                },
                {
                    username: 'student',
                    email: 'student@mailinator.com',
                    password: bcrypt.hashSync('123456', null, null),
                    role_id: 3,
                    is_email_verified: 1
                }
            ]
        },
        {
            'name': 'users_profile',
            'data': [{
                    user_id: 1,
                    first_name: 'Aman',
                    last_name: 'Raikwar',
                    about_me: "I'm the Administrator of the Website",
                    position: 'Sr. Software Developer',
                    phone: '(942) 538 8641',
                    location: 'India'
                },
                {
                    user_id: 2,
                    first_name: 'Pratik',
                    last_name: 'Soni',
                    about_me: "I'm the Teacher on the Website",
                    position: 'Sr. Software Developer',
                    phone: '(999) 999 9999',
                    location: 'India'
                },
                {
                    user_id: 3,
                    first_name: 'Krushang',
                    last_name: 'Lattoo',
                    about_me: "I'm the Student on the Website",
                    position: 'Software Developer',
                    phone: '(999) 999 9999',
                    location: 'India'
                }
            ]
        },
        {
            'name': 'categories',
            'data': [
                { name: 'Website Development' },
                { name: 'Mobile App Development' },
                { name: 'Creative Design' },
                { name: 'Languages' },
                { name: 'Media' }
            ]
        },
        {
            'name': 'skills',
            'data': [
                { category_id: 1, name: 'Wordpress' },
                { category_id: 1, name: 'Magento' },
                { category_id: 2, name: 'Android' },
                { category_id: 2, name: 'iPhone' },
                { category_id: 3, name: 'Photoshop' },
                { category_id: 4, name: 'English' },
                { category_id: 4, name: 'Hindi' },
                { category_id: 5, name: 'Photography' },
                { category_id: 5, name: 'Videography' }
            ]
        }
    ]
};