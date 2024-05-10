import {TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './navbar.style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHouse, faUser, faPhone} from '@fortawesome/free-solid-svg-icons';
import Transition from '../Transition/Transition';

const Navbar = ({navbarVisible}) => {
  return (
    <Transition navbarVisible={navbarVisible} style={styles.navContainer}>
      <TouchableOpacity>
        <FontAwesomeIcon icon={faHouse} />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesomeIcon icon={faUser} />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesomeIcon icon={faPhone} />
      </TouchableOpacity>
    </Transition>
  );
};

export default Navbar;
