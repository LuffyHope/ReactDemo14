# ReactDemo14
## 一如何获取android原生的数据。
>一般有一下三种方式
>+ 1.通过代理ReactActivityDelegate的getLaunchOptions返回给RN
>+ 2.通过 bridge 回调向 RN 传值（这里包括两种1.Promise回调2.Callback回调）
>+ 3.通过ReactRootView传递（这个用得少暂不介绍）

##### 通过代理ReactActivityDelegate 
android端代码：
```
    @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    //这个地方一定要应用修改自己重写过的类。
    return new CustomReactActivityDelegate(this,getMainComponentName());
  }

  protected class CustomReactActivityDelegate extends ReactActivityDelegate{

    public CustomReactActivityDelegate(ReactActivity activity, @Nullable String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Nullable
    @Override
    protected Bundle getLaunchOptions() {
      String key = "test";
      Bundle bundle = new Bundle();
      bundle.putString(key,"key 对应的 value");
      return bundle;
    }
  }
```
js端代码：
```
    //测试ReactActivityDelegate的getLaunchOptions 中 Native 向 RN传值。
    //this.props.test 中的test是bundle中的key test。
    console.log('-----测试------props.test', this.props.test);
```
##### 通过 bridge 回调向 RN 传值1.Promise
android端代码：
```
    @ReactMethod
    public void getPromiseData(int tag, Promise promise) {
        try {
            WritableMap map = Arguments.createMap();
            map.putString("test", "测试Promise 回调数据 key 对应的 Values");
            promise.resolve(map);//成功的回调
        } catch (IllegalViewOperationException e) {
            promise.reject(e.getMessage());//失败的回调
        }
    }
```
js端代码：
```
import {NativeModules,} from 'react-native';
var BridgeAndroid = NativeModules.BaseJSBridgeAndroid;


  testPromiseData = () => {
    BridgeAndroid.getPromiseData(1)
      .then(map => {
        console.log('-------------测试Promis数据----------', map);
      })
      .catch(() => {
        console.log('出错');
      });
  };
```
##### 通过 bridge 回调向 RN 传值2.Callback回调
android端代码：
```
    @ReactMethod
    public void getCallBackData(int tag, Callback success, Callback error) {
        try {
            success.invoke("测试的数据结果");
        } catch (IllegalViewOperationException e) {
            error.invoke(e.getMessage());
        }
    }
```
js端代码：
```
import {NativeModules,} from 'react-native';
var BridgeAndroid = NativeModules.BaseJSBridgeAndroid;

  testCallData = () => {
    BridgeAndroid.getCallBackData(
      1,
      msg => {
        console.log('--------------callBack的测试数据--------', msg);
      },
      e => {
        console.log(e);
      },
    );
  };
```

## 注册监听的方式专递数据
```
//1引入
import { DeviceEventEmitter, } from 'react-native';

//2注册监听
this.event = DeviceEventEmitter.addListener('eventType', params => {
      //监听到发送的通知
      console.log('----------------------params', params);
 });
//3发送事件
//这里的eventType要与监听的地方保持一致。相当于Android的活动
DeviceEventEmitter.emit('eventType', {key: 'value'});

//4移除监听：
componentWillUnMount() {
      // 移除所有监听
     DeviceEventEmitter.removeAllListeners();
      // 移除单个监听
     this.event.remove();
 }
```
## 全局变量 global
```
//系统自带global无需要引入，可以直接使用
//存
global.username = 'your name';
//取
let name = global.username;
```
## 持久化存储AsynStorage/ react-native-storage
```
//初始化
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
var storage = new Storage({
  size: 3000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

const saveData = (keyString, data) => {
  return new Promise((resolve, reject) => {
    console.log('保存数据saveData', data);
    storage
      .save({
        key: keyString, //切记key不能有下划线
        data: data,
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getData = (keyString, defaultData) => {
  console.log('获取缓存数据getData：keyString', keyString);
  if (!keyString) {
    console.log('keyString异常');
    return;
  }
  return new Promise((resolve, reject) => {
    storage
      .load({
        key: keyString, //切记key不能有下划线
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log('获取缓存数据异常err', err);
        reject(err);
      });
  });
};

export default {
  saveData,
  getData,
};

//存
  storageSave = () => {
    CatchUtils.saveData("TestStorage",{testStorage:'测试永久存储'})
  };


//取
  storageGet = () => {
    CatchUtils.getData("TestStorage").then((res)=>{
      console.log('------测试永久存储----------res', res)
    }).catch((e)=>{
      console.log('------测试永久存储------e', e);
    });
  };
```
[项目地址](https://github.com/LuffyHope/ReactDemo14)

参考👇
[https://www.jianshu.com/p/cf302f508f66](https://www.jianshu.com/p/cf302f508f66)

[https://nicetu.github.io/2018/06/03/react-native](https://nicetu.github.io/2018/06/03/react-native-%E5%B8%B8%E7%94%A8%E7%9A%84%E9%80%9A%E4%BF%A1%E6%96%B9%E5%BC%8F/)


