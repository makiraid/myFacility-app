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
import { HOST_NAME } from 'react-native-dotenv';
import { toast } from '../../Public/components';
import Axios from 'axios';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      role: {
        complainer: true,
        staff: false
      },
      username: '',
      email: '',
      password: '',
      submitLogin: false
    };
  }

  toggleRole = () => {
    let { role } = this.state;
    this.setState({
      role: {
        complainer: !role.complainer,
        staff: !role.staff
      }
    });
  };

  handleRegister = async () => {
    let { username, email, password, role } = this.state;
    this.setState({ submitLogin: true });
    if (username === '' && email === '' && password === '') {
      this.setState({ submitLogin: false });
      toast('Complete the empty forms');
    } else {
      Axios.post(`${HOST_NAME}api/v1/sign-up`, {
        name: username,
        email: email,
        password: password,
        role: role.staff ? 2 : 1
      })
        .then(async response => {
          const info = {
            email: email,
            password: password
          };
          Axios.post(`${HOST_NAME}api/v1/sign-in`, info)
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
          await this.props.navigation.navigate('App');
        })
        .catch(err => {
          toast(JSON.stringify(err.message));
        })
        .finally(() => {
          this.setState({ submitLogin: false });
        });
    }
  };

  render() {
    const { role, username, password, email, submitLogin } = this.state;
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
              <FontAwesome5 name="user" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={text => this.setState({ username: text })}
              />
            </View>
          </View>

          <View style={styles.wrapperInput}>
            <View style={styles.wrapperIcon}>
              <FontAwesome5 name="envelope" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput
                placeholder="Email"
                value={email}
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
                secureTextEntry
                placeholder="Kata Sandi"
                value={password}
                onChangeText={text => this.setState({ password: text })}
              />
            </View>
          </View>
        </View>

        <View style={styles.wrapperForgotPassword}>
          <TouchableNativeFeedback onPress={() => this.toggleRole()}>
            <View
              style={{
                ...styles.button,
                width: '45%',
                backgroundColor: role.complainer
                  ? Color.tertiary
                  : Color.Disabled
              }}>
              <Text style={styles.textButton}>Complainer</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.toggleRole()}>
            <View
              style={{
                ...styles.button,
                width: '45%',
                backgroundColor: role.staff ? Color.tertiary : Color.Disabled
              }}>
              <Text style={styles.textButton}>Staff</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <TouchableNativeFeedback onPress={() => this.handleRegister()}>
          <View style={styles.button}>
            {submitLogin ? (
              <ActivityIndicator
                color={Color.Background}
                style={styles.textButton}
              />
            ) : (
              <Text style={styles.textButton}>Daftar</Text>
            )}
          </View>
        </TouchableNativeFeedback>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => ({
  setDataRegister: payload =>
    dispatch({
      type: 'POST_REGISTER_FULFILLED',
      payload
    }),
  setDataLogin: payload =>
    dispatch({
      type: 'POST_LOGIN_FULFILLED',
      payload
    })
});

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, mapDispatchToProps)(Register);

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
    justifyContent: 'space-between',
    marginBottom: 20
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
