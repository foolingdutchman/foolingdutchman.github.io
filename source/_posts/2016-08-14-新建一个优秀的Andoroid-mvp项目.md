title: "新建一个优秀的Andoroid-mvp项目"
date: 2016-08-14
categories:
  - 架构
---

**1.项目结构**

如果项目比较小的话：

- app——Application Activity Fragment Presenter等的顶级父类

- config——API,常量表等

- model——数据层

- entities——数据模型

- presenter——MVP的P

- service——服务

- ui——MVP的V

- utils——工具类集合

- widget——各个可复用View集合

如果项目比较大，上面的方式一定会造成presenter和view里近百个文件。看瞎眼系列。推荐下列方式：

- app

- config

- model

- entities

- module——将界面层以功能模块分配包。
launch

- main

- account

- news

- music

- ……

- utils

- widget

**2.配置主题**
对于不遵守Material Design的项目无视这一步。
1.先在color.xml中写好需要的颜色：
`&lt;resources&gt;`
`&lt;color name=&quot;Orange&quot;&gt;#ff5722&lt;/color&gt;`
  `&lt;color name=&quot;DeepPurple&quot;&gt;#673AB7&lt;/color&gt;`
`&lt;color name=&quot;DeepPurple900&quot;&gt;#311B92&lt;/color&gt;`
 `&lt;color name=&quot;White&quot;&gt;#fff&lt;/color&gt;`
   `&lt;color name=&quot;Gray&quot;&gt;#888888&lt;/color&gt;`
   `&lt;color name=&quot;Gray100&quot;&gt;#dddddd&lt;/color&gt;`
   `&lt;color name=&quot;Gray600&quot;&gt;#999999&lt;/color&gt;`
`&lt;/resources&gt;`
注意color.xml是配色表。应该是描述颜色而不是对字体颜色，背景颜色等的定义。这样能防止相近的颜色重复定义。而导致界面颜色不统一。

2.在style.xml里定义主题：

`&lt;style name=&quot;AppTheme.Base&quot;` `parent=&quot;Theme.AppCompat.Light.NoActionBar&quot;&gt;`
 `&lt;!-- Customize your theme here. --&gt;`
`&lt;item name=&quot;colorPrimary&quot;&gt;@color/DeepPurple&lt;/item&gt;`
`&lt;item name=&quot;colorPrimaryDark&quot;&gt;@color/DeepPurple900&lt;/item&gt;`
`&lt;item name=&quot;colorAccent&quot;&gt;@color/Orange&lt;/item&gt;`
`&lt;/style&gt;`
`&lt;style name=&quot;AppTheme&quot; parent=&quot;AppTheme.Base&quot;&gt;&lt;/style&gt;`
在res目录下，创建一个values-v21目录，再创建一个style.xml:

`&lt;style name=&quot;AppTheme&quot; parent=&quot;AppTheme.Base&quot;&gt;`
   `&lt;item name=&quot;android:windowDrawsSystemBarBackgrounds&quot;&gt;true&lt;/item&gt;`
    `&lt;item name=&quot;android:statusBarColor&quot;&gt;?colorPrimaryDark&lt;/item&gt;`
`&lt;/style&gt;`
然后在AndroidManifest.xml文件中修改application的theme属性为上面定义的AppTheme.即可实现沉浸式状态栏。
然后关于Theme与Toolbar的详细设置参考博客：
[http://www.cnblogs.com/Jude95/p/4369816.html](http://www.cnblogs.com/Jude95/p/4369816.html)
[http://www.cnblogs.com/Jude95/p/4370176.html](http://www.cnblogs.com/Jude95/p/4370176.html)

**3.依赖库与SDK**
必选的库:

- gradle-retrolambda——Android的lambda表达式插件

- fresco——Android最屌图片加载库

- material-dialogs ——Material Dialog向下兼容库

- material-ripple——Ripple向下兼容库

- fastjson——最快JSON解析

- butterknife——View注解库和配套插件android-butterknife-zelezny

- ActiveAndroid——数据库注解库。

- RxAndroid——Rx函数响应式编程中文文档

- retrofit,okhttp,sqlbrite,okio——Square家的精品多啊

- compile ‘com.android.support:design:23.0.1’——谷歌Material Design控件库

几个常用库：

- Utils——Android各种小功能集合

- RollViewPager——自动轮播使用方便的ViewPager

- EasyRecyclerView——支持下拉上拉刷新等功能全面的RecyclerView

- SwipeBackHelper——Activity滑动关闭支持库，能达到微信效果

尝试了很多，这几个是现在常用的。

- 融云——即时通讯

- 友盟——数据统计,推送，意见反馈，自动更新，第三方分享及登录,社区

- 七牛——云存储

- Mob——短信验证

- Bmob——做后台不求人

依赖这一大堆库和SDK以后。建议在合适的时机初始化他们，而不是全堆在`Application`的`onCreate()`里面。这样会导致启动时间过长。启动后也会较卡。虽然是不会影响功能正常使用。

**4.配置Gradle**
某些SDK运行时需要检查签名是否正确。所以在debug模式时也必须用正式KEY签名。而把签名放进版本控制不是明智的做法。所以推荐下面的做法：
在app的gradle加入下面代码

```
`Properties props = new Properties()
props.load(new FileInputStream(file(&quot;signing.properties&quot;)))
android {
signingConfigs {
    release{
        keyAlias props[&apos;KEY_ALIAS&apos;]
        keyPassword props[&apos;KEY_PASSWORD&apos;]
        storeFile file(props[&apos;KEYSTORE_FILE&apos;])
        storePassword props[&apos;KEYSTORE_PASSWORD&apos;]
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
    debug {
        signingConfig signingConfigs.release
    }
}
}
`
```在app的gradle文件同级目录新建signing.properties文件，里面填入你的key的相应信息

```
`KEYSTORE_FILE = C:\\Users\\Mr.Jude\\Documents\\Android\\HelloWorld.jks
KEYSTORE_PASSWORD = xxxxxx
KEY_ALIAS = xxxxxx
KEY_PASSWORD = xxxxxx
`
```将signing.properties添加进忽略目录。
其他人pull下来代码后。自己新建signing.properties填入相应信息后即可编译成功。

**5.制定开发规范**
为了避免合作开发写的代码风格迥异。或做出了多套开发模式。下面是个例子。毕竟是为了高效开发而制定的。适合自己项目的才是最好。

- 所有Activity继承BaseActivity

- 所有Fragment继承BaseFragment

- 所有Presenter继承BasePresenter
这样利于生命周期管理。也可以方便的全局修改。

**命名**，例
AccountFragment
UserDetailActivity

**layout命名**，例
activity_collection
fragment_account
item_person
include_toolbar
view_progress
不过对于庞大项目的开发。近百个activity开头的layout列表还是会眼瞎。所以那种情况会在前面加上模块名。

**id命名**，例
btn_send
tv_name
list_persons
et_password
然后用butterknife的插件生成变量会自动将下划线变成驼峰命名

**变量命名**:以m开头。例mAdapter使用时按一个m全都出来了
**方法命名**:与其写好名字不如写好注释。

TextView使用官方标准字体

```
`style=&quot;@style/TextAppearance.AppCompat.Display4&quot;
style=&quot;@style/TextAppearance.AppCompat.Display3&quot;
style=&quot;@style/TextAppearance.AppCompat.Display2&quot;
style=&quot;@style/TextAppearance.AppCompat.Display1&quot;
style=&quot;@style/TextAppearance.AppCompat.Headline&quot;
style=&quot;@style/TextAppearance.AppCompat.Title&quot;
style=&quot;@style/TextAppearance.AppCompat.Subhead&quot;
style=&quot;@style/TextAppearance.AppCompat.Body2&quot;
style=&quot;@style/TextAppearance.AppCompat.Body1&quot;
style=&quot;@style/TextAppearance.AppCompat.Caption&quot;
style=&quot;@style/TextAppearance.AppCompat.Button&quot;
`
``` Button使用Material Design标准样式

```
`style=&quot;@style/Widget.AppCompat.Button&quot;
style=&quot;@style/Widget.AppCompat.Button.Borderless&quot;
style=&quot;@style/Widget.AppCompat.Button.Borderless.Colored&quot;
style=&quot;@style/Widget.AppCompat.Button.Small&quot;
`
```定好网络请求写法。文件存储方式与位置。写好项目所使用的类库框架用法。

原文链接：[http://www.jianshu.com/p/d9e4ddd1c530](http://www.jianshu.com/p/d9e4ddd1c530)