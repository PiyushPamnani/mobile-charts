import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home/Home';
import ReactNativeGraphs from './ReactNativeGraphs/ReactNativeGraphs';
import Navbar from './Navbar/Navbar';
import Profile from './Profile/Profile';
import Contact from './Contact/Contact';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Navbar" component={Navbar} />
        <Stack.Screen name="Graphs" component={ReactNativeGraphs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Contact" component={Contact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
