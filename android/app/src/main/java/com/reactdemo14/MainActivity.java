package com.reactdemo14;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import androidx.annotation.Nullable;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ReactDemo14";
  }

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
}
