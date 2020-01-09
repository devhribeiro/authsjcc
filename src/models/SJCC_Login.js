import React, { Component } from 'react';

import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Tokens from './tokens';
import User from './user';

class SJCC_LoginManager {
  constructor() {
    this.config = require('../../../sjcclogin.json');

    // Check Api Token
    if (! this.config.apiToken) {
      console.error('"apiToken" is missing from sjcclogin.json');
    }

    // Make sure type is a integer
    this.config.type = parseInt(this.config.type || '1');

    // User
    this.user = new User();

    // TODO: make configuration environment
    this.baseUrl = 'https://signin-wall-staging.accounts.ne10.com.br//api/v2/auth';
  }

  buildUrl = (path) => {
    const url = new URL(path, this.baseUrl);
    url.searchParams.append('api_token', this.config.apiToken);
    url.searchParams.append('type', this.config.type);

    return url.href;
  }

  getUser = async () => {
    return await this.user.fromStorage();
  }

  setUser = async (userinfo) => {
    await this.user.parseUserinfo(userinfo).persist();
  }

  isLoggedIn = async (refresh) => {
    if (! refresh) {
      const user = this.user.getProfile();
      return Boolean(user);
    }

    Tokens.getAccessToken().then((accessToken) => {
      if (! accessToken) {
        return false;
      }

      // TODO: get userinfo from API
      return true;
    });
  }
};

const manager = new SJCC_LoginManager();

const SJCC_Login = {
  getLoginUrl: () => manager.buildUrl('/'),

  getUser: async () => {
    return manager.getUser();
  },

  processMessage: async (message) => {
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }

    if (! message.access_token) {
      return false;
    }

    await Tokens.saveTokens(message);
    await manager.setUser(message);

    return true;
  }
}

export default SJCC_Login;
