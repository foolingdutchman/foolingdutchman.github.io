title: "MAC-OSX-10-10上搭建Apache，PHP，MySQL5-6-22，phpMyAdmin开发环境"
date: 2016-10-01
categories:
  - 服务器
---

**apache的配置**
apache已经自带了，只需如下三个命令就可以了。
开启apache服务 sudo apachectl start
停止apache服务 sudo apachectl stop
重启服务 sudo apachectl restart
查看版本 httpd -v

手动打开apache服务后，在浏览器输入localhost，将看到如下：

程序的根目录在/Library/WebServer/Documents/ 下，这个It works 就是里面的info.php打印出来的。下面介绍如何将apache的这个默认目录更改到用户目录下。 

- 1.在自己的用户目录下新建一个Sites文件夹，我的用户目录为linuxidc

- 2.进到cd /etc/apache2/users/目录下，sudo vim username.conf，内容为：

`&lt;Directory &quot;/Users/linuxidc/Sites/&quot;&gt;`
`AllowOverride All`
`Options Indexes MultiViews FollowSymLinks`
`Require all granted`
`&lt;/Directory&gt;`
         上面第一行里的linuxidc就是用户目录。然后将该文件权限改为644：
sudo chmod 644 username.conf  

- 3.进到/etc/apache2/目录，sudo vim httpd.conf 将下面三句话的注释去掉：
`LoadModule authz_core_module libexec/apache2/mod_authz_core.so`
`LoadModule authz_host_module libexec/apache2/mod_authz_host.so`
`LoadModule userdir_module libexec/apache2/mod_userdir.so`

```
`前两句应该已经不带注释了，把第三句注释放开。 
`
``` 然后找到`Include /private/etc/apache2/extra/httpd-userdir.conf`注释放开。 

```
`PS：在vim下只要切换到命令模式，然后输入`/”words you need find”`就能快速找到需要查找的词。
`
```

- 4.进到`/etc/apache2/extra/`目录，将`Include /private/etc/apache2/users/*.conf` 这句话放开注释。

然后终端输入：`sudo apachectl restart` 重启apache，浏览器输入： `loacal/~linuxidc/` 就能看到效果了。（linuxidc是我的用户目录的名字,后面不用再加/Sites）  经过以上步骤apache就搞好了。

**PHP配置**

   PHP的配置非常简单，就一个事，进到/etc/apache2/目录，编辑httpd.conf，找到LoadModule php5_module libexec/apache2/libphp5.so将其放开注释就行了。然后sudo apachectl restart 重启，在用户目录的Sites文件夹下，新建一个index.php,里面echo phpinfo() ，就可以看到效果了：

这里写图片描述

**安装MySQL5.6.22**

这个版本是最新的MySQL，安装方法跟5.5的略有不同。在官网下载mysql-5.6.22-osx10.9-x86_64.dmg，下面是安装方法：

- 1，双击安装的时候，不要勾选StartUp Item这一项：
这里写图片描述
如此安装完毕后，在设置－－－MySQL手动开启MySQL服务。
这里写图片描述
我这里已经打开了MySQL服务。下面要将其设置为开机自动启动。

- 2，默认状态下，我们用mysql的命令每次都要输入全路径，如`sudo /usr/local/mysql/support-files/mysql.server start`开启mysql服务，`/usr/local/mysql/bin/mysql -v`查看mysql版本，得先把bin目录配到环境变量里。切换到用户根目录 ，vim .bash_profile,输入：
`export PATH=”/usr/local/mysql/bin:$PATH”`
保存后，source .bash_profile使环境变量生效。接着就可以直接在终端里输入mysql命令了。
最后，通过`mysqladmin -u root password ‘yourpasswordhere’`给mysql的root用户设置密码。单引号里的内容就是要设的密码。

- 3，修复socket error的问题。有一个负责mysql 服务器 客户端通讯的socket文件，mysql的这个版本将其放在/tmp目录，但是OSX却默认的找 /var/mysql 这个目录，所以要建个软链接。新建目录 /var/mysql， 然后sudo ln -s /tmp/mysql.sock /var/mysql/mysql.sock 就ok了。

- 4，让mysql开机自动启动。
sudo vim sudo nano /Library/LaunchDaemons/com.mysql.mysql.plist,里面内容输入：
`KeepAlive`
`Label`
`com.mysql.mysqld`
`ProgramArguments`
`/usr/local/mysql/bin/mysqld_safe`
`–user=mysql`

保存后，修改权限：
`sudo chown root:wheel /Library/LaunchDaemons/com.mysql.mysql.plist`
`sudo chmod 644 /Library/LaunchDaemons/com.mysql.mysql.plist`
`sudo launchctl load -w /Library/LaunchDaemons/com.mysql.mysql.plist`
这样mysql就ok了！

**phpMyAdmin的安装**

从[http://www.phpmyadmin.net/home_page/downloads.php](http://www.phpmyadmin.net/home_page/downloads.php) 下载，我下的是phpMyAdmin-4.4.2-all-languages.zip这个版本，将其解压。然后最外层文件夹名字修改为phpmyadmin，进到~/Sites/phpmyadmin这个目录，新建文件夹：mkdir config 修改读写权限：chmod o+w config
然后浏览器输入：[http://localhost/~linuxidc/phpmyadmin/setup/](http://localhost/~linuxidc/phpmyadmin/setup/) (注意 中间的linuxidc 换成自己的用户名称)

这里写图片描述
点击 “新建服务器“，我上面已经新建好了，然后在这个界面：

这里写图片描述
密码处输入mysql的root用户密码。然后点击“应用“，这样config文件夹下就生成了config.inc.php，将该文件拷贝到phpmyadmin的根目录下。然后删除整个config文件夹。输入[http://localhost/~linuxidc/phpmyadmin/](http://localhost/~linuxidc/phpmyadmin/) 就可以看到登陆phpmyadmin的界面了。 如此，phpMyAdmin搞定。

**读写权限和分组问题**

最后遗留一个读写权限和归属问题，如果本地开发测试的话，这个步骤可以忽略。如果想让自己的mac切实作为一台服务器，那么这个还要设置下的。这个步骤等同于在布阿里云代码的时候，让public_html文件夹的所有东西可写，且归属于www一个意思。假设Sites文件夹下有个自己的项目：`testsite`
`sudo chmod -R a+w ~/Sites/testsite`设置所有人都可以读写

`sudo chown -R _www ~/Sites/testsite`设置testsite文件夹只归属`_www`组。

OK，PHP在MAC上的搭建到此结束。

**LAMP架构协同应用的实例——phpMyAdmin **
[http://www.linuxidc.com/Linux/2013-07/87645.htm](http://www.linuxidc.com/Linux/2013-07/87645.htm)

**LAMP应用之phpMyAdmin、Wordpress**
 [http://www.linuxidc.com/Linux/2013-04/82757.htm](http://www.linuxidc.com/Linux/2013-04/82757.htm)

**phpMyAdmin老出现登陆超时解决方法 **
[http://www.linuxidc.com/Linux/2012-09/70715.htm](http://www.linuxidc.com/Linux/2012-09/70715.htm)

**Ubuntu 安装phpMyAdmin与Adminer **
[http://www.linuxidc.com/Linux/2012-08/69419.htm](http://www.linuxidc.com/Linux/2012-08/69419.htm)

**在LAMP基础上实现SSL功能并安装phpMyAdmin **
[http://www.linuxidc.com/Linux/2012-07/66905.htm](http://www.linuxidc.com/Linux/2012-07/66905.htm)

**Ubuntu 14.04 配置 LAMP+phpMyAdmin PHP(5.5.9)开发环境 **
[http://www.linuxidc.com/Linux/2014-10/107924.htm](http://www.linuxidc.com/Linux/2014-10/107924.htm)

**phpMyAdmin 的详细介绍：**请点这里
**phpMyAdmin 的下载地址：**请点这里

本文永久更新链接地址：[http://www.linuxidc.com/Linux/2015-04/116347.htm](http://www.linuxidc.com/Linux/2015-04/116347.htm)