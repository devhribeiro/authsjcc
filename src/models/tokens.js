import AsyncStorage from '@react-native-community/async-storage';

const ACCESS_TOKEN = '_sjcc_access_token';
const REFRESH_TOKEN = '_sjcc_refresh_token';

const tryStorage = async (callback) => {
  try {
    callback();
  } catch (e) {
    console.error('[Tokens]', e);
  }
};

export default Tokens = {
  getAccessToken: async (tokens) => {
    tryStorage(async () => {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      return token ? token : '';
    });

    return '';
  },

  getRefreshToken: async (tokens) => {
    tryStorage(async () => {
      const token = await AsyncStorage.getItem(REFRESH_TOKEN);
      return token ? token : '';
    });

    return '';
  },

  forgetTokens: async () => {
    tryStorage(async () => {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(REFRESH_TOKEN);
    });
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
