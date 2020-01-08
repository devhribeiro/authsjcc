import React, { Component } from 'react';

import { Button } from 'react-native-elements';

const containerStyle = {
  paddingHorizontal: '15%',
};

const buttonStyle = {
  width: '100%',
  paddingTop: 5,
  paddingBottom: 10
};

const titleStyle = {
  fontSize: 16
};

class SJCC_LoginButton extends Component {
  render() {
    const props = {...this.props};

    props.title = props.title || 'Login';
    props.buttonStyle = [ buttonStyle, this.props.buttonStyle || {} ];
    props.titleStyle = [ titleStyle, this.props.titleStyle || {} ];
    props.containerStyle = [ containerStyle, this.props.containerStyle || {} ];

    props.onPress = () => {

    };

    return (
      <Button {...props} />
    );
  }
};

export default SJCC_LoginButton;
