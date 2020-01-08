import { Text } from 'react-native';

class SJCC_LoginManager {
  constructor() {
    this.config = require('../../../sjcclogin.json');
  }
};

const manager = new SJCC_LoginManager();

const SJCC_Login = {
  login() {
    console.log(manager);
  }
}

export default SJCC_Login;
