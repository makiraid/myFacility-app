import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
// import Color from '../Public/Color';

class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home'
  });

  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8
  }
});
