import React, {useState} from 'react';
import {ScrollView, View, Text, TextInput} from 'react-native';
import useAnalytics from '../hook/useAnalytics';

const Home = ({navigation}) => {
  const [chartNumber, setChartNumber] = useState();

  useAnalytics('Home Screen');

  const handleCharts = () => {
    if (chartNumber > 0) {
      navigation.navigate('Graphs', {chartNumber});
    }
  };

  return (
    <View>
      <ScrollView style={{paddingHorizontal: 20}}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text style={{marginBottom: 10}}>
            Enter the number of graphs you want?
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 5,
              padding: 10,
              width: '80%',
            }}
            placeholder="Enter a number"
            onChangeText={text => setChartNumber(text)}
            onSubmitEditing={handleCharts}
            keyboardType="number-pad"
          />
        </View>
        <Text style={{textAlign: 'center'}}>
          Please enter a value to get the entered number of graphs!
        </Text>
      </ScrollView>
    </View>
  );
};

export default Home;
