import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home/Home';
import ReactNativeGraphs from './ReactNativeGraphs/ReactNativeGraphs';
import Navbar from './Navbar/Navbar';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Navbar" component={Navbar} />
        <Stack.Screen name="Graphs" component={ReactNativeGraphs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
