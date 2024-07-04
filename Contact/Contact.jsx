import {View, Text} from 'react-native';
import React from 'react';
import useAnalytics from '../hook/useAnalytics';

const Contact = () => {
  useAnalytics('Contact Screen');

  return (
    <View>
      <Text>Contact</Text>
    </View>
  );
};

export default Contact;
