import {
  createStackNavigator,
  StackViewTransitionConfigs
} from 'react-navigation-stack';

import HomeScreen from '../../Home';

export default createStackNavigator(
  {
    HomeScreen
  },
  {
    initialRouteParams: 'Home',
    transitionConfig: () => ({
      transitionSpec: 3000,
      screenInterpolator:
        StackViewTransitionConfigs.SlideFromRightIOS.screenInterpolator
    })
  }
);
