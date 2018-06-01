import AV from 'leancloud-storage';
import md5 from 'blueimp-md5';
const LCStorge = {
  install: function (Vue, options) {
    Vue.mixin({
      data: function () {
        return {
          lcs: {
            Init: function () {
              AV.init({
                appId: 'Bc3luL7In6UFyXHh5Vybnavi-gzGzoHsz',
                appKey: 'ff359xQsjpOvWjxit9PsffnR'
              });
            },
            Login: function (name, passwd) {
              return new Promise(function (resolve, reject) {
                AV.User.logIn(name, passwd).then(function (loggedInUser) {
                  console.log('login success:' + loggedInUser);
                  resolve();
                }, function (error) {
                  console.warn('login error:' + error);
                  reject();
                });
              });
            },
            Logout: function () {
              AV.User.logOut();
            },
            Signin: function (name, passwd) {
              return new Promise(function (resolve, reject) {
                // 新建 AVUser 对象实例
                let user = new AV.User();
                // 设置用户名
                user.setUsername(name);
                // 设置密码
                user.setPassword(passwd);
                // 设置邮箱
                user.setEmail(name);//默认用户名为邮箱
                user.signUp().then(function (loggedInUser) {
                  console.log('signin success:' + loggedInUser);
                  resolve();
                }, function (error) {
                  console.warn('signin error:' + error);
                  reject();
                });
              })
            },
            isLogin: function () {
              let currentUser = AV.User.current();
              if (currentUser) {
                return true;
              }
              return false;
            },
            saveToCloud: function (data) {
              return new Promise(function (resolve, reject) {
                if (AV.User.current()) {
                  let user = AV.User.current();
                  let query = new AV.Query('roadmap');
                  query.equalTo('belong', user);
                  query.first().then(function (result) {
                    if (result) {//原本存有数据，更新
                      console.log('has:' + result);
                      let myMap = AV.Object.createWithoutData('roadmap', result.id);
                      myMap.set('data', data);
                      myMap.save().then(function (obj) {
                        resolve(obj);
                      }, function (err) {
                        console.warn('save err:' + err);
                        reject(err);
                      });
                    } else {//原本无数据，插入
                      let RoadMap = AV.Object.extend('roadmap');
                      let myMap = new RoadMap();
                      let hash = md5(user.getEmail());
                      myMap.set('belong', user);
                      myMap.set('data', data);
                      myMap.set('hash', hash);
                      myMap.save().then(function (obj) {
                        resolve(obj);
                      }, function (err) {
                        console.warn('save err:' + err);
                        reject(err);
                      });
                    }
                  }, function (error) {
                    console.log(error);
                  });
                }
                else {
                  reject();
                }
              });
            },
            getDataByEmail: function (email) {
              if (!email) {//未从url获取到邮箱
                let user = AV.User.current();
                email = md5(user.getEmail());
              }
              console.log(email);
              return new Promise((resolve, reject) => {
                let query = new AV.Query('roadmap');
                query.equalTo('hash', email);
                query.first().then(result => {
                  if (result) {
                    resolve(result.get('data'));
                  }
                  else {
                    reject('云端不存在的Email');
                  }
                }, err => {
                  console.warn('getByEmail error' + err);
                  reject(err);
                })
              });
            },
            getEmail: function () {
              let user = AV.User.current();
              if (user) {
                return md5(user.getEmail());
              }
              return null;
            }
          }
        }
      },
      methods: {
        test: function () {
          console.log('mixin');
        }
      }
    });
  }
}

export default LCStorge;
