import AsyncStorage from '@react-native-community/async-storage';

const ACCESS_TOKEN = '_sjcc_access_token';
const REFRESH_TOKEN = '_sjcc_refresh_token';

export default Tokens = {
  getAccessToken: async (tokens) => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (token) {
        return token;
      }
    } catch (e) {
      console.error('[Tokens]', e);
    }

    return '';
  },

  getRefreshToken: async (tokens) => {
    try {
      const token = await AsyncStorage.getItem(REFRESH_TOKEN);
      if (token) {
        return token;
      }
    } catch (e) {
      console.error('[Tokens]', e);
    }

    return '';
  },

  saveTokens: async (tokens) => {
    try {
      if (tokens.access_token) {
        await AsyncStorage.setItem(ACCESS_TOKEN, tokens.access_token);
      }

      if (tokens.refresh_token) {
        await AsyncStorage.setItem(REFRESH_TOKEN, tokens.refresh_token);
      }
    } catch (e) {
      console.error('[Tokens]', e);
    }
  }
};
