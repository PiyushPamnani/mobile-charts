import {TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import styles from './navbar.style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHouse, faUser, faPhone} from '@fortawesome/free-solid-svg-icons';
import Transition from '../Transition/Transition';

const Navbar = ({navbarVisible}) => {
  const navigation = useNavigation();
  return (
    <Transition navbarVisible={navbarVisible} style={styles.navContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesomeIcon icon={faHouse} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesomeIcon icon={faUser} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
        <FontAwesomeIcon icon={faPhone} />
      </TouchableOpacity>
    </Transition>
  );
};

export default Navbar;
