import AsyncStorage from '@react-native-community/async-storage';

const USER = '_sjcc_userdata';

class User {
  constructor(userinfo) {
    this.parseUserinfo(userinfo || {});
  }

  parseUserinfo = (userinfo) => {
    userinfo = Object.assign({}, userinfo);

    this.profile = userinfo.profile || {};
    this.userdata = userinfo.userdata || {};

    return this;
  }

  fromStorage = async () => {
    try {
      const userdata = await AsyncStorage.getItem(USER);
      return this.parseUserinfo(JSON.parse(userdata));
    } catch (e) {
      console.error('[User]', e);
    }
  }

  persist = async (userdata) => {
    const user = new User(userdata);
    try {
      await AsyncStorage.setItem(USER, JSON.stringify(this));
    } catch (e) {
      console.error('[User]', e);
    }
  }

  getProfile = () => {
    return this.profile;
  }
}

export default User;
