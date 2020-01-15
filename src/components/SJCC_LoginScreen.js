import React, { Component } from 'react';

import { ActivityIndicator, Alert, BackHandler, Linking, View } from 'react-native';
import { WebView, } from 'react-native-webview';

import SJCC_Login from '../models/SJCC_Login';

const development = ! process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const loadingContainerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#FFFFFF',
  zIndex: 9,
  flex: 1,
  justifyContent: 'center',
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: 10
};

class SJCC_LoginScreen extends Component {
  webview = {}
  removeLoading = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      canGoBack: false
    };
  }

  componentDidMount() {
    if (development) {
      this.getWebView().clearCache(true);
    }

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.canGoBack) {
        this.getWebView().goBack();
        return true;
      }

      return false;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getWebView() {
    return this.refs['MAIN_WEBVIEW'];
  }

  async onLoginSuccess() {}
  async onLoginError(response) {}

  render() {
    this.props.style || {}

    // Loading view is the default behaviour
    if (! this.removeLoading) {
      this.webview.startInLoadingState = true;
      this.webview.renderLoading = () => {
        if (! this.state.loading) {
          return null;
        }

        return (
          <View style={ loadingContainerStyle }>
            <ActivityIndicator size="large" color="#f61f1f"/>
          </View>
        )
      };
    }

    // On Message cannot be override
    this.webview.onMessage = (syntheticEvent) => {
      const { nativeEvent } = syntheticEvent;

      const data = JSON.parse(nativeEvent.data);

      if (data && data.ready) {
        this.setState({ loading: false });
        return;
      }

      // TODO: Open Providers
      // if (data.action && data.link) {
      //   Linking.openURL(data.link);
      //   return;
      // }

      if (! data.access_token) {
        return;
      }

      SJCC_Login.processLoginPostMessage(data).then((success) => {
        success ? this.onLoginSuccess() : this.onLoginError(data);
      });
    }

    this.webview.onNavigationStateChange = (navState) => {
      this.setState({ canGoBack: navState.canGoBack });
    };

    return (
      <WebView
        ref={'MAIN_WEBVIEW'}
        source={{ uri: SJCC_Login.getLoginUrl() }}
        style={[{ margin: 0, padding: 0, width: '100%', height: '100%' }, this.webview.style || this.props.style || {}]}

        {...this.webview}
      />
    );
  }
}

export default SJCC_LoginScreen;
