module.exports = {
    'tables': [{
            'name': 'roles',
            'parameters': [
                "`id` INT(11) NOT NULL AUTO_INCREMENT ",
                "`name` VARCHAR(100) NOT NULL ",
                "PRIMARY KEY (`id`)"
            ],
            'requireCommonParameters': true
        },
        {
            'name': 'users',
            'parameters': [
                "`id` INT(11) NOT NULL AUTO_INCREMENT ",
                "`username` VARCHAR(255) NOT NULL ",
                "`email` VARCHAR(255) NOT NULL ",
                "`password` VARCHAR(255) NOT NULL ",
                "`role_id` INT(11) NOT NULL DEFAULT '3' ",
                "`is_email_verified` TINYINT(4) NOT NULL DEFAULT '0' ",
                "PRIMARY KEY (`id`)"
            ],
            'requireCommonParameters': true
        },
        {
            'name': 'users_profile',
            'parameters': [
                "`id` INT(11) NOT NULL AUTO_INCREMENT ",
                "`user_id` INT(11) NOT NULL ",
                "`first_name` VARCHAR(255) NOT NULL ",
                "`last_name` VARCHAR(255) NOT NULL ",
                "`about_me` TEXT NOT NULL ",
                "`position` VARCHAR(255) NOT NULL DEFAULT '' ",
                "`phone` VARCHAR(50) NOT NULL DEFAULT '' ",
                "`location` VARCHAR(100) NOT NULL DEFAULT '' ",
                "PRIMARY KEY (`id`)"
            ],
            'requireCommonParameters': false
        },
        {
            'name': 'categories',
            'parameters': [
                "`id` INT(11) NOT NULL AUTO_INCREMENT ",
                "`name` VARCHAR(100) NOT NULL ",
                "PRIMARY KEY (`id`)"
            ],
            'requireCommonParameters': true
        },
        {
            'name': 'skills',
            'parameters': [
                "`id` INT(11) NOT NULL AUTO_INCREMENT ",
                "`category_id` INT(11) NOT NULL ",
                "`name` VARCHAR(100) NOT NULL ",
                "PRIMARY KEY (`id`)"
            ],
            'requireCommonParameters': true
        }
    ],
    'commonTableParameters': [
        "`status` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '1 = Active, 0 = Inactive' ",
        "`is_deleted` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '0 = Not Deleted, 1 = Deleted' ",
        "`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ",
        "`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP  ",
    ]
};