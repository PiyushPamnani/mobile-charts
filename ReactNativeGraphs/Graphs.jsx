import React, {useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import styles from './graphs.style';

const Graphs = ({chartData, setChartImages, index, setLoading, n}) => {
  const chartRefs = useRef([]);

  const captureChartImage = async index => {
    setLoading(true);
    if (chartRefs.current[index]) {
      const chartContainerRef = await captureRef(chartRefs.current[index], {
        format: 'png',
        quality: 0.8,
      });
      setChartImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = chartContainerRef;
        return newImages;
      });
    }
    setLoading(false);
  };

  return (
    <View
      collapsable={false}
      ref={ref => (chartRefs.current[index] = ref)}
      onLayout={() => setTimeout(() => captureChartImage(index), 3000)}
      style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Chart {index + 1}</Text>
      {chartData[index]?.type === 'line' && (
        <LineChart
          data={chartData[index]?.data}
          width={Dimensions.get('window').width - 40}
          height={220}
          isAnimated
          hideAxesAndRules
          hideYAxisText
          spacing={40}
          color="rgb(75,192,192)"
          hideLegend
          yAxisLabelTexts={[]}
          xAxisLabelTexts={[]}
          style={styles.chart}
        />
      )}
      {chartData[index]?.type === 'pie' && (
        <PieChart
          data={chartData[index]?.data}
          donut
          isAnimated
          radius={80}
          centerLabelComponent={() => <Text>Total</Text>}
          strokeWidth={5}
          hideLegend
          colors={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']}
          style={styles.chart}
        />
      )}
      {chartData[index]?.type === 'bar' && (
        <BarChart
          data={chartData[index]?.data}
          barWidth={22}
          spacing={10}
          roundedTop
          barBorderRadius={10}
          height={220}
          isAnimated
          colors={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']}
          hideLegend
          style={styles.chart}
        />
      )}
      {chartData[index]?.type === 'lineArea' && (
        <LineChart
          data={chartData[index]?.data}
          areaChart
          width={Dimensions.get('window').width - 40}
          height={220}
          isAnimated
          hideAxesAndRules
          hideYAxisText
          spacing={40}
          color="rgb(75,192,192)"
          hideLegend
          yAxisLabelTexts={[]}
          xAxisLabelTexts={[]}
          style={styles.chart}
        />
      )}
    </View>
  );
};

export default Graphs;
