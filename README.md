# node-express-mysql

https://www.djamware.com/post/5a1b779f80aca75eadc12d6e/mongo-express-vue-nodejs-mevn-stack-crud-web-application

https://www.djamware.com/post/58a91cdf80aca748640ce353/how-to-create-rest-api-easily-using-nodejs-expressjs-mongoosejs-and-mongodb


echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p


npm start
npm run devstart

# Release port for node

ps aux | grep node
kill -9 PID


# Branch Name on Terminal

If you are working with GIT and want to have the branch name in you Terminal Path. Then please use below code to do this thing.

cd ~
vim .bashrc

When you are in Edit Mode, just paste below code and save the file


parse_git_branch() {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
export PS1="\u@\h \[\033[32m\]\w\[\033[33m\]\$(parse_git_branch)\[\033[00m\] $ "


You will get this type of path when you are in your project with GIT: 
cis@CISM-I-121 /var/www/html/prolancework (IssuesList) $




# Permanent Solution for SQL Query:

1. sudo nano /etc/mysql/my.cnf
2. Add this to the end of the file
[mysqld]  
sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"
3. sudo service mysql restart to restart MySQL

This will disable ONLY_FULL_GROUP_BY for ALL users


https://github.com/manjeshpv/node-express-passport-mysql/tree/master/scripts

https://github.com/manjeshpv/node-express-passport-mysql




 # Use for passport authentication
https://stackoverflow.com/questions/30419175/node-js-passing-parameters-to-my-require-function-in-express-js-passport-js-und


# https://stackoverflow.com/questions/38162647/restrict-login-page-access-if-user-isloggedin-using-node-and-express

# http://www.passportjs.org/docs/authenticate/


# https://community.c9.io/t/setting-up-phpmyadmin/1723
# Open phpMyAdmin and select the SQL tab. Then type this command:

SET PASSWORD FOR root@localhost = PASSWORD('your_root_password');