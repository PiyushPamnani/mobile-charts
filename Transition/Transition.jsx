import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';

const Transition = props => {
  const fadeAnim = useRef(
    new Animated.Value(props.navbarVisible ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: props.navbarVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, props.navbarVisible]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}>
      {props.children}
    </Animated.View>
  );
};

export default Transition;
