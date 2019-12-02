import { ToastAndroid } from 'react-native';

import { heightScreenPercent } from '../utils';

const toast = text => {
  ToastAndroid.showWithGravityAndOffset(
    text,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    heightScreenPercent(25)
  );
};

export default toast;
