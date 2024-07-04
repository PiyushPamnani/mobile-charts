import {View, Text} from 'react-native';
import React from 'react';
import useAnalytics from '../hook/useAnalytics';

const Profile = () => {
  useAnalytics('Profile Screen');

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;
