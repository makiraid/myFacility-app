import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Color from '../../Public/Color';

export default class Login extends Component {
  render() {
    return (
      <ImageBackground
        source={require('../../Public/Assets/images/bg.png')}
        style={styles.container}>
        <View style={styles.wrapperHeader}>
          <FontAwesome5 name="bus" color={Color.primary} size={48} />
          <Text style={styles.textTitle}>Manifest Transport</Text>
        </View>

        <View style={styles.containerInput}>
          <View style={styles.wrapperInput}>
            <View style={styles.wrapperIcon}>
              <FontAwesome5 name="envelope" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput placeholder="Email" />
            </View>
          </View>

          <View style={styles.wrapperInput}>
            <View style={styles.wrapperIcon}>
              <FontAwesome5 name="lock" color={Color.primary} size={18} />
            </View>
            <View style={styles.input}>
              <TextInput secureTextEntry placeholder="Kata Sandi" />
            </View>
          </View>
        </View>

        <View style={styles.wrapperForgotPassword}>
          <Text style={[styles.textButton, styles.textForgotPassword]}>
            Lupa Kata Sandi?
          </Text>
        </View>

        <TouchableNativeFeedback
          onPress={() => this.props.navigation.navigate('App')}>
          <View style={styles.button}>
            <Text style={styles.textButton}>Masuk</Text>
          </View>
        </TouchableNativeFeedback>
      </ImageBackground>
    );
  }
}

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
    width: '100%'
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
