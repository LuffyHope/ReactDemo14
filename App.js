/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import CatchUtils from './src/utils/catchUtils';
var BridgeAndroid = NativeModules.BaseJSBridgeAndroid;

class App extends Component {
  getAndroidDat = () => {
    //测试ReactActivityDelegate的getLaunchOptions 中 Native 向 RN传值。
    //this.props.test 中的test是bundle中的key test。
    console.log('-----测试------props.test', this.props.test);
    this.testPromiseData();
    this.testCallData();
  };

  constructor(props) {
    super(props);
    // 2.注册监听
    this.event = DeviceEventEmitter.addListener('eventType', params => {
      //监听到发送的通知
      console.log('----------------------params', params);
    });
  }

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

  testPromiseData = () => {
    BridgeAndroid.getPromiseData(1)
      .then(map => {
        console.log('-------------测试Promis数据----------', map);
      })
      .catch(() => {
        console.log('出错');
      });
  };

  testDeviceEventEmitter = () => {
    // 3.发出通知
    //这里的eventType要与监听的地方保持一致。相当于Android的活动
    DeviceEventEmitter.emit('eventType', {key: 'value'});
  };

  // 4.移除监听
  componentWillUnMount() {
    // 移除所有监听
    DeviceEventEmitter.removeAllListeners();
    // 移除单个监听
    this.event.remove();
  }

  storageSave = () => {
    CatchUtils.saveData("TestStorage",{testStorage:'测试永久存储'})
  };

  storageGet = () => {
    CatchUtils.getData("TestStorage").then((res)=>{
      console.log('------测试永久存储----------res', res)
    }).catch((e)=>{
      console.log('------测试永久存储------e', e);
    });
  };

  render() {
    return (
      <View style={styles.containt}>
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => {
            this.getAndroidDat();
          }}>
          <Text>获取android原生端数据。</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => {
            this.testDeviceEventEmitter();
          }}>
          <Text>测试DeviceEventEmitter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => {
            this.storageSave();
          }}>
          <Text>测试永久存储的Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => {
            this.storageGet();
          }}>
          <Text>测试永久存储的Get</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyles: {
    width: 200,
    height: 50,
    backgroundColor: '#ff0',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
