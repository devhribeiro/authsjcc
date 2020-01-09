import React, { Component } from 'react';

import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

import SJCC_Login from '../../models/SJCC_Login';

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
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  loading() {
    return (
      <View style={ loadingContainerStyle }>
        <ActivityIndicator size="large" color="#f61f1f"/>
      </View>
    )
  }

  render() {
    const props = {...this.props};

    /**
     * Check for "onLoggedIn" and "onError"
     *
     * It can be from SJCC_LoginScreen props if you use as component
     * or from navigation if you are using SJCC_LoginButton.
     *
     * onLoggedIn by default goBack()
     * onError by default console.error()
     */
    if (typeof props.onLoggedIn !== 'function') {
      const successFromButton = props.navigation.getParam('onLoggedIn');
      props.onLoggedIn = (typeof successFromButton === 'function') ? successFromButton : props.navigation.goBack;
    }

    if (typeof props.onError !== 'function') {
      const errorFromButton = props.navigation.getParam('onError');
      props.onError = (typeof errorFromButton === 'function') ? errorFromButton : console.error;
    }

    return (
      <WebView
        source={{ uri: SJCC_Login.getLoginUrl() }}
        style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
        startInLoadingState={true}
        renderLoading={() => (this.state.loading) ? this.loading() : null}
        onLoadEnd={() => { this.setState({ loading: false }); }}
        onMessage={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;

          SJCC_Login.processMessage(nativeEvent.data).then((success) => {
            success ? props.onLoggedIn() : props.onError(nativeEvent.data);
          });
        }}
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;

          Alert.alert('Ops...', 'Houve um problema ao carregar o login, por favor, tente novamente.');

          // Log on yellow box as we will treat the error
          console.warn(nativeEvent);

          if (nativeEvent.canGoBack) {
            this.goBack();
            return;
          }

          props.navigation.goBack();
        }}
      />
    );
  }
}

export default SJCC_LoginScreen;
