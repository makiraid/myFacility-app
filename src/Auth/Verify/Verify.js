import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Color from '../../Public/Color';
import { toast } from '../../Public/components';
import { HOST_NAME } from 'react-native-dotenv';
import Axios from 'axios';

class Verify extends Component {
  state = {
    code: '',
    isLoading: false
  };

  handleLogin = () => {
    const { code } = this.state;
    if (!code) {
      toast('Verification Code cannot be empty');
    } else {
      this.onRequestCode();
    }
  };

  onRequestCode = () => {
    this.setState({ isLoading: true });
    const data = this.props.navigation.getParam('data');
    const { code } = this.state;
    const body = {
      email: data.email,
      token: code
    };
    Axios.post(`${HOST_NAME}api/v1/email-verification`, body)
      .then(res => {
        const resp = res.data;
        if (resp.resultCode === 0) {
          this.onRequestLogin();
        } else {
          toast(resp.resultDesc);
          this.setState({ isLoading: false });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        toast(JSON.stringify(err.message));
      });
  };

  onRequestLogin = (e, p) => {
    const data = this.props.navigation.getParam('data');
    const body = {
      code: data.email,
      password: data.password
    };

    Axios.post(`${HOST_NAME}api/v1/sign-in`, body)
      .then(res => {
        const resp = res.data;
        if (resp.resultCode === 0) {
          this.props.setDataLogin(res);
          this.props.navigation.navigate('App');
        } else {
          toast(resp.resultDesc);
        }
      })
      .catch(err => {
        toast(JSON.stringify(err.message));
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <ImageBackground
        source={require('../../Public/Assets/images/bg.png')}
        style={styles.container}>
        <View style={styles.wrapperHeader}>
          <FontAwesome5
            name="map-marker-alt"
            color={Color.quarternary}
            size={48}
          />
          <Text style={styles.textTitle}>My Facility App</Text>
          <Text style={styles.textSubtitle}>
            We've sent a Confirmation code to your Email {'\n'}
            Please input code into empty forms below
          </Text>
        </View>

        <View style={styles.containerInput}>
          <View style={styles.wrapperInput}>
            <View style={styles.input}>
              <TextInput
                placeholder="XXXXXX"
                textAlign="center"
                editable={!this.state.isLoading}
                keyboardType="numeric"
                style={styles.textinput}
                onChangeText={text => this.setState({ code: text })}
              />
            </View>
          </View>
        </View>

        <TouchableNativeFeedback
          disabled={this.state.isLoading}
          onPress={this.handleLogin}>
          <View style={styles.button}>
            {this.state.isLoading ? (
              <ActivityIndicator
                color={Color.Background}
                size="small"
                style={{ margin: 16 }}
              />
            ) : (
              <Text style={styles.textButton}>Confirm</Text>
            )}
          </View>
        </TouchableNativeFeedback>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setDataLogin: payload =>
    dispatch({
      type: 'POST_LOGIN_FULFILLED',
      payload
    })
});

export default connect(
  null,
  mapDispatchToProps
)(Verify);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerInput: {
    marginTop: 16
  },
  wrapperHeader: {
    alignItems: 'center'
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center'
  },
  wrapperInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginVertical: 8
  },
  wrapperIcon: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8
  },
  input: {
    flex: 1
  },
  wrapperForgotPassword: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textForgotPassword: {
    color: '#000',
    alignSelf: 'flex-end',
    marginVertical: 16,
    marginHorizontal: 0
  },
  button: {
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    width: '100%',
    borderRadius: 6,
    marginTop: 32
  },
  textButton: {
    fontWeight: 'bold',
    color: 'white',
    margin: 16,
    fontSize: 14
  },
  textinput: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 5
  },
  textSubtitle: {
    textAlign: 'center',
    marginTop: 70
  }
});
