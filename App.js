import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import SplashScreen from 'react-native-splash-screen';

import { persistor, store } from './src/Public/redux/store';
import Navigator from './src/Public/navigation';

class App extends Component {
  componentDidMount() {
    // SplashScreen.hide();
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.Fragment>
            <StatusBar
              animated
              translucent
              backgroundColor="rgba(255,255,255,0.7)"
              barStyle="dark-content"
            />
            <Navigator />
          </React.Fragment>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
