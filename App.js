import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Button, View, Image, Text, TextInput} from 'react-native';
import Navbar from './Navbar/Navbar';
import ReactNativeGraphs from './ReactNativeGraphs/ReactNativeGraphs';

const App = () => {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollOffset, setLastScrollOffset] = useState(0);
  const [chartNumber, setChartNumber] = useState();
  const [showChart, setShowChart] = useState(false);
  const [graphsArr, setGraphsArr] = useState([]);

  const handleScroll = event => {
    const currentScrollOffset = event.nativeEvent.contentOffset.y;
    const scrollUp = currentScrollOffset < lastScrollOffset;

    if (scrollUp) {
      setNavbarVisible(true);
    } else {
      setNavbarVisible(false);
    }

    setLastScrollOffset(currentScrollOffset);
  };

  const handleCharts = () => {
    if (chartNumber > 0) {
      const newGraphsArr = [];
      for (let i = 0; i < parseInt(chartNumber, 10); i++) {
        newGraphsArr.push(i);
      }
      setShowChart(true);
      setGraphsArr(newGraphsArr);
    } else {
      setShowChart(false);
    }
  };

  return (
    <View>
      <ScrollView onScroll={handleScroll} style={{paddingHorizontal: 20}}>
        {showChart === false && (
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
        )}
        {showChart ? (
          <ReactNativeGraphs graphsArr={graphsArr} />
        ) : (
          <Text style={{textAlign: 'center'}}>
            Please enter a value to get the entered number of graphs!
          </Text>
        )}
      </ScrollView>

      <Navbar navbarVisible={navbarVisible} showChart={showChart} />
    </View>
  );
};

export default App;
