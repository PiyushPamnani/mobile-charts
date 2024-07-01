import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import styles from './navbar.style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHouse, faUser, faPhone} from '@fortawesome/free-solid-svg-icons';
import Transition from '../Transition/Transition';

const Navbar = ({navbarVisible}) => {
  const navigation = useNavigation();
  return (
    /* For smooth transition of Navbar, use this instead of View tag. But the buttons will still be active and will navigate to different screens on click even if they are not visible
      <Transition navbarVisible={navbarVisible} style={styles.navContainer}>
      </Transition>
    */
    <View style={navbarVisible ? styles.navContainer : styles.hiddenNav}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesomeIcon icon={faHouse} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesomeIcon icon={faUser} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
        <FontAwesomeIcon icon={faPhone} />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
