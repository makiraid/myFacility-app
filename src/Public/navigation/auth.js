import {
  createStackNavigator,
  StackViewTransitionConfigs
} from 'react-navigation-stack';

import Login from '../../Auth/Login';
import Register from '../../Auth/Register';

export default createStackNavigator(
  {
    Login,
    Register
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
