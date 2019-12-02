import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { StackViewTransitionConfigs } from 'react-navigation-stack';

// import Main from '../main';
// import Landing from './landing';
import Auth from './auth';
import App from './app';

const switchNavigator = createSwitchNavigator(
  {
    // Main,
    // Landing,
    Auth,
    App
  },
  {
    initialRouteParams: 'Auth',
    transitionConfig: () => ({
      transitionSpec: 3000,
      screenInterpolator:
        StackViewTransitionConfigs.SlideFromRightIOS.screenInterpolator
    })
  }
);

export default createAppContainer(switchNavigator);
