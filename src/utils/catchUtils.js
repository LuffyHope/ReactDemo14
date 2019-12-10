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
