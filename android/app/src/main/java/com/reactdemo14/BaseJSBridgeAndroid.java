package com.reactdemo14;

import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import javax.annotation.Nonnull;

public class BaseJSBridgeAndroid extends ReactContextBaseJavaModule {
    public BaseJSBridgeAndroid(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        //1.作用：用于Js端调用Android端的桥梁（你可以理解为一个全局变量）
        //2.命名：避免使用时混淆，最好是以类名同名。
        //3.使用：在js端通过 NativeModules.BaseJSBridgeAndroid.xxxandroid方法xx();
        return "BaseJSBridgeAndroid";
    }

    @ReactMethod
    public void testAndroidToast(String msg) {
        Toast.makeText(getReactApplicationContext(), msg, Toast.LENGTH_SHORT).show();
    }

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

    @ReactMethod
    public void getCallBackData(int tag, Callback success, Callback error) {
        try {
            success.invoke("测试的数据结果");
        } catch (IllegalViewOperationException e) {
            error.invoke(e.getMessage());
        }
    }
}
