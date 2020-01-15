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
    this.baseUrl = 'https://signin-wall-staging.accounts.ne10.com.br/api/v2/auth';
  }

  buildUrl = (path, parameters) => {
    const url = new URL(path, this.baseUrl);
    url.searchParams.append('api_token', this.config.apiToken);
    url.searchParams.append('type', this.config.type);

    if (parameters) {
      for (let parameter in parameters) {
        if (! parameter || ! parameters[parameter]) continue;
        url.searchParams.append(parameter, parameters[parameter]);
      }
    }

    return url.href;
  }

  getUser = async () => {
    const user = await this.user.fromStorage();

    if (user.getProfile()) {}
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
  getAccountUrl: () => manager.buildUrl('/account'),
  getLogoutUrl: () => manager.buildUrl('/logout'),
  getRegisterUrl: () => manager.buildUrl('/register'),

  getLoginUrl: (redirectUrl) => {
    const parameters = redirectUrl ? {'redirect_url': redirectUrl} : null;
    return manager.buildUrl('/', parameters);
  },

  getUser: async () => {
    return manager.getUser();
  },

  processCodeToToken: async (code) => {
    if (! code) return false;

    const url = manager.baseUrl + '/token';
    const params = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + manager.config.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'code': code
      })
    };

    return fetch(url, params)
      .then((response) => response.json())
      .then((responseJson) => {
        if (! responseJson.access_token) {
          console.warn('[Auth API]', responseJson);
          return false;
        }

        return Tokens.saveTokens(responseJson).then(() => {
          return true;
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },

  processLoginPostMessage: async (message) => {
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }

    if (! message.access_token) {
      return false;
    }

    await Tokens.saveTokens(message);
    await manager.setUser(message);

    return true;
  },

  processLogoutPostMessage: async (message) => {
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }

    if (message.action !== 'logout') {
      return false;
    }

    await Tokens.forgetTokens();
    await manager.setUser(null);

    return true;
  },
}

export default SJCC_Login;
