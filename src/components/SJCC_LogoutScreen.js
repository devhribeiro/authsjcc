import React, { Component } from 'react';

import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

import SJCC_Login from '../models/SJCC_Login';

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

class SJCC_LogoutScreen extends Component {
  webview = {}
  removeLoading = true;

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async onLogoutSuccess() {}
  async onLogoutError(response) {}

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

      SJCC_Login.processLogoutPostMessage(data).then((success) => {
        success ? this.onLogoutSuccess() : this.onLogoutError(data);
      });
    }

    return (
      <WebView
        source={{ uri: SJCC_Login.getLogoutUrl() }}
        style={[{ margin: 0, padding: 0, width: '100%', height: '100%' }, this.webview.style || this.props.style || {}]}

        {...this.webview}
      />
    );
  }
}

export default SJCC_LogoutScreen;
