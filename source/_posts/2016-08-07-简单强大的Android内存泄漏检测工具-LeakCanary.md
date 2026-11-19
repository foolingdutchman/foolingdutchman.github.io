---
title: ""
date: 2016-08-07
categories:
  - 内存管理
---

几乎每个程序员在开发的过程中都会遇到内存泄漏，那么我们如何检测到app是否哪里出现内存泄漏呢？square公司推出了一款简单粗暴的检测内存泄漏的工具－－ LeakCanary

**什么是内存泄漏？**
 内存泄漏是指由于疏忽或者错误造成程序未能释放已经不再使用的内存，内存泄漏不是指内存在物理上的消失，而是应用程序分配某段内存后，由于设计错误失去了对于这段内存的控制，因而造成内存的浪费。

内存泄漏和内存溢出是两码事，不要混淆，内存溢出通俗的讲就是内存不够用,现在的只能手机内存越来越大,内存溢出的情况不是很多,但是内存泄露情况比较严重,LeakCanary的到来对我们来说是一个简单粗暴,直观的好工具

上面这个图片就是这个工具的图标了,当你的程序处于debug模式的时候,就能看到他了,当然release没有

LeakCanary作为一个简单粗暴的工具,用法也相当简单

在build.gradle中引入LeakCanary

```
`debugCompile &apos;com.squareup.leakcanary:leakcanary-android:1.3&apos;  
    releaseCompile &apos;com.squareup.leakcanary:leakcanary-android-no-op:1.3&apos;  
`
```一个是debug包,一个是release包的,从引入包的结构也能看出端倪
由于LeakCanary是测试整个app的内存泄露情况,所以你需要在你的application中启动它

```
`package com.zimo.guo;  
import android.app.Application;  
import com.squareup.leakcanary.LeakCanary;  
/** 
 * Created by zimo on 15/8/7. 
 */  
public class MyApplication extends Application {  
    @Override  
    public void onCreate() {  
        super.onCreate();  
        LeakCanary.install(this);  
    }  
}  
`
```ok,现在就可以测试程序中的内存泄露情况,直观明了

这么有逼格的工具,赶紧来试试吧,要想使你的app的内存泄露灰飞烟灭,try it