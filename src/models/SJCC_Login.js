import { Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Tokens from './tokens';

const user = {};

class SJCC_LoginManager {
  constructor() {
    this.config = require('../../../sjcclogin.json');
  }

  isLoggedIn(refresh) {
    if (! refresh) {
      return Boolean(user);
    }

    Tokens.getAccessToken().then((accessToken) => {
      if (! accessToken) {
        return false;
      }
    });
  }
};

const manager = new SJCC_LoginManager();

const SJCC_Login = {
  login() {

  }
}

export default SJCC_Login;
