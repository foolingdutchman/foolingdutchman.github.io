---
title: ""
date: 2016-08-07
categories:
  - Uncategorized
---

##Mac上搭建基于GitHub的Hexo博客

```
`这是一篇详细文章来讲述用Mac搭建Hexo博客于Github上的完整历程， 也是踩了无数的坑搭起来的，现在写下些经验来分享，希望能帮大家少踩些坑。
`
```###环境配置
Hexo官网上本就有对Hexo安装及使用的详细介绍，墙裂推荐。这里来讲述自己安装的亲身步骤，或有区别。

*1.Node.js*
用来生成静态页面。移步Node.js官网，下载v5.5.0 Stable 一路安装即可。

*2.Git*
用来将本地Hexo内容提交到Github上。Xcode自带Git，这里不再赘述。如果没有Xcode可以参考Hexo官网上的安装方法。

*安装Hexo*
当Node.js和Git都安装好后就可以正式安装Hexo了，终端执行如下命令：

```
`$ sudo npm install -g hexo
`
```输入管理员密码（Mac登录密码）即开始安装 (sudo:linux系统管理指令  -g:全局安装)

注意坑一：Hexo官网上的安装命令是$ npm install -g hexo-cli，安装时不要忘记前面加上sudo，否则会因为权限问题报错。
初始化
终端cd到一个你选定的目录，执行hexo init命令：

```
`$ hexo init blog
`
```blog是你建立的文件夹名称。cd到blog文件夹下，执行如下命令，安装npm：

```
`$ npm install
`
```执行如下命令，开启hexo服务器：

```
`$ hexo s
`
```此时，浏览器中打开网址[http://localhost:4000，能看到如下页面：](http://localhost:4000，能看到如下页面：)

[http://localhost:4000](http://localhost:4000)
本地设置好后，接下来开始关联Github。

####关联Github

#####1.创建仓库
登录你的Github帐号，新建仓库，名为用户名.github.io固定写法，如gonghonglou.github.io即下图中1所示：

本地的blog文件夹下内容为：

_config.yml
db.json
node_modules
package.json
scaffolds
source
themes
终端cd到blog文件夹下，vim打开_config.yml，命令如下：

```
`$ vim _config.yml
`
```打开后往下滑到最后，修改成下边的样子：

deploy:
    type: git
    repository: [https://github.com/gonghonglou/gonghonglou.github.io.git](https://github.com/gonghonglou/gonghonglou.github.io.git)
    branch: master
你需要将repository后gonghonglou换成你自己的用户名，地址在上图2位置获取。hexo 3.1.1版本后type:值为git。

**注意坑二：在配置所有的_config.yml文件时（包括theme中的），在所有的冒号:后边都要加一个空格，否则执行hexo命令会报错，切记 切记**

在blog文件夹目录下执行生成静态页面命令：

```
`$ hexo generate        或者：hexo g
`
```此时若出现如下报错：

```
`ERROR Local hexo not found in ~/blog
ERROR Try runing: &apos;npm install hexo --save&apos;
`
```则执行命令：

```
`npm install hexo --save
`
```若无报错，自行忽略此步骤。
再执行配置命令：

```
`$ hexo deploy            或者：hexo d
`
```注意坑三：若执行命令hexo deploy仍然报错：无法连接git或找不到git，则执行如下命令来安装hexo-deployer-git：

```
`$ npm install hexo-deployer-git --save
`
```再次执行hexo generate和hexo deploy命令。

若你未关联Github，则执行hexo deploy命令时终端会提示你输入Github的用户名和密码，即

```
`Username for &apos;https://github.com&apos;:
Password for &apos;https://github.com&apos;:
`
```hexo deploy 命令执行成功后，浏览器中打开网址[http://gonghonglou.github.io（将gonghonglou换成你的用户名）能看到和打开http://localhost:4000时一样的页面。](http://gonghonglou.github.io（将gonghonglou换成你的用户名）能看到和打开http://localhost:4000时一样的页面。)

为避免每次输入Github用户名和密码的麻烦，可参照第二节方法

#####2.添加ssh key到Github
1.1.检查SSH keys是否存在Github
执行如下命令，检查SSH keys是否存在。如果有文件id_rsa.pub或id_dsa.pub，则直接进入步骤1.3将SSH key添加到Github中，否则进入下一步生成SSH key。

```
`$ ls -al ~/.ssh
`
```1.2.生成新的ssh key
执行如下命令生成public/private rsa key pair，注意将your_email@example.com换成你自己注册Github的邮箱地址。

```
`$ ssh-keygen -t rsa -C &quot;your_email@example.com&quot;
`
```默认会在相应路径下（~/.ssh/id_rsa.pub）生成id_rsa和id_rsa.pub两个文件。

1.3.将ssh key添加到Github中
Find前往文件夹~/.ssh/id_rsa.pub打开id_rsa.pub文件，里面的信息即为SSH key，将这些信息复制到Github的Add SSH key页面即可。

进入Github –&gt; Settings –&gt; SSH keys –&gt; add SSH key:

Title里任意添一个标题，将复制的内容粘贴到Key里，点击下方Add key绿色按钮即可。

#####3.发布文章
终端cd到blog文件夹下，执行如下命令新建文章：

```
`hexo new &quot;postName&quot;
`
```名为postName.md的文件会建在目录/blog/source/_posts下。你当然可以用vim来编辑文章。

文章编辑完成后，终端cd到blog文件夹下，执行如下命令来发布：

```
`hexo generate             //生成静态页面
hexo deploy            //将文章部署到Github
`
```至此，Mac上搭建基于Github的Hexo博客就完成了。下面的内容是介绍安装theme，添加评论功能和绑定个人域名，如果有兴趣且还有耐心的话，请继续吧。

安装theme
你可以到Hexo官网主题页去搜寻自己喜欢的theme。这里以hexo-theme-next为例

终端cd到 blog 目录下执行如下命令：

```
`$ git clone https://github.com/iissnan/hexo-theme-next themes/next
`
```将blog目录下_config.yml里theme的名称landscape修改为next

终端cd到blog目录下执行如下命令(每次部署文章的步骤)：

```
`$ hexo clean           //清除缓存文件 (db.json) 和已生成的静态文件 (public)
$ hexo g             //生成缓存和静态文件
$ hexo d             //重新部署到服务器
`
```至于更改theme内容，比如名称，描述，头像等去修改blog/_config.yml文件和blog/themes/next/_config.yml文件中对应的属性名称即可， 不要忘记冒号:后加空格。 NexT 使用文档里有极详细的介绍。

终端cd到blog目录下执行如下命令重新部署：

```
`$ hexo clean
$ hexo g
$ hexo d
`
```大功告成！