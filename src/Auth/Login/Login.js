import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Color from '../../Public/Color';
import { toast } from '../../Public/components';
// import { HOST_NAME } from 'react-native-dotenv';
// const HOST_NAME = 'https://apidev.riskymakira.com/';
import Axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    isLoading: false
  };

  componentDidMount() {
    this.requestPermissionLocation();
  }

  requestPermissionLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        toast('Akses gps telah diberikan');
      } else {
        toast('Akses gps tidak diberikan');
      }
    } catch {
      toast('Gagal melakukan permintaan izin lokasi');
    }
  };

  handleLogin = () => {
    const { email, password } = this.state;
    if (!email || !password) {
      toast('Email and Password cannot be empty');
    } else {
      this.onRequestLogin(email, password);
    }
  };

  onRequestLogin = (e, p) => {
    const URL = 'https://apidev.riskymakira.com/';
    this.setState({ isLoading: true });
    const body = {
      email: e,
      password: p
    };

    Axios.post(`${URL}api/v1/sign-in`, body)
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
        </View>

        <View style={styles.containerInput}>
          <View style={styles.wrapperInput}>
            <View style={styles.wrapperIcon}>
              <FontAwesome5 name="envelope" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput
                editable={!this.state.isLoading}
                autoCompleteType="email"
                keyboardType="email-address"
                placeholder="Email"
                onChangeText={text => this.setState({ email: text })}
              />
            </View>
          </View>

          <View style={styles.wrapperInput}>
            <View style={styles.wrapperIcon}>
              <FontAwesome5 name="lock" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput
                editable={!this.state.isLoading}
                onChangeText={text => this.setState({ password: text })}
                secureTextEntry
                placeholder="Kata Sandi"
              />
            </View>
          </View>
        </View>

        <View style={styles.wrapperForgotPassword}>
          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={[styles.textButton, styles.textForgotPassword]}>
              Register
            </Text>
          </TouchableNativeFeedback>
          <Text style={[styles.textButton, styles.textForgotPassword]}>
            Lupa Kata Sandi?
          </Text>
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
              <Text style={styles.textButton}>Masuk</Text>
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
)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerInput: {
    marginTop: 72
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
    marginTop: 8
  },
  textButton: {
    fontWeight: 'bold',
    color: 'white',
    margin: 16,
    fontSize: 14
  }
});
