import {
  createStackNavigator,
  StackViewTransitionConfigs
} from 'react-navigation-stack';

import Login from '../../Auth/Login';

export default createStackNavigator(
  {
    Login
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
