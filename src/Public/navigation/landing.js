import {
  createStackNavigator,
  StackViewTransitionConfigs
} from 'react-navigation';

import ChooseLanguage from '../../Landing/chooseLanguage';
import OnBoarding from '../../Landing/onBoarding';

export default createStackNavigator(
  {
    ChooseLanguage,
    OnBoarding
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
