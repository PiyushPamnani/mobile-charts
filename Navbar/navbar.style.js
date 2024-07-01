import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 30,
    padding: 5,
    flexDirection: 'row',
    width: '80%',
    borderRadius: 8,
    left: 30,
    zIndex: 2,
    justifyContent: 'space-around',
  },

  hiddenNav: {
    display: 'none',
  },
});

export default styles;
