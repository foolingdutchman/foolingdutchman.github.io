title: "Espresso在Android-Studio中进行单元测试"
date: 2016-08-09
categories:
  - 单元测试
---

在这篇文章中，我们将学习如何在Android Studio中配置工程用于测试，在开发机器上编写并运行单元测试，以及如何在手机上做功能UI测试。包括：

- 更新包含JUnit和Android Testing Support Library的Gradle构建文件

- 编写运行在本机Java虚拟机上的单元测试

- 编写运行在手机或者虚拟机上的Espresso测试

原文链接：[http://www.jianshu.com/p/03118c11c199](http://www.jianshu.com/p/03118c11c199)

**1.你需要什么**

- Android Studio v1.2+

- Android 4.0+的测试设备

**2.创建新的Android Studio工程**
如果是第一次启动Android Studio，从欢迎页选择“Start a new Android Studio project”。如果已经打开了一个工程，选择File&gt;New&gt;New Project…

“Create new project”向导会指导整个过程，在第一页输入如下内容：
|         Setting   |    Value  |
|    ——: |    :——-:    |
|Application Name |    TestingExample |
|Company demain|    testing.example.com|
这样会保证你的代码同codelab讲解的内容具有一致的命名。其他的选项都设置为默认，一路点击Next直到工程创建完毕。

点击Run按钮检查app是否运行正常，要么从模拟器列表中选择一个启动，要么确认开启了debug模式的设备通过USB同电脑正确连接。

app目前没有做任何事情，但是屏幕上应该显示“Hello world!”和app的名字。

**3.配置支持单元测试的工程**
在写测试之前，让我们做下简单的检查，确保工程配置正确。

打开工程的build.gradle（Module:app）文件，添加JUnit4依赖，点击Gradle sync按钮。

```
`build.gradle
 dependencies {
compile fileTree(dir: &apos;libs&apos;, include: [&apos;*.jar&apos;])
compile &apos;com.android.support:appcompat-v7:22.1.1&apos;
testCompile &apos;junit:junit:4.12&apos;
}
`
```当你同步Gradle配置时，可能需要联网下载JUnit依赖。

**4.创建第一个单元测试**
现在，万事俱备，让我们开始写第一个测试吧。首先，创建一个非常简单的被测类：Calculator类。然后，向类中添加一些基本的算术运算方法，比如加法和减法。将下列代码复制到编辑器中。不用担心实际的实现，暂时让所有的方法返回0。

```
`Calculator.java
package com.example.testing.testingexample;
public class Calculator {
public double sum(double a, double b){
    return 0;
}
public double substract(double a, double b){
    return 0;
}
public double divide(double a, double b){
    return 0;
}
public double multiply(double a, double b){
    return 0;
}
}
`
```Android Studio提供了一个快速创建测试类的方法。只需在编辑器内右键点击Calculator类的声明，选择**Go to &gt; Test**，然后**“Create a new test…”**

在打开的对话窗口中，选择**JUnit4**和**“setUp/@Before”**，同时为所有的计算器运算生成测试方法。

这样，就会在正确的文件夹内(app/src/test/java/com/example/testing/testingexample)生成测试类框架，在框架内填入测试方法即可。下面是一个示例：

```
`Calculator.java 
package com.example.testing.testingexample;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
public class CalculatorTest {
private Calculator mCalculator;
@Before
public void setUp() throws Exception {
    mCalculator = new Calculator();
}
@Test
public void testSum() throws Exception {
    //expected: 6, sum of 1 and 5
    assertEquals(6d, mCalculator.sum(1d, 5d), 0);
}
@Test
public void testSubstract() throws Exception {
    assertEquals(1d, mCalculator.substract(5d, 4d), 0);
}
@Test
public void testDivide() throws Exception {
    assertEquals(4d, mCalculator.divide(20d, 5d), 0);
}
@Test
public void testMultiply() throws Exception {
    assertEquals(10d, mCalculator.multiply(2d, 5d), 0);
}
}
`
```请将代码复制到编辑器或者使用JUnit框架提供的断言来编写自己的测试。

**5.运行单元测试**
终于到运行测试的时候了！右键点击**CalculatorTest**类，选择**Run &gt; CalculatorTest**。也可以通过命令行运行测试，在工程目录内输入：

```
`./gradlew test
`
```无论如何运行测试，都应该看到输出显示4个测试都失败了。这是预期的结果，因为我们还没有实现运算操作。

让我们修改Calculator类中的sum(double a, double b)方法返回一个正确的结果，重新运行测试。你应该看到4个测试中的3个失败了。

**Calculator.java**

```
`public double sum(double a, double b){
return a + b;
}
`
```作为练习，你可以实现剩余的方法使所有的测试通过。

可能你已经注意到了*Android Studio* 从来没有让你连接设备或者启动模拟器来运行测试。那是因为，位于src/tests目录下的测试是运行在本地电脑Java虚拟机上的单元测试。编写测试，实现功能使测试通过，然后再添加更多的测试…这种工作方式使快速迭代成为可能，我们称之为测试驱动开发。
值得注意的是，当在本地运行测试时，*Gradle*为你在环境变量中提供了包含Android框架的android.jar包。但是它们功能不完整（所以，打个比方，你不能单纯调用Activity的方法并指望它们生效）。推荐使用Mockito等mocking框架来mock你需要使用的任何Android方法。对于运行在设备上，并充分利用Android框架的测试，请继续阅读本篇教程的下个部分。
6.配置支持*Instrumentation*测试的工程
虽然在Android框架内支持运行instrumentation测试，但是目前开发重心主要集中在刚刚发布的作为Android Testing Support Library一部分的新的AndroidJUnitRunner。测试库包含Espresso，用于运行功能UI测试的框架。让我们通过编辑build.gradle的相关部分来把它们添加进我们的工程。

```
`build.gradle
apply plugin: &apos;com.android.application&apos;
android {
compileSdkVersion 22
buildToolsVersion &quot;22.0.1&quot;
defaultConfig {
    applicationId &quot;com.example.testing.testingexample&quot;
    minSdkVersion 15
    targetSdkVersion 22
    versionCode 1
    versionName &quot;1.0&quot;
    //ADD THIS LINE:
    testInstrumentationRunner &quot;android.support.test.runner.AndroidJUnitRunner&quot;
}
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile(&apos;proguard-android.txt&apos;), &apos;proguard-rules.pro&apos;
    }
}
//ADD THESE LINES:
packagingOptions {
    exclude &apos;LICENSE.txt&apos;
}
}
dependencies {
compile fileTree(dir: &apos;libs&apos;, include: [&apos;*.jar&apos;])
compile &apos;com.android.support:appcompat-v7:22.0.0&apos; //← MAKE SURE IT’S 22.0.0
testCompile &apos;junit:junit:4.12&apos;
//ADD THESE LINES:
androidTestCompile &apos;com.android.support.test:runner:0.2&apos;
androidTestCompile &apos;com.android.support.test:rules:0.2&apos;
androidTestCompile &apos;com.android.support.test.espresso:espresso-core:2.1&apos;
}
`
```重要：由于一些依赖版本冲突，你需要确认com.android.support:appcompat-v7库的版本号是22.0.0，像上面的代码片段一样。
另外，Android Studio可能会提醒你Build Tools 22.0.1没有安装。你应该接受修复建议，Studio会为你安装Build Tools或者在build.gradle中把这行修改成已经安装在你电脑的版本。
上面的工作完成后，在Build Variants窗口内切换成Android Instrumentation Tests，你的工程应该自动同步。如果没有，点击Gradle sync按钮。

**7.为app添加简单的交互**

在使用Espresso进行UI测试前，让我们为app添加一些Views和简单的交互。我们使用一个用户可以输入名字的EditText，欢迎用户的Button和用于输出的TextView。打开res/layout/activity_main.xml，粘贴如下代码：

```
`activity_main.xml
&lt;RelativeLayout xmlns:android=&quot;http://schemas.android.com/apk/res/android&quot;
xmlns:tools=&quot;http://schemas.android.com/tools&quot; android:layout_width=&quot;match_parent&quot;
android:layout_height=&quot;match_parent&quot; android:paddingLeft=&quot;@dimen/activity_horizontal_margin&quot;
android:paddingRight=&quot;@dimen/activity_horizontal_margin&quot;
android:paddingTop=&quot;@dimen/activity_vertical_margin&quot;
android:paddingBottom=&quot;@dimen/activity_vertical_margin&quot; tools:context=&quot;.MainActivity&quot;&gt;
&lt;TextView
    android:id=&quot;@+id/textView&quot;
    android:text=&quot;@string/hello_world&quot; android:layout_width=&quot;wrap_content&quot;
    android:layout_height=&quot;wrap_content&quot; /&gt;
&lt;EditText
    android:hint=&quot;Enter your name here&quot;
    android:id=&quot;@+id/editText&quot;
    android:layout_width=&quot;match_parent&quot;
    android:layout_height=&quot;wrap_content&quot;
    android:layout_below=&quot;@+id/textView&quot;/&gt;
&lt;Button
    android:layout_width=&quot;match_parent&quot;
    android:layout_height=&quot;wrap_content&quot;
    android:text=&quot;Say hello!&quot;
    android:layout_below=&quot;@+id/editText&quot;
    android:onClick=&quot;sayHello&quot;/&gt;
`
```
还需要在MainActivity.java中添加onClick handler：

```
`MainActivity.java
public void sayHello(View v){
TextView textView = (TextView) findViewById(R.id.textView);
EditText editText = (EditText) findViewById(R.id.editText);
textView.setText(&quot;Hello, &quot; + editText.getText().toString() + &quot;!&quot;);
}
`
```现在可以运行app并确认一切工作正常。在点击Run按钮之前，确认你的Run Configuration没有设置为运行测试。如需更改，点击下拉选项，选择app。

8.创建并运行Espresso测试

在工程的整体视图上，找到以（androidTest）后缀结尾的包名并创建一个新的Java类。可以将它命名为MainActivityInstrumentationTest，将如下代码粘贴过去。

```
`** MainActivityInstrumentationTest.java
package com.example.testing.testingexample;
import android.support.test.InstrumentationRegistry;
import android.support.test.espresso.action.ViewActions;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.test.ActivityInstrumentationTestCase2;
import android.test.suitebuilder.annotation.LargeTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.action.ViewActions.closeSoftKeyboard;
import static android.support.test.espresso.action.ViewActions.typeText;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.withId;
import static android.support.test.espresso.matcher.ViewMatchers.withText;
@RunWith(AndroidJUnit4.class)
@LargeTest
public class MainActivityInstrumentationTest {
private static final String STRING_TO_BE_TYPED = &quot;Peter&quot;;
@Rule
public ActivityTestRule&lt;MainActivity&gt; mActivityRule = new ActivityTestRule&lt;&gt;(
    MainActivity.class);
@Test
public void sayHello(){
    onView(withId(R.id.editText)).perform(typeText(STRING_TO_BE_TYPED), closeSoftKeyboard()); //line 1
    onView(withText(&quot;Say hello!&quot;)).perform(click()); //line 2
    String expectedText = &quot;Hello, &quot; + STRING_TO_BE_TYPED + &quot;!&quot;;
    onView(withId(R.id.textView)).check(matches(withText(expectedText))); //line 3
}
}
`
```测试类通过AndroidJUnitRunner运行，并执行sayHello()方法。下面将逐行解释都做了什么：

- 1.首先，找到ID为editText的view，输入Peter，然后关闭键盘；

- 2.接下来，点击Say hello!的View，我们没有在布局的XML中为这个Button设置id，因此，通过搜索它上面的文字来找到它；

- 3.最后，将TextView上的文本同预期结果对比，如果一致则测试通过；
你也可以右键点击域名运行测试，选择Run&gt;MainActivityInstrume…（第二个带Android图标的）

这样就会在模拟器或者连接的设备上运行测试，你可以在手机屏幕上看到被执行的动作（比如在EditText上打字）。最后会在Android Studio输出通过和失败的测试结果。

测试源码请看[TestingExample](https://github.com/foolingdutchman/TestingExample)