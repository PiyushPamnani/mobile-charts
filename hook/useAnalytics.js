import {useEffect} from 'react';
import analytics from '@react-native-firebase/analytics';

const useAnalytics = screenName => {
  useEffect(() => {
    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }, [screenName]);
};

export default useAnalytics;
