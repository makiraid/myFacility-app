import {
  createStackNavigator,
  StackViewTransitionConfigs
} from 'react-navigation-stack';

import Login from '../../Auth/Login';
import Register from '../../Auth/Register';
import Verify from '../../Auth/Verify';

export default createStackNavigator(
  {
    Login,
    Register,
    Verify
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      transitionSpec: 3000,
      screenInterpolator:
        StackViewTransitionConfigs.SlideFromRightIOS.screenInterpolator
    })
  }
);
